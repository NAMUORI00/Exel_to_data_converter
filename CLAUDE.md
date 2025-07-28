# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excel Data Converter is an Electron-based desktop application that transforms tabular data (Excel/CSV) into a single-row consolidated format. The application specializes in column-wise data consolidation with configurable separators and cell length settings, primarily designed for Korean business users handling data migration tasks.

## Development Commands

### Core Development
```cmd
# 권장 개발 모드 (Windows)
dev.bat                     # 자동으로 빌드 watch와 Electron 실행

# 수동 개발 모드
npm run dev                # Webpack watch + Electron 자동 재시작
npm run build              # 프로덕션 빌드
npm run build:watch        # Development build with file watching
npm start                  # Run production build
```

### Building Distribution
```cmd
npm run build:portable     # 포터블 단일 .exe 파일 생성 (82MB)
npm run build:setup        # NSIS 설치 프로그램 생성
npm run dist              # 포터블 + 설치 프로그램 모두 생성
npm run clean             # 빌드 파일 정리
npm run rebuild           # 클린 빌드
```

**Environment:** This project is developed and built in Windows native environment. All commands should be run in Windows Command Prompt or PowerShell.

**Build Output:** 
- Portable: `release/ExcelDataConverter-Portable-{version}.exe` (약 82MB)
- Setup: `release/ExcelDataConverter-Setup-{version}.exe`

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Ant Design 5.12
- **Desktop**: Electron 27 with dual-process architecture
- **Data Processing**: ExcelJS 4.4 (Excel files), Papa Parse 5.4 (CSV files)
- **Build System**: Webpack 5 with TypeScript, Electron Builder
- **Development Tools**: Nodemon, Concurrently, Sharp (아이콘 생성)
- **Icon**: Windows 365 스타일 구름 아이콘 (자동 생성)

### Process Architecture
- **Main Process** (`src/main.ts`): Handles file I/O, system dialogs, and IPC communication
- **Renderer Process** (`src/renderer/`): React-based UI with three main components:
  - `FileUpload.tsx`: File upload and validation
  - `DataTransform.tsx`: Core transformation logic with column selection and cell length configuration
  - `DataPreview.tsx`: Data visualization with tabbed interface

### Key Components

#### DataTransform Component
The heart of the application - handles the unique transformation logic:
- **Column Selection**: Enable/disable individual columns with checkbox interface
- **Cell Length Configuration**: Each column can be assigned 1-10 cells with configurable separators
- **Consolidation Logic**: Transforms multi-row data into single-row format
- **Real-time Preview**: Shows transformation results at the top (moved from bottom)
- **Unified Interface**: Combined 4 tabs into 2 tabs (컬럼 설정, 옵션 및 프리셋)
- **Chunk Processing**: Large file handling with progress indicators

#### IPC Communication
Main process exposes these handlers:
- `read-excel-file` / `read-csv-file`: File parsing with chunk processing
- `save-excel-file` / `save-csv-file`: Data export with format detection
- `show-save-dialog` / `show-open-dialog`: Native file dialogs
- `save-preset` / `load-preset`: Configuration preset management

## Data Transformation Logic

The application's core feature converts tabular data to consolidated rows:

1. **Input**: Multi-column, multi-row data
2. **Processing**: Each row becomes a single consolidated row with:
   - Data cells from selected columns
   - Configurable separators between data
   - Optional header inclusion
   - Adjustable cell lengths per column
3. **Output**: Single-row format suitable for legacy system integration

Example transformation:
```
Input:  [Name: "John", Age: "30", City: "Seoul"]
Output: [Cell1: "John", Cell2: "", Cell3: "30", Cell4: "Seoul", Cell5: ""]
```

## Development Considerations

### Security Configuration
The application uses Electron's secure defaults with proper IPC communication. File system access is handled through Electron's main process with appropriate validation.

### File Processing
- Excel files are processed using ExcelJS 4.4 with efficient memory usage
- CSV files use Papa Parse 5.4 with header detection and chunk processing
- File uploads support drag-and-drop and file dialog methods
- Large file handling with progress indicators and memory optimization
- Support for .xlsx, .xls, and .csv formats

### Korean Localization
The entire interface is in Korean, designed for Korean business users. All user-facing text, error messages, and documentation are in Korean.

### Build Environment
- **Development**: Windows 10/11 native environment
- **Deployment Target**: Windows 10/11
- **Build Tools**: Node.js 18+, npm, Electron Builder
- **Icon Generation**: Automated with Sharp and png-to-ico

## Testing

