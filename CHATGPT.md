# CHATGPT.md: crd-website

Model instructions for CHATGPT sessions in this repository.

## Graphify

- Graphify is the preferred first map for this repository when `graphify-out/graph.json` exists. For architecture, code relationship, project structure, dependency, cleanup, or source-of-truth questions, query the graph before broad manual searches.
- Use `graphify query "<question>"` for natural-language questions against an existing graph. For explicit rebuild, update, cluster, export, or fresh scan requests, follow the installed Graphify skill workflow.
- Treat `graphify-out/` as generated, derived evidence. Do not edit it by hand, and verify important conclusions against source files before changing code, docs, or repository structure.
- Cleanup work should use Graphify to find clusters, bridge nodes, duplication, stale areas, and surprising connections, then turn those findings into reviewed, scoped changes.
