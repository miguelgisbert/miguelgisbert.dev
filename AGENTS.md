# Agent instructions

## Hard rules (never break these)

- **Never run `git commit`, `git push`, `git commit --amend`, or any command that writes to git history or a remote.** Only the user commits and pushes. You may run read-only git commands (`status`, `diff`, `log`, `show`) freely.
- **Never revert, overwrite, or "restore" changes the user has made.** The user's working-tree edits are the source of truth.
- **Before editing a file, read its current content first** and preserve any manual changes. If a requested change conflicts with edits the user has made, stop and ask instead of overwriting.
- Do not reformat or refactor files unrelated to the task.
