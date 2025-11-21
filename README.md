# 🖥️ LED Display Smart Quote Engine (LED 显示屏智能报价引擎):
基于 React + PHP 前后端分离架构构建的高精度 LED 显示屏报价计算系统，集成了动态箱体匹配算法与 CRM 销售线索管理功能。

![React](https://img.shields.io/badge/Frontend-React_18-blue?logo=react)
![Vite](https://img.shields.io/badge/Build-Vite_5-purple?logo=vite)
![PHP](https://img.shields.io/badge/Backend-PHP_8-8892bf?logo=php)
![MySQL](https://img.shields.io/badge/Database-MySQL_8-orange?logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38bdf8?logo=tailwindcss)


---

## 📖 目录 (Table of Contents)

1.  [项目背景与核心功能](#-项目背景与核心功能)
2.  [技术栈架构](#-技术栈架构)
3.  [项目目录结构](#-项目目录结构)
4.  [数据库设计](#-数据库设计)
5.  [本地开发指南](#-本地开发指南)
6.  [生产环境部署 (Deployment)](#-生产环境部署-deployment-重要)
7.  [API 接口文档](#-api-接口文档)

---

## 🚀 项目背景与核心功能

传统 LED 行业报价依赖人工计算，容易出现箱体取整误差、汇率换算错误等问题。本项目旨在提供一个**自动化、零误差**的在线报价解决方案。

### ✨ 核心功能
*   **多场景适配**：支持室内固定、室内租赁、户外固定、户外租赁四种核心场景。
*   **智能算法引擎**：
    *   基于 `Floor` (向下取整) 的箱体数量计算逻辑。
    *   **点间距联动**：根据环境自动过滤可选的点间距 (Pixel Pitch)。
    *   **特殊尺寸适配**：针对 COB 高端系列自动适配特殊箱体尺寸 (600x337.5mm)。
*   **交互体验优化**：原子化 CSS 实现响应式布局，内置规格说明书弹窗，输入防呆校验。
*   **CRM 线索留存**：用户获取正式报价单后，自动将需求参数与客户信息写入 MySQL 数据库。

---

## 🛠 技术栈架构

| 模块 | 技术选型 | 选型理由 |
| :--- | :--- | :--- |
| **前端** | **React 18 + Vite** | 利用 Hook (useState, useEffect) 管理复杂状态；Vite 实现毫秒级热更新。 |
| **样式** | **Tailwind CSS** | 原子化 CSS 减少 40% 样式代码体积，开发效率极高。 |
| **后端** | **Native PHP 8.x** | 轻量级 API 开发，无框架冗余，响应速度 < 50ms。 |
| **数据库** | **MySQL (MariaDB)** | 存储客户线索与历史报价记录。 |
| **服务器** | **Apache (XAMPP)** | 经典的 Web 服务器环境，部署便捷。 |

---

## 📂 项目目录结构

```text
LED_Quote/
├── api/                        # [后端] PHP 接口层
│   ├── api.php                 # 核心报价计算接口
│   ├── data.php                # 产品数据库 (结构化数组)
│   └── submit.php              # 客户线索入库接口
├── assets/                     # [构建产物] 编译后的 JS/CSS 资源
├── index.html                  # [构建产物] 生产环境入口文件
├── led-frontend/               # [前端] React 源码目录
│   ├── src/
│   │   ├── App.jsx             # 主组件 (核心逻辑)
│   │   ├── main.jsx            # 入口文件
│   │   └── index.css           # Tailwind 指令
│   ├── package.json            # 依赖管理
│   ├── tailwind.config.js      # 样式配置
│   └── vite.config.js          # 构建配置
└── README.md                   # 项目说明书
```

---

## 💾 数据库设计

在部署前，请在 MySQL 中执行以下 SQL 语句以初始化数据库：

```sql
-- 1. 创建数据库 (名称必须与 submit.php 中一致)
CREATE DATABASE IF NOT EXISTS led_system;
USE led_system;

-- 2. 创建报价记录表
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL COMMENT '客户姓名',
    company VARCHAR(100) COMMENT '公司名称',
    email VARCHAR(100) COMMENT '联系邮箱',
    country VARCHAR(50) COMMENT '国家',
    environment VARCHAR(50) COMMENT '使用环境',
    preference VARCHAR(50) COMMENT '产品偏好',
    pixel_pitch DECIMAL(10, 4) COMMENT '点间距(Pitch)',
    screen_width DECIMAL(10, 2) COMMENT '屏宽(m)',
    screen_height DECIMAL(10, 2) COMMENT '屏高(m)',
    product_model VARCHAR(100) COMMENT '推荐型号',
    cabinet_size VARCHAR(50) COMMENT '箱体尺寸',
    total_cabinets INT COMMENT '箱体总数',
    total_price DECIMAL(15, 2) COMMENT 'FOB总价',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 💻 本地开发指南

如果你需要修改源码，请遵循以下步骤：

### 1. 环境准备
*   安装 **Node.js** (v16+)
*   安装 **XAMPP** (开启 Apache 和 MySQL)

### 2. 启动前端开发服务器
```bash
# 进入源码目录
cd led-frontend

# 安装依赖 (仅首次)
npm install

# 启动热更新服务器
npm run dev
```
此时访问 `http://localhost:5173` 可进行开发预览。

---

## 🚀 生产环境部署 (Deployment) [重要]

本项目采用**前后端分离开发，混合部署**的模式。请严格按照以下步骤将项目发布到 XAMPP 服务器。

### 第一步：配置构建路径
修改 `led-frontend/vite.config.js`，添加相对路径配置，防止部署后白屏：

```javascript
export default defineConfig({
  plugins: [react()],
  base: './', // <--- 必须配置为相对路径，否则 assets 引用会报 404
})
```

### 第二步：编译前端代码
在 `led-frontend` 目录下运行构建命令：

```bash
npm run build
```
*成功后，会在 `led-frontend` 目录下生成一个 `dist` 文件夹。*

### 第三步：部署文件 (搬家)
假设你的 XAMPP 根目录为 `D:\XAMPP\htdocs\LED_Quote\`：

1.  将 `led-frontend/dist/` 文件夹内的 **所有内容**（`assets` 文件夹, `index.html`）复制。
2.  **粘贴** 到项目根目录 `D:\XAMPP\htdocs\LED_Quote\` 中，覆盖原有文件。
3.  确保 `api` 文件夹也在根目录下，且包含 `api.php`, `data.php`, `submit.php`。

### 第四步：后端数据库配置
打开 `api/submit.php`，确保数据库配置与本地一致：

```php
$servername = "localhost";
$username = "root";
$password = "";      // XAMPP 默认密码为空
$dbname = "led_system"; // 必须与 SQL 中的库名一致
```

### 第五步：验证
打开浏览器访问：`http://localhost/LED_Quote/`
*   如果页面正常显示且能计算，说明部署成功。
*   如果点击提交能存入数据库，说明全栈链路通畅。

---
<img width="3072" height="1582" alt="image" src="https://github.com/user-attachments/assets/6a0277dc-218c-4b97-bf98-a6a0f9e30208" />

<img width="3072" height="1582" alt="image" src="https://github.com/user-attachments/assets/a4e9a56d-94f3-45af-9d64-ee8905187976" />




## 📡 API 接口文档

### 1. 报价计算接口
*   **Endpoint**: `/api/api.php`
*   **Method**: `POST`
*   **Request Body (JSON)**:
    ```json
    {
      "environment": "室内",
      "preference": "性价比",
      "width": 3,
      "height": 2,
      "pitch": 2.5
    }
    ```
*   **Response**: 返回推荐的产品型号、箱体规格、计算后的总价及单价。

### 2. 销售线索提交接口
*   **Endpoint**: `/api/submit.php`
*   **Method**: `POST`
*   **Function**: 接收包含客户信息(`client_name`, `email`...) 和计算结果(`total_price`...) 的完整 JSON 包，并写入 MySQL。

---

<img width="3056" height="1668" alt="image" src="https://github.com/user-attachments/assets/3d9386a6-013e-486a-8569-ba98e1e9c20c" />

