# 档期管家 - 项目交接与技术白皮书 ( handover for AI )

这是一个**专为 AI 助理设计的无缝交接说明书**。在切换不同的 AI 模型进行后续开发时，直接把这个文件的内容复制给它，即可让它在 **1 秒钟内彻底掌握项目全局**，继续开展无损开发。

---

## 📅 一、 项目基本信息

* **项目名称**：档期管家 (排班与婚礼档期管理应用)
* **目标用户**：婚礼从业者（支持上 2 休 2 排班制）
* **项目特点**：极简单文件 React 架构，超流畅 iOS 拟物风格，离线可用，100% 数据私密安全。
* **托管地址**：[GitHub - paibanbiao](https://github.com/lizhengjiangyouhe-collab/paibanbiao)
* **运行地址**：[GitHub Pages - 档期管家](https://lizhengjiangyouhe-collab.github.io/paibanbiao/)

---

## 🎨 二、 核心业务功能

1. **智能排班**：支持“上2休2”的自动排班计算，用户仅需设置一次“基准日期”和“基准班次”（W1上班/R1休息），系统便能智能预测全年的排班。
2. **婚礼档期管理**：支持点击日历标记婚礼档期。具备冲突检测（如上班日接单则高亮提示冲突）。支持公休抵扣或替班标记。
3. **行程预约管理 (v3.1.0 新增)**：支持添加三种行程（☕ 见客户、🎤 彩排、📅 其他），可以在同一天添加多个行程，并在日历上直观显示 Emoji。
4. **公休与备份管理**：自动计算年度公休总额、已用和余额。内置「导出数据」（生成 `.json` 文件）与「导入数据」功能，实现跨设备数据完美备份。
5. **PWA 离线运行**：通过内置 Service Worker 缓存，实现无网络状态下的极速“秒开”，并可“添加到 iPhone 主屏幕”作为原生 App 般体验。

---

## 💾 三、 数据管理与防丢失设计 (核心)

* **数据保存位置**：用户的全部数据原封不动保存在手机本地浏览器的 **LocalStorage (缓存)** 中。本系统**没有任何后端服务器**，最大化保护用户隐私。
* **固定存储 Key**：`dangqi_guanjia_v1`
* **历史数据自动迁移**：具备老版本（v2.x 离散 Key 时代）数据安全识别和抓取迁移机制，在新版本挂载时自动无损升级。

---

## 🛠️ 四、 技术架构与最新升级 (2026/05/29)

### 1. 架构：单文件轻量 React (No Bundler)
为了让手机端极其方便地离线运行且不产生繁琐的编译冲突，该项目将 React 18、Tailwind CSS、农历库全部集成在单个 `index.html` 文件内。

### 2. 依赖库 100% 本地化 (最新优化 🚀)
* **修改前**：React/Tailwind/Babel/Lunar 全部请求国外 CDN 服务（`unpkg.com`）。极易在断网、弱网、不开梯子或处于差 WiFi 时产生加载超时，导致 app 卡在白屏无法打开。
* **修改后**：我们已把这 5 个核心依赖包**下载并存放在了本地 `libs/` 目录下**：
  * `libs/react.production.min.js` (React 核心)
  * `libs/react-dom.production.min.js` (React 渲染)
  * `libs/babel.min.js` (Babel Standalone 浏览器编译引擎)
  * `libs/lunar.js` (农历计算)
  * `libs/tailwindcss.js` (Tailwind CSS 浏览器引擎)
* **修改后效果**：PWA 的缓存添加完全在同域名下完成，成功率 100%，彻底告别梯子依赖，弱网和无网环境下**100% 实现秒开**！

### 3. 数据保存“安全锁”机制 (最新优化 🛡️)
* **风险点**：在 React 中，初始化数据读取是挂载后异步执行的，而状态变化的自动保存也是一个监听 Effect。由于挂载时两者会被同时触发，极端卡顿下可能会发生“用空状态覆盖写入 LocalStorage”的数据丢失风险。
* **解法（已部署）**：
  * 在 `App` 组件中引入了 `isDataLoaded` 状态，默认值为 `false`。
  * 只有在第一个 `useEffect` **成功读取本地 LocalStorage 数据并将所有状态设置完毕后**，才将 `isDataLoaded` 设置为 `true`。
  * 自动保存的 `useEffect` 中，首行加入守卫：`if (!isDataLoaded) return;`。
* **效果**：数据未彻底加载前，**绝对锁死**写入功能，彻底消灭了迭代覆盖丢失的竞态 Bug。

---

## 🧭 五、 续写与开发指引 (给后续 AI 助理的提示)

1. **绝对不能修改数据 Key**：存储 Key `dangqi_guanjia_v1` 和数据格式绝对不可以修改，以防止用户现有的排班与婚礼数据在版本更迭时丢失。
2. **严禁破坏“安全锁”**：在对 `App` 状态添加新的全局字段时，确保它们在 `isDataLoaded` 安全锁开启后才参与 LocalStorage 存储。
3. **保持无编译部署**：修改时直接编辑 `index.html` 中的 `<script type="text/babel">`。改动完成后，直接使用 `git add .` -> `git commit` -> `git push` 推送到 `main` 分支。
4. **触发 Service Worker 更新**：如果修改了 `index.html` 或 `sw.js` 本身，为了让用户的手机 Safari 能够立刻自动拉取最新网页，**请务必将 `sw.js` 中的 `CACHE_NAME` 版本号往后加 1**（例如：从 `dangqi-guanjia-v3` 改为 `dangqi-guanjia-v4`）。
