// 创建一个简单的 256x256 图标
const fs = require('fs');
const path = require('path');

// 创建一个最小的有效 PNG 文件 (256x256 白色背景)
// PNG 文件头 + IHDR 块 + IDAT 块 + IEND 块

function createMinimalPNG(width, height) {
    const zlib = require('zlib');
    
    // PNG 签名
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR 块
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);   // width
    ihdrData.writeUInt32BE(height, 4);  // height
    ihdrData.writeUInt8(8, 8);          // bit depth
    ihdrData.writeUInt8(2, 9);          // color type (RGB)
    ihdrData.writeUInt8(0, 10);         // compression
    ihdrData.writeUInt8(0, 11);         // filter
    ihdrData.writeUInt8(0, 12);         // interlace
    
    const ihdr = createChunk('IHDR', ihdrData);
    
    // 创建图像数据 (简单的白色背景)
    const rowSize = 1 + width * 3; // filter byte + RGB data
    const imageData = Buffer.alloc(rowSize * height);
    
    for (let y = 0; y < height; y++) {
        const rowOffset = y * rowSize;
        imageData[rowOffset] = 0; // filter: none
        
        for (let x = 0; x < width; x++) {
            const pixelOffset = rowOffset + 1 + x * 3;
            // 创建一个渐变效果
            imageData[pixelOffset] = Math.floor(255 * (x / width));     // R
            imageData[pixelOffset + 1] = Math.floor(255 * (y / height)); // G
            imageData[pixelOffset + 2] = 200;                           // B
        }
    }
    
    const compressedData = zlib.deflateSync(imageData);
    const idat = createChunk('IDAT', compressedData);
    
    // IEND 块
    const iend = createChunk('IEND', Buffer.alloc(0));
    
    // 组合所有部分
    return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
    const typeBuffer = Buffer.from(type);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const crcBuffer = Buffer.concat([typeBuffer, data]);
    const crc = require('crypto').createHash('md5').update(crcBuffer).digest();
    const crc32 = Buffer.alloc(4);
    crc32.writeUInt32BE(crc.readUInt32BE(0), 0);
    
    return Buffer.concat([length, typeBuffer, data, crc32]);
}

// 创建图标
const iconBuffer = createMinimalPNG(256, 256);
const iconPath = path.join(__dirname, 'build', 'icon.png');

// 确保 build 目录存在
if (!fs.existsSync(path.join(__dirname, 'build'))) {
    fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
}

fs.writeFileSync(iconPath, iconBuffer);
console.log('✅ 256x256 图标已创建:', iconPath);
