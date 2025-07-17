# Excel Data Converter

Excel 및 CSV 파일의 데이터를 설정 가능한 규칙에 따라 통합하고 변환하는 데스크톱 애플리케이션입니다.

## 주요 기능

### 📁 파일 지원
- Excel 파일 (.xlsx, .xls)
- CSV 파일 (.csv)
- 드래그&드롭 업로드
- 파일 선택 대화상자

### 🔄 데이터 변환
- 컬럼 범위 선택 (시작 컬럼 ~ 끝 컬럼)
- 다양한 구분자 옵션 (공백, 쉼표, 파이프, 대시)
- 실시간 변환 미리보기
- 원본 데이터 보존

### 📊 데이터 미리보기
- 원본 데이터 테이블 뷰
- 변환된 데이터 테이블 뷰
- 데이터 통계 정보 (행 수, 컬럼 수)
- 페이지네이션 및 검색

### 💾 결과 저장
- Excel 형식 (.xlsx)
- CSV 형식 (.csv)
- 사용자 정의 저장 위치

## 시작하기

### 전제 조건
- Node.js 18 이상
- Windows 10/11 (배포 타겟)
- WSL2 (개발 환경)

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd excel-data-converter
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **프로덕션 빌드**
   ```bash
   npm run build
   ```

5. **Windows 실행 파일 생성**
   ```bash
   npm run build:win
   ```

## 사용법

### 1. 파일 업로드
- 애플리케이션 실행 후 좌측 사이드바에서 파일을 드래그&드롭하거나 "파일 선택" 버튼 클릭
- 지원 형식: Excel(.xlsx, .xls), CSV(.csv)

### 2. 데이터 변환 설정
- **시작 컬럼**: 통합을 시작할 컬럼 선택
- **끝 컬럼**: 통합을 끝낼 컬럼 선택
- **구분자**: 컬럼들을 연결할 구분자 선택
- 미리보기에서 결과 확인

### 3. 데이터 변환
- "데이터 변환" 버튼 클릭
- 변환된 결과를 "변환된 데이터" 탭에서 확인

### 4. 결과 저장
- 상단 "결과 저장" 버튼 클릭
- 저장 위치 및 형식 선택 (Excel 또는 CSV)

## 기술 스택

- **Frontend**: React 18, TypeScript, Ant Design
- **Backend**: Node.js, Electron
- **Excel 처리**: ExcelJS
- **CSV 처리**: Papa Parse
- **빌드**: Webpack, Electron Builder

## 프로젝트 구조

```
excel-data-converter/
├── src/
│   ├── main.ts                 # Electron 메인 프로세스
│   ├── renderer/              # React 렌더러 프로세스
│   │   ├── App.tsx            # 메인 앱 컴포넌트
│   │   ├── components/        # UI 컴포넌트들
│   │   │   ├── FileUpload.tsx # 파일 업로드 컴포넌트
│   │   │   ├── DataPreview.tsx # 데이터 미리보기 컴포넌트
│   │   │   └── DataTransform.tsx # 데이터 변환 컴포넌트
│   │   └── index.tsx          # React 진입점
│   └── shared/                # 공통 타입 정의
├── dist/                      # 빌드 결과물
├── package.json
├── webpack.config.js
└── tsconfig.json
```

## 개발 스크립트

- `npm start`: 프로덕션 빌드 실행
- `npm run dev`: 개발 모드 실행 (핫 리로드)
- `npm run build`: 프로덕션 빌드
- `npm run build:watch`: 개발 모드 빌드 (변경 감지)
- `npm run build:win`: Windows 배포 패키지 생성

## 변환 로직

애플리케이션은 다음과 같은 변환 과정을 거칩니다:

1. **데이터 추출**: 선택된 파일에서 데이터를 읽어옴
2. **컬럼 선택**: 사용자가 지정한 시작~끝 컬럼 범위 추출
3. **데이터 결합**: 선택된 컬럼들을 지정된 구분자로 연결
4. **결과 생성**: 변환된 데이터를 새로운 구조로 생성
   - 원본_행번호: 원본 데이터의 행 번호
   - 통합_데이터: 결합된 데이터 문자열
   - 원본_컬럼: 사용된 컬럼들의 이름
   - 컬럼_N_원본명: 각 개별 컬럼의 원본 값

## 문제 해결

### 자주 발생하는 문제들

1. **파일 로드 실패**
   - 파일이 다른 프로그램에서 열려있지 않은지 확인
   - 파일 경로에 특수 문자가 없는지 확인

2. **변환 결과가 비어있음**
   - 원본 데이터에 빈 행이 많지 않은지 확인
   - 시작 컬럼과 끝 컬럼이 올바르게 선택되었는지 확인

3. **메모리 부족**
   - 매우 큰 파일의 경우 시스템 리소스가 부족할 수 있음
   - 파일을 작은 단위로 분할하여 처리

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 지원

문제가 발생하거나 개선 사항이 있으면 이슈를 생성해주세요.

---

**개발 환경**: WSL2 Ubuntu  
**배포 타겟**: Windows 10/11  
**개발 언어**: TypeScript, React, Node.js