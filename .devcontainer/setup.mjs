#!/usr/bin/env zx

// info: https://github.com/google/zx

// install pnpm
await $`npm i pnpm@6 --location=global`;

// install dependencies
await $`pnpm i`;

// automatically sign commits
await $`git config --global commit.gpgsign true`;
