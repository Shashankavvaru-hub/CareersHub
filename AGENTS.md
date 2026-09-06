# WHITEcarrot — GLOBAL AGENT RULES

> **ALWAYS ENFORCED: TRUE**

Before doing ANY implementation work:

1. Read this `AGENTS.md`.
2. Identify the relevant files in `.ai-rules/`.
3. Read every relevant `.ai-rules/*.md` file.
4. Read the current phase document.
5. Inspect the existing implementation before changing it.
6. Preserve previously approved project decisions.
7. Do not invent requirements.
8. Do not silently change architecture or schema decisions.
9. Stay within the current phase.
10. Perform manual verification before declaring the work complete.

## Rule Priority

Use this order when making decisions:

1. Current explicit product requirement
2. `AGENTS.md`
3. Relevant `.ai-rules/*.md`
4. Approved project/architecture/database decisions
5. Current phase document
6. Existing implementation patterns
7. Framework/library defaults

A library default must NEVER override an explicit project decision.

If two instructions genuinely conflict, STOP and report the conflict instead of silently choosing one.

## Persistent Rule Files

Read the relevant files from:

```text
.ai-rules/