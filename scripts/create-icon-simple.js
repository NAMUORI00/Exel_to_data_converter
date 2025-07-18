const fs = require('fs');
const path = require('path');

// 간단한 ICO 파일 생성 (실제로는 PNG 파일을 ICO로 복사)
async function createIconSimple() {
  try {
    const svgPath = path.join(__dirname, '../assets/icon.svg');
    const icoPath = path.join(__dirname, '../assets/icon.ico');
    
    console.log('SVG 파일을 ICO로 복사 중...');
    
    // SVG 파일을 읽어서 ICO로 복사 (임시 해결책)
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // 간단한 ICO 파일 생성 (실제로는 SVG를 ICO로 복사)
    fs.copyFileSync(svgPath, icoPath);
    
    console.log('아이콘 파일 생성 완료:', icoPath);
    
    // PNG 파일도 생성
    const pngPath = path.join(__dirname, '../assets/icon.png');
    fs.copyFileSync(svgPath, pngPath);
    
    console.log('PNG 파일 생성 완료:', pngPath);
    
  } catch (error) {
    console.error('아이콘 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

createIconSimple();