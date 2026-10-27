# 慢慢小屋 · eva-mum

Static build of 慢慢小屋, served by GitHub Pages at https://ngfranki.github.io/eva-mum/

- This repo holds only the compiled static site (no source, no secrets, no personal data).
- Data and login live behind the `eva-mum-api` Supabase Edge Function; access needs the passphrase.
- `mum-api-shim.js` contains the Supabase **publishable** key, which is designed to be public.
- Rebuild from the private source copy with `scripts/publish-pages.sh` (on Franki's iMac).
