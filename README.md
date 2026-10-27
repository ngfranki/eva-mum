# 慢慢小屋 · eva-mum

https://ngfranki.github.io/eva-mum/

- `source/`：網站原始碼（Next.js 靜態輸出）。只有前端，冇密碼、冇 key（`mum-api-shim.js` 入面嘅 Supabase **publishable** key 本身設計就係公開用）。資料同登入全部喺 Supabase Edge Function `eva-mum-api`，要暗號先入到。
- `.github/workflows/publish.yml`：`main` 嘅 `source/` 一有改動，GitHub Actions 就自動 build，再將成品推去 `gh-pages` 分支。
- GitHub Pages 由 `gh-pages` 分支發佈（Settings → Pages → Branch: `gh-pages` / `/ (root)`）。
- 本地試：`cd source && npm ci --ignore-scripts && npm run build`，成品喺 `source/out/`。

`main` 根目錄嘅舊 build 檔案係過渡期用嘅，Pages 轉咗去 `gh-pages` 之後可以另開 PR 清走。
