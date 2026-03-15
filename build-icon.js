// 创建 Electron 应用图标
// 使用 Canvas 生成一个简单的图标

const fs = require('fs');
const path = require('path');

// 创建一个简单的 ICO 文件（使用 PNG 作为基础）
// 由于无法直接使用 Canvas，我们创建一个简单的解决方案

console.log('创建应用图标...');

// 复制现有的图片作为图标（虽然尺寸不够，但先让打包通过）
const sourceIcon = path.join(__dirname, 'pet', '仓鼠', '1.png');
const iconDir = path.join(__dirname, 'build');

// 创建 build 目录
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// 复制图标文件
const targetIcon = path.join(iconDir, 'icon.png');
fs.copyFileSync(sourceIcon, targetIcon);

console.log('图标已创建:', targetIcon);
console.log('注意：实际发布时请使用 256x256 或更大的图标');
