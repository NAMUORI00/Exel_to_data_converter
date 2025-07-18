const fs = require('fs');
const path = require('path');

// 간단한 ICO 헤더 생성
function createIcoFile() {
  const svgPath = path.join(__dirname, '../assets/icon.svg');
  const icoPath = path.join(__dirname, '../assets/icon.ico');
  
  // SVG 파일을 읽어서 기본 ICO 헤더와 함께 저장
  const svgContent = fs.readFileSync(svgPath);
  
  // ICO 파일 헤더 (6바이트)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved (0)
  header.writeUInt16LE(1, 2); // Image Type (1 = ICO)
  header.writeUInt16LE(1, 4); // Number of images (1)
  
  // ICO 디렉토리 엔트리 (16바이트)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0);     // Width (0 = 256)
  entry.writeUInt8(0, 1);     // Height (0 = 256)
  entry.writeUInt8(0, 2);     // Color palette count (0 = no palette)
  entry.writeUInt8(0, 3);     // Reserved (0)
  entry.writeUInt16LE(1, 4);  // Color planes (1)
  entry.writeUInt16LE(32, 6); // Bits per pixel (32)
  entry.writeUInt32LE(40 + svgContent.length, 8); // Image data size
  entry.writeUInt32LE(22, 12); // Offset to image data
  
  // DIB 헤더 (40바이트)
  const dibHeader = Buffer.alloc(40);
  dibHeader.writeUInt32LE(40, 0);     // Header size
  dibHeader.writeInt32LE(256, 4);     // Width
  dibHeader.writeInt32LE(512, 8);     // Height (double for mask)
  dibHeader.writeUInt16LE(1, 12);     // Color planes
  dibHeader.writeUInt16LE(32, 14);    // Bits per pixel
  dibHeader.writeUInt32LE(0, 16);     // Compression (none)
  dibHeader.writeUInt32LE(0, 20);     // Image size (0 = calculated)
  dibHeader.writeInt32LE(0, 24);      // X pixels per meter
  dibHeader.writeInt32LE(0, 28);      // Y pixels per meter
  dibHeader.writeUInt32LE(0, 32);     // Colors used (0 = all)
  dibHeader.writeUInt32LE(0, 36);     // Important colors (0 = all)
  
  // 모든 부분을 결합
  const icoData = Buffer.concat([header, entry, dibHeader, svgContent]);
  
  // ICO 파일 저장
  fs.writeFileSync(icoPath, icoData);
  
  console.log('ICO 파일이 생성되었습니다:', icoPath);
}

// PNG 파일을 사용하여 ICO 생성 (더 간단한 방법)
function createPngAsIco() {
  const svgPath = path.join(__dirname, '../assets/icon.svg');
  const pngPath = path.join(__dirname, '../assets/icon.png');
  
  // SVG를 PNG로 복사 (임시 방법)
  fs.copyFileSync(svgPath, pngPath);
  
  console.log('PNG 파일이 생성되었습니다:', pngPath);
}

// 일단 PNG만 사용
createPngAsIco();