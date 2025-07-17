# Windows 실행 파일 빌드 가이드

WSL 환경에서 Windows 실행 파일을 빌드할 때 심볼릭 링크 권한 문제가 발생합니다. 다음 방법들을 시도해보세요.

## 방법 1: Windows PowerShell에서 직접 빌드 (권장)

1. **Windows PowerShell을 관리자 권한으로 실행**
2. 프로젝트 디렉토리로 이동:
   ```powershell
   cd C:\Users\yskim\Documents\Exel_to_data_converter
   ```
3. 빌드 실행:
   ```powershell
   npm run build
   npm run build:win
   ```

## 방법 2: WSL에서 Developer Mode 활성화

1. **Windows 설정** → **업데이트 및 보안** → **개발자용**
2. **개발자 모드** 활성화
3. 컴퓨터 재시작
4. WSL 터미널에서 다시 빌드 시도

## 방법 3: 수동으로 캐시 정리 후 빌드

1. Windows에서 캐시 디렉토리 삭제:
   ```powershell
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache"
   ```
2. WSL에서 node_modules 재설치:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. 빌드 재시도

## 방법 4: 코드 서명 비활성화

package.json에 다음 설정 추가:

```json
"build": {
  "win": {
    "target": [
      {
        "target": "portable",
        "arch": ["x64"]
      }
    ]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  },
  "portable": {
    "artifactName": "Excel-Data-Converter-Portable.exe"
  },
  "extraMetadata": {
    "main": "dist/main.js"
  }
}
```

## 에러 원인

- WSL2는 Windows 파일 시스템에서 심볼릭 링크 생성에 제한이 있음
- electron-builder의 winCodeSign 패키지가 macOS 라이브러리 심볼릭 링크를 생성하려고 시도
- 이는 WSL2의 권한 모델과 충돌

## 권장 해결책

**가장 확실한 방법은 Windows PowerShell에서 직접 빌드하는 것입니다.**