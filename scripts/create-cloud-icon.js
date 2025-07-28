const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 아이콘 크기 정의 (Windows ICO 파일을 위한 표준 크기)
const sizes = [16, 24, 32, 48, 64, 128, 256];

// SVG 클라우드 아이콘 (Windows 365 스타일)
const cloudSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0078D4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#40E0D0;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feFlood flood-color="#000000" flood-opacity="0.2"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 배경 원 -->
  <circle cx="128" cy="128" r="120" fill="#F0F9FF" stroke="#E0F2FE" stroke-width="2"/>
  
  <!-- 구름 모양 -->
  <g filter="url(#shadow)">
    <path d="
      M 180 160
      C 200 160, 210 145, 210 130
      C 210 115, 200 100, 180 100
      C 180 80, 165 65, 145 65
      C 130 65, 117 72, 108 82
      C 98 72, 85 65, 70 65
      C 50 65, 35 80, 35 100
      C 15 100, 5 115, 5 130
      C 5 145, 15 160, 35 160
      L 180 160
      Z
    " fill="url(#cloudGradient)" transform="translate(23, 28)"/>
  </g>
  
  <!-- Excel 힌트 (선택적) -->
  <text x="128" y="180" font-family="Segoe UI, Arial" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
    EXCEL
  </text>
</svg>
`;

// 단순한 구름 모양 SVG (더 깔끔한 버전)
const simpleCloudSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5E9FD8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2B7CD3;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 구름 모양 -->
  <g transform="translate(128, 128)">
    <path d="
      M -60 20
      C -60 0, -45 -15, -25 -15
      C -25 -35, -10 -50, 10 -50
      C 25 -50, 38 -42, 45 -30
      C 55 -40, 70 -45, 85 -45
      C 105 -45, 120 -30, 120 -10
      C 120 10, 105 25, 85 25
      L -60 25
      C -80 25, -95 10, -95 -10
      C -95 -30, -80 -45, -60 -45
      C -60 -25, -60 0, -60 20
      Z
    " fill="url(#blueGradient)" stroke="#FFFFFF" stroke-width="3"/>
  </g>
</svg>
`;

async function createIcon() {
    const outputDir = path.join(__dirname, '..', 'assets');
    
    // assets 디렉토리가 없으면 생성
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Windows 365 스타일 구름 아이콘 생성 중...');

    // 1. SVG를 PNG로 변환 (각 크기별로)
    const pngFiles = [];
    
    for (const size of sizes) {
        const pngPath = path.join(outputDir, `icon-${size}.png`);
        
        await sharp(Buffer.from(simpleCloudSvg))
            .resize(size, size)
            .png()
            .toFile(pngPath);
            
        pngFiles.push(pngPath);
        console.log(`✓ ${size}x${size} PNG 생성 완료`);
    }

    // 2. 메인 아이콘 PNG 생성 (256x256)
    const mainPngPath = path.join(outputDir, 'icon.png');
    await sharp(Buffer.from(simpleCloudSvg))
        .resize(256, 256)
        .png()
        .toFile(mainPngPath);
    console.log('✓ 메인 PNG 아이콘 생성 완료');

    // 3. png-to-ico 패키지를 사용하여 ICO 파일 생성
    try {
        // png-to-ico가 설치되어 있는지 확인
        try {
            execSync('npm list png-to-ico', { stdio: 'ignore' });
        } catch (e) {
            console.log('png-to-ico 설치 중...');
            execSync('npm install --save-dev png-to-ico', { stdio: 'inherit' });
        }

        // ICO 파일 생성
        const pngToIco = require('png-to-ico');
        const icoPath = path.join(outputDir, 'icon.ico');
        
        // 다양한 크기의 PNG 파일들을 읽어서 ICO로 변환
        const pngBuffers = await Promise.all(
            [16, 24, 32, 48, 64, 128, 256].map(size => 
                fs.promises.readFile(path.join(outputDir, `icon-${size}.png`))
            )
        );
        
        const icoBuffer = await pngToIco(pngBuffers);
        await fs.promises.writeFile(icoPath, icoBuffer);
        
        console.log('✓ ICO 파일 생성 완료');
        
        // 임시 PNG 파일들 삭제
        for (const pngFile of pngFiles) {
            fs.unlinkSync(pngFile);
        }
        console.log('✓ 임시 파일 정리 완료');
        
    } catch (error) {
        console.error('ICO 생성 중 오류:', error);
        console.log('대체 방법: PNG 파일을 사용하세요.');
    }

    console.log('\n✅ 아이콘 생성 완료!');
    console.log(`📁 위치: ${outputDir}`);
}

// 실행
createIcon().catch(console.error);