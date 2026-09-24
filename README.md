# あなたに合うお香診断

7つの質問に答えると、今の自分に合う香りの楽しみ方を「塗香」「文香」「お線香」の3種類から提案する静的Webアプリです。

- スマートフォン・PC対応
- 登録、ログイン、APIキー不要
- 個人情報を取得しません
- GitHub Pagesでそのまま公開可能

## ファイル構成

```text
raika/
├─ index.html       画面と文章、SEO設定
├─ css/style.css    色、レイアウト、レスポンシブ表示
├─ js/app.js        質問、採点、同点判定、共有機能
├─ images/          3種類のお香の写真
└─ README.md
```

## ローカルで確認する方法

簡単な確認は `index.html` をダブルクリックしてブラウザで開きます。共有機能まで確認する場合は、このフォルダで次を実行して `http://localhost:8000` を開きます。

```powershell
python -m http.server 8000
```

## 写真を差し替える方法

`images` フォルダ内の次のファイルを、同じ名前のJPEG画像に置き換えてください。

- `zukou.jpg`：塗香
- `fumikou.jpg`：文香
- `osenkou.jpg`：お線香

## 文章や質問を変更する場所

- トップ画面や説明文：`index.html`
- 質問、点数、結果文：`js/app.js`
- 色や文字サイズ：`css/style.css`

質問の点数は `js/app.js` の各質問にある `weight` で設定します。同点の場合は「質問1の回答 → 質問7の回答 → 塗香 → 文香 → お線香」の順で決まります。

## GitHubへアップロードする方法

```powershell
git add .
git commit -m "Create incense recommendation quiz"
git branch -M main
git remote add origin https://github.com/santai8/raika.git
git push -u origin main
```

すでに `origin` がある場合、`git remote add origin ...` は不要です。

## GitHub Pagesで公開する方法

1. GitHubで `santai8/raika` リポジトリを開く
2. `Settings` → `Pages` を開く
3. `Build and deployment` の `Source` を **Deploy from a branch** にする
4. Branchを **main**、フォルダを **/(root)** にして `Save`
5. 数分後、`https://santai8.github.io/raika/` で公開されます

## 表現について

このアプリは香りの楽しみ方を提案するもので、医学的・心理学的な診断ではありません。運気、金運、浄化などの効果を保証するものでもありません。
