# Excel Data Converter ☁️

Excel 및 CSV 파일의 데이터를 1행으로 통합 변환하는 데스크톱 애플리케이션입니다. 특히 한국 비즈니스 환경에서 데이터 마이그레이션 작업에 최적화되어 있습니다.

## ✨ 주요 기능

### 📁 파일 지원
- **Excel 파일**: .xlsx, .xls 형식 지원
- **CSV 파일**: .csv 형식 지원
- **편리한 업로드**: 드래그&드롭 또는 파일 선택 대화상자
- **대용량 파일**: 청크 단위 처리로 안정적인 대용량 파일 처리

### 🔄 데이터 변환 (핵심 기능)
- **컬럼별 설정**: 각 컬럼마다 개별적으로 활성화/비활성화 가능
- **셀 길이 설정**: 컬럼당 1-10개 셀 할당 (데이터 + 빈칸)
- **유연한 구분자**: 없음, 공백, 대시, 언더바, 커스텀 구분자 지원
- **헤더 포함 옵션**: 헤더를 포함한 변환 가능
- **실시간 미리보기**: 설정 변경 시 즉시 결과 확인
- **Excel 열 제한 경고**: 16,384개 열 제한 초과 시 자동 경고

### 📊 데이터 미리보기 및 분석
- **통합 미리보기**: 변환 결과를 상단에서 즉시 확인
- **상세 통계**: 총 행 수, 선택된 컬럼 수, 셀 수 표시
- **원본/변환 데이터**: 탭으로 구분된 원본 및 변환 데이터 뷰
- **진행률 표시**: 대용량 데이터 변환 시 실시간 진행률

### 💾 결과 저장 및 관리
- **다양한 형식**: Excel (.xlsx), CSV (.csv) 저장
- **프리셋 시스템**: 자주 사용하는 설정을 저장/불러오기
- **자동 파일명**: 날짜 및 설정 기반 자동 파일명 생성

## 🚀 시작하기

### 📦 다운로드 및 설치

#### 포터블 버전 (권장)
- **파일명**: `ExcelDataConverter-Portable.exe`
- **크기**: 약 82MB
- **설치 불필요**: 더블클릭으로 바로 실행
- **USB 배포**: 파일 하나만 복사하면 어디서든 사용 가능

#### 설치 버전
- **파일명**: `ExcelDataConverter-Setup.exe`
- **자동 업데이트**: 설치 후 시작 메뉴에서 실행
- **시스템 통합**: Windows 시작 메뉴 등록

### 💻 개발 환경 설정

#### 전제 조건
- **Node.js**: 18 이상
- **운영체제**: Windows 10/11 (배포 타겟)
- **개발 환경**: Windows Native 또는 WSL2

#### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/NAMUORI00/Exel_to_data_converter.git
   cd Exel_to_data_converter
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 모드 실행**
   ```bash
   # 권장 방법 (Windows)
   dev.bat
   
   # 또는 수동으로
   npm run dev
   ```

4. **빌드 및 배포**
   ```bash
   # 포터블 실행 파일 생성
   npm run build:portable
   
   # 설치 프로그램 생성
   npm run build:setup
   
   # 모든 형식 생성
   npm run dist
   ```

## 📖 사용법

### 1️⃣ 파일 업로드
- 좌측 **"1. 파일 업로드"** 영역에서 파일을 드래그&드롭
- 또는 **"파일 선택"** 버튼으로 파일 선택
- **지원 형식**: Excel(.xlsx, .xls), CSV(.csv)

### 2️⃣ 미리보기 확인
- 파일 업로드 시 자동으로 **미리보기**가 상단에 표시
- **통계 정보**: 총 행 수, 컬럼 수, 예상 셀 수 확인
- **Excel 열 제한**: 16,384개 초과 시 경고 메시지