Currently, the project has no automated testing framework. The test script in package.json is a placeholder. Consider implementing:
- Unit tests for transformation logic
- Integration tests for file processing
- E2E tests for user workflows

## Git Commit Guidelines

**IMPORTANT**: This repository requires clean commit history without Claude references.

### Commit Message Format
- Use Korean for commit messages when appropriate
- Follow conventional commit format: `feat: 기능 설명`
- Examples:
  - `feat: 컬럼별 셀 길이 설정 기능 구현`
  - `fix: 파일 업로드 오류 수정`
  - `docs: 사용자 가이드 업데이트`

### Author Information
- **Name**: `namuori00`
- **Email**: `namuori00@nauori.net`
- Set with: `git config user.name "namuori00"` and `git config user.email "namuori00@nauori.net"`

### Prohibited Content
**NEVER** include these in commit messages:
- `🤖 Generated with [Claude Code](https://claude.ai/code)`
- `Co-Authored-By: Claude <noreply@anthropic.com>`
- Any Claude references or AI-generated indicators

### Commit Creation
When creating commits, use clean commit messages without any AI attribution. The repository history should appear as if created by human developers.

## Common Development Tasks

### Adding New File Formats
1. Add parser in `src/main.ts` IPC handlers
2. Update file validation in `FileUpload.tsx`
3. Add format option in save dialogs
4. Update file type interface in shared types

### Modifying Transformation Logic
The core transformation is in `DataTransform.tsx`:
- `handleTransform()`: Main transformation function
- `getPreview()`: Real-time preview generation (now at top)
- Column configuration state management
- Preset save/load functionality

### UI Modifications
Key UI improvements implemented:
- Preview moved to top of column settings
- Combined 4 tabs into 2 tabs for better UX
- Added header padding for better spacing
- Windows 365 style cloud icon integration

### Building and Distribution
- Use `npm run build:portable` for single-file executable
- Use `npm run build:setup` for installer version
- Icons are automatically generated from SVG using `scripts/create-cloud-icon.js`
- Build configuration is in both `package.json` and `electron-builder.yml`

### Debugging
- Use `dev.bat` or `npm run dev` for development with DevTools enabled
- Main process logs appear in terminal
- Renderer process logs appear in DevTools console
- Use `--enable-logging` flag for detailed Electron logs

## Performance Considerations

- Large Excel files are handled with chunk-based processing (1,000 rows per chunk)
- CSV processing is more memory-efficient than Excel
- Progress indicators show real-time processing status
- UI remains responsive during processing through proper async handling
- Webpack caching enabled for faster development builds
- Build optimization with maximum compression for smaller executables

## Build Optimization

### Webpack Configuration
- **Caching**: Filesystem cache for faster builds
- **Watch Mode**: Automatic rebuild on file changes
- **Compression**: Maximum compression for production builds

### Electron Builder Configuration
- **Portable Build**: Single executable file (~82MB)
- **NSIS Installer**: Traditional Windows installer
- **Icon Integration**: Automated ICO generation from SVG
- **File Exclusion**: Optimized file inclusion for smaller builds

## Development Workflow

### Recommended Development Process
1. **Start Development**: Run `dev.bat` for automatic watch and reload
2. **Code Changes**: Edit TypeScript/React files with hot reload
3. **Test Build**: Use `npm run build` to test production build
4. **Create Executable**: Use `npm run build:portable` for distribution
5. **Icon Updates**: Modify `scripts/create-cloud-icon.js` and rebuild

### File Structure
```
excel-data-converter/
├── src/
│   ├── main.ts                 # Electron main process
│   ├── renderer/              # React renderer process
│   │   ├── App.tsx            # Main app component (with header padding)
│   │   ├── components/        # UI components
│   │   │   ├── FileUpload.tsx # File upload with drag-and-drop
│   │   │   ├── DataPreview.tsx # Tabbed data visualization
│   │   │   └── DataTransform.tsx # Core transformation (2 tabs)
│   │   └── index.tsx          # React entry point
│   └── shared/                # Common TypeScript types
├── assets/                    # Icons and resources
│   ├── icon.ico              # Windows 365 style cloud icon
│   └── icon.png              # PNG version
├── scripts/
│   └── create-cloud-icon.js   # Automated icon generation
├── release/                   # Build output directory
├── dist/                      # Webpack build output
├── package.json              # NPM configuration with build scripts
├── electron-builder.yml      # Detailed build configuration
├── webpack.config.js         # Webpack configuration with caching
├── tsconfig.json            # TypeScript configuration
├── nodemon.json             # Development auto-restart configuration
└── dev.bat                  # Windows development script
```