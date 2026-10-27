# Portfolio · 我的作品集

纯 HTML + CSS + JS，不用装任何东西，双击 `index.html` 就能看。
深色杂志风，支持浅色模式、手机端、滚动动效。

## 文件说明（只需要记住第一个）

| 文件 | 干嘛的 | 要不要改 |
| --- | --- | --- |
| `js/data.js` | 名字、自我介绍、**作品列表**、成长历程 | ✅ 经常改 |
| `images/` | 放作品截图 | ✅ 往里扔图片 |
| `css/style.css` | 颜色和样式 | 想换主题色就改最上面的 `--accent` |
| `js/main.js` / `index.html` | 页面骨架 | ❌ 一般不用动 |

## 加一个新作品（3 步）

1. 把截图放进 `images/`，比如 `images/game.png`
2. 打开 `js/data.js`，在 `PROJECTS` 里复制一段 `{ ... },` 改成你的内容：
   ```js
   {
     title: "贪吃蛇小游戏",
     date: "2026-11",
     tags: ["小游戏"],
     summary: "我的第一个 JS 游戏",
     details: "学到了：键盘事件、定时器、碰撞判断",
     cover: "images/game.png",
     demo: "",
     code: "",
   },
   ```
   想让它变成大卡片，就加一行 `featured: true,`
3. 保存 → 提交到 GitHub → 网站自动更新

学会新东西了？在 `JOURNEY` 里加一行，"成长历程"会自动多一个节点。

## 发布成网站（GitHub Pages）

仓库 → **Settings** → **Pages** → Source 选 `Deploy from a branch` → 分支选 `main`、文件夹 `/ (root)` → Save。
一两分钟后访问 `https://kllcoco.github.io/Portfolio/`。