### 3️⃣ 컬럼 설정
- **"컬럼 설정"** 탭에서 변환할 컬럼 선택
- **체크박스**: 각 컬럼 활성화/비활성화
- **셀 길이**: 각 컬럼당 할당할 셀 수 (1-10개)
- **전체 선택**: 상단 체크박스로 모든 컬럼 토글

### 4️⃣ 옵션 설정
- **"옵션 및 프리셋"** 탭에서 세부 설정
- **헤더 포함**: 첫 번째 행을 헤더로 포함
- **데이터 길이 포함**: 셀 길이에 데이터 포함 여부
- **구분자**: 없음, 공백, 대시, 언더바, 커스텀 구분자

### 5️⃣ 데이터 변환
- **"1행으로 통합 변환"** 버튼 클릭
- **진행률 표시**: 대용량 데이터 처리 시 실시간 진행률
- **결과 확인**: 우측 "변환된 데이터" 탭에서 결과 확인

### 6️⃣ 결과 저장
- 상단 **"결과 저장"** 버튼 클릭
- **저장 형식**: Excel (.xlsx) 또는 CSV (.csv) 선택
- **저장 위치**: 원하는 폴더 및 파일명 지정

### 💾 프리셋 활용
- **저장**: 현재 설정을 JSON 파일로 저장
- **불러오기**: 저장된 설정을 다시 불러와서 사용
- **공유**: 팀원들과 설정 파일 공유 가능

## 🛠️ 기술 스택

### Core Framework
- **Desktop App**: Electron 27 (크로스 플랫폼 데스크톱)
- **Frontend**: React 18 + TypeScript (최신 리액트 생태계)
- **UI Framework**: Ant Design 5.12 (완성도 높은 한국형 UI)

### Data Processing
- **Excel 처리**: ExcelJS 4.4 (.xlsx/.xls 파일 읽기/쓰기)
- **CSV 처리**: Papa Parse 5.4 (고성능 CSV 파서)
- **대용량 처리**: 청크 기반 비동기 처리

### Build & Development
- **번들러**: Webpack 5 (모듈 번들링 및 최적화)
- **패키징**: Electron Builder (Windows 실행 파일 생성)
- **개발 도구**: Nodemon, Concurrently (개발 효율성)
- **언어**: TypeScript 5.3 (타입 안전성)

### Additional Tools
- **이미지 처리**: Sharp (아이콘 생성 및 최적화)
- **아이콘 변환**: png-to-ico (Windows ICO 파일 생성)
- **파일 관리**: Rimraf (크로스 플랫폼 파일 삭제)

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

## ⚙️ 빌드 가이드

### 🔧 개발 명령어

#### 개발 환경
```bash
# 권장 개발 모드 (Windows)
dev.bat                    # 자동으로 빌드 watch와 Electron 실행

# 수동 개발 모드
npm run dev                # Webpack watch + Electron 자동 재시작
npm run build:watch        # Webpack 파일 변경 감지
npm start                  # 빌드된 앱 실행
```

#### 빌드 및 배포
```bash
# 기본 빌드
npm run build              # 프로덕션 빌드
npm run clean              # 빌드 파일 정리
npm run rebuild            # 클린 빌드

# 포터블 배포 (권장)
npm run build:portable     # 단일 .exe 파일 생성 (82MB)

# 설치 프로그램
npm run build:setup        # NSIS 설치 프로그램 생성

# 모든 형식
npm run dist              # 포터블 + 설치 프로그램 모두 생성
```

#### 개발 도구
```bash
npm run typecheck         # TypeScript 타입 체크
```

### 🏗️ 아키텍처 개요

#### Electron 이중 프로세스
- **메인 프로세스** (`src/main.ts`)
  - 파일 I/O 처리 (Excel/CSV 읽기/쓰기)
  - 시스템 대화상자 (파일 선택, 저장)
  - IPC 통신 관리
  
- **렌더러 프로세스** (`src/renderer/`)
  - React 18 + TypeScript UI
  - Ant Design 컴포넌트
  - 사용자 인터랙션 처리

