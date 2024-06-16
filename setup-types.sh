#!/usr/bin/env bash

if [ ! -f "dist/zodactive-form-svelte.d.ts" ]; then
  echo "dist folder not found, bailing out"
  exit 1
fi

cp src/*.d.ts dist/
sed -Ei "s/^export \{ default as ([^ ]+) \} from '([^']+)\.svelte';$/import \{ default as \1 \} from '\2.svelte.d.ts';\nexport \{ \1 \};/mg" dist/zodactive-form-svelte.d.ts