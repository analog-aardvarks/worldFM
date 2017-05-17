# Contributing

## General Workflow

1. Fork the repo
2. Add upstream remote
3. Pull dev from upstream
4. Checkout to new feature branch from dev
  - feature-sidebar
  - feature-auth
  - feature-api
5. When ready to merge, checkout to branch dev
6. Merge feature branch with dev
7. Solve any merge conflicts
8. Push to your forked repo
9. Send a pull request from Github to the organization's dev branch

### Important

Prefix each commit like so
  - [feat] Added a new feature
  - [fix] Fixed inconsistent tests [Fixes #0]
  - [refactor] ...
  - [cleanup] ...
  - [test] ...
  - [doc] ...

Make changes and commits on your branch, and make sure that you
only make changes that are relevant to this branch. If you find
yourself making unrelated changes, make a new branch for those
changes.

#### Commit Message Guidelines

- Commit messages should be written in the present tense; e.g. "Fix continuous
  integration script".
- The first line of your commit message should be a brief summary of what the
  commit changes. Aim for about 70 characters max. Remember: This is a summary,
  not a detailed description of everything that changed.
- If you want to explain the commit in more depth, following the first line should
  be a blank line and then a more detailed description of the commit. This can be
  as detailed as you want, so dig into details here and keep the first line short.