#### 데이터 플로우
```
파일 업로드 → IPC → 메인 프로세스 → 파일 파싱 → 렌더러 → UI 업데이트 → 변환 설정 → 데이터 변환 → 결과 저장
```

### 🎯 빌드 최적화

#### Webpack 설정
- **캐시**: 파일시스템 캐시로 빌드 속도 향상
- **Watch**: 개발 중 자동 리빌드
- **압축**: 프로덕션 빌드 시 최대 압축

#### Electron Builder 설정
- **포터블**: 단일 실행 파일 (설치 불필요)
- **NSIS**: Windows 표준 설치 프로그램
- **아이콘**: Windows 365 스타일 구름 아이콘

## 🔄 변환 로직

### 핵심 변환 과정

#### 1. 파일 파싱
```typescript
// Excel/CSV 파일을 JavaScript 객체 배열로 변환
const data = await parseFile(filePath);
// 결과: [{ 컬럼1: "값1", 컬럼2: "값2" }, ...]
```

#### 2. 컬럼별 설정 적용
```typescript
interface ColumnConfig {
  name: string;        // 컬럼명
  cellLength: number;  // 할당할 셀 수 (1-10)
  enabled: boolean;    // 활성화 여부
}
```

#### 3. 1행 통합 변환
```typescript
// 예시: 3개 컬럼 → 1행으로 통합
원본 데이터:
Row 1: [이름: "홍길동", 나이: "30", 도시: "서울"]
Row 2: [이름: "김철수", 나이: "25", 도시: "부산"]

변환 결과:
[홍길동, "", 30, "", 서울, "", 김철수, "", 25, "", 부산, ""]
```

#### 4. 청크 기반 대용량 처리
- **청크 크기**: 1,000행 단위 처리
- **메모리 효율**: 대용량 파일도 안정적 처리
- **진행률 표시**: 실시간 처리 상황 표시

### 변환 옵션

#### 헤더 처리
```typescript
// 헤더 포함 시: 컬럼명이 결과 첫 번째에 추가
if (includeHeader) {
  결과 = [컬럼명들, 데이터들];
}
```

#### 셀 길이 모드
- **데이터 길이 포함**: 셀 길이에 데이터 셀 포함
- **추가 빈칸 모드**: 데이터 + 지정된 수만큼 빈 셀 추가

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

## 📊 프로젝트 현황

- **버전**: 1.0.0
- **라이선스**: MIT
- **개발 환경**: Windows Native / WSL2
- **배포 타겟**: Windows 10/11
- **패키지 크기**: 약 82MB (포터블)
- **지원 언어**: 한국어

## 🤝 기여하기

1. **Fork** 저장소를 본인 계정으로 포크
2. **Clone** 포크된 저장소를 로컬에 클론
3. **Branch** 새로운 기능 브랜치 생성
4. **Develop** 기능 개발 및 테스트
5. **Commit** 변경사항을 커밋 (한국어 메시지 권장)
6. **Push** 브랜치를 GitHub에 푸시
7. **Pull Request** 원본 저장소로 PR 생성

### 코딩 컨벤션
- **언어**: TypeScript + React Hooks
- **스타일**: Ant Design 컴포넌트 우선 사용
- **커밋**: 한국어 메시지 + 영문 타입 (feat:, fix:, docs: 등)
- **네이밍**: camelCase (변수/함수), PascalCase (컴포넌트)

## 📞 지원 및 문의

- **이슈 리포팅**: [GitHub Issues](https://github.com/NAMUORI00/Exel_to_data_converter/issues)
- **기능 요청**: GitHub Issues에 `enhancement` 라벨로 등록
- **보안 취약점**: 이메일로 비공개 제보

## 📜 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**🏢 비즈니스 사용**: 한국 기업 환경에 최적화  
**☁️ 클라우드 컨셉**: Windows 365 스타일 구름 아이콘  
**⚡ 고성능**: 대용량 Excel 파일 처리 지원