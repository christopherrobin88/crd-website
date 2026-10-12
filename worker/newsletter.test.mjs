import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleNewsletter } from './newsletter.ts';

const valid = { email: 'reader@example.com', consent: true, consentVersion: 'crd-studio-notes-v1', website: '' };
function fixture(overrides = {}) {
  const sent = [];
  const keys = [];
  const env = {
    CONTACT_INBOX: 'owner@example.com', ENQUIRY_FROM: 'enquiries@example.com',
    ENQUIRY_RATE: { async limit({ key }) { keys.push(key); return { success: true }; } },
    EMAIL: { async send(message) { sent.push(message); } },
    ...overrides,
  };
  return { env, sent, keys };
}
function request(body = valid, options = {}) {
  return new Request('https://christopherrobindesign.com/api/newsletter', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://christopherrobindesign.com', 'CF-Connecting-IP': '192.0.2.1' },
    body: JSON.stringify(body), ...options,
  });
}

test('sends a private consent record to the configured owner, not a submitted recipient', async () => {
  const f = fixture();
  const res = await handleNewsletter(request({ ...valid, to: 'other@example.com' }), f.env);
  assert.equal(res.status, 200); assert.equal(f.sent.length, 1);
  const mail = f.sent[0];
  assert.equal(mail.to, 'owner@example.com'); assert.equal(mail.replyTo, valid.email);
  assert.equal(mail.subject, '[CRD Studio notes] New signup request');
  assert(mail.text.includes("I'd like to receive CRD marketing emails. I can unsubscribe at any time."));
  assert(mail.text.includes('Consent version: crd-studio-notes-v1'));
  assert.match(mail.text, /Received \(UTC\): \d{4}-\d\d-\d\dT/);
  assert(mail.text.includes('Email ownership has not been verified'));
  assert(!mail.text.includes('192.0.2.1'));
  assert.deepEqual(f.keys, ['studio-notes:192.0.2.1']);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});

test('requires current explicit consent and a valid email before sending', async () => {
  for (const body of [
    { ...valid, consent: false }, { ...valid, consent: 'true' }, { ...valid, consentVersion: 'old' },
    { ...valid, email: 'bad\r\nBcc: victim@example.com' }, { ...valid, email: 'a'.repeat(255)+'@example.com' },
    null, [], 'signup',
  ]) {
    const f=fixture();assert.equal((await handleNewsletter(request(body),f.env)).status,400);assert.equal(f.sent.length,0);
  }
});

test('rejects cross-origin, malformed and oversized requests without sending', async () => {
  for (const [req, expected] of [
    [request(valid,{headers:{Origin:'https://other.example','Content-Type':'application/json'}}),403],
    [request(valid,{headers:{'Content-Type':'text/plain'}}),415],
    [request(valid,{body:'{'}),400],
    [request(valid,{body:JSON.stringify({...valid,extra:'x'.repeat(3000)})}),413],
  ]) { const f=fixture();assert.equal((await handleNewsletter(req,f.env)).status,expected);assert.equal(f.sent.length,0); }
});

test('limits chunked body bytes, without relying on Content-Length', async () => {
  const f=fixture();const stream=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('x'.repeat(2049)));c.close();}});
  const req=request(valid,{body:stream,duplex:'half'});
  assert.equal((await handleNewsletter(req,f.env)).status,413);assert.equal(f.sent.length,0);
});

test('honeypot never sends, rate limits and missing bindings fail closed', async () => {
  const bot=fixture();assert.equal((await handleNewsletter(request({...valid,website:'spam'}),bot.env)).status,200);assert.equal(bot.sent.length,0);
  const limited=fixture({ENQUIRY_RATE:{async limit(){return {success:false};}}});
  assert.equal((await handleNewsletter(request(),limited.env)).status,429);assert.equal(limited.sent.length,0);
  for(const binding of ['EMAIL','ENQUIRY_RATE']){
    const f=fixture({[binding]:undefined});assert.equal((await handleNewsletter(request(),f.env)).status,503);assert.equal(f.sent.length,0);
  }
  const f=fixture();assert.equal((await handleNewsletter(new Request('https://christopherrobindesign.com/api/newsletter'),f.env)).status,405);
});

test('awaits sending and never acknowledges an email send failure', async () => {
  let release;
  const pending=new Promise(resolve=>{release=resolve;});
  const f=fixture({EMAIL:{async send(){await pending;throw new Error('test failure');}}});
  let returned=false;const result=handleNewsletter(request(),f.env).then(r=>{returned=true;return r;});
  await new Promise(r=>setTimeout(r,10));assert.equal(returned,false);release();
  assert.equal((await result).status,502);
});
