const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createIcon() {
  try {
    const svgPath = path.join(__dirname, '../assets/icon.svg');
    const icoPath = path.join(__dirname, '../assets/icon.ico');
    
    console.log('SVG를 ICO로 변환 중...');
    console.log('입력:', svgPath);
    console.log('출력:', icoPath);
    
    // SVG 읽기
    const svgBuffer = fs.readFileSync(svgPath);
    
    // 256x256 PNG로 변환
    const pngBuffer = await sharp(svgBuffer)
      .png()
      .resize(256, 256)
      .toBuffer();
    
    // PNG를 ICO로 변환 (단순히 PNG를 ICO로 저장)
    await sharp(pngBuffer)
      .resize(256, 256)
      .png()
      .toFile(icoPath.replace('.ico', '.png'));
    
    // ICO 파일 생성을 위해 PNG를 ICO로 복사
    fs.copyFileSync(icoPath.replace('.ico', '.png'), icoPath);
    
    console.log('아이콘 생성 완료!');
    
    // 추가 크기별 PNG 파일들 생성
    const sizes = [16, 32, 48, 64, 128, 256];
    
    for (const size of sizes) {
      const filename = `icon-${size}.png`;
      const outputPath = path.join(__dirname, '../assets', filename);
      
      await sharp(svgBuffer)
        .png()
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`생성됨: ${filename} (${size}x${size})`);
    }
    
    console.log('모든 아이콘 파일 생성 완료!');
    
  } catch (error) {
    console.error('아이콘 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

createIcon();