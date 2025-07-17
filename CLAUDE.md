# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excel Data Converter is an Electron-based desktop application that transforms tabular data (Excel/CSV) into a single-row consolidated format. The application specializes in column-wise data consolidation with configurable separators and cell length settings, primarily designed for Korean business users handling data migration tasks.

## Development Commands

### Core Development
```bash
npm run dev          # Development mode with hot reload (recommended for development)
npm run build        # Production build
npm run build:watch  # Development build with file watching
npm start           # Run production build
```

### Building Distribution
```bash
npm run build:win   # Create Windows executable (.exe)
```

**Important:** Due to WSL2 symbolic link limitations, Windows executable builds should be run from Windows PowerShell with administrator privileges, not from WSL. See `BUILD-WINDOWS.md` for detailed troubleshooting.

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Ant Design
- **Desktop**: Electron 27 with dual-process architecture
- **Data Processing**: ExcelJS (Excel files), Papa Parse (CSV files)
- **Build System**: Webpack 5 with TypeScript

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
- **Real-time Preview**: Shows transformation results before processing

#### IPC Communication
Main process exposes these handlers:
- `read-excel-file` / `read-csv-file`: File parsing
- `save-excel-file` / `save-csv-file`: Data export
- `show-save-dialog` / `show-open-dialog`: Native file dialogs

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
The application uses `nodeIntegration: true` and `contextIsolation: false` for development convenience. For production deployment, these should be reviewed for security hardening.

### File Processing
- Excel files are processed using ExcelJS with streaming support
- CSV files use Papa Parse with header detection
- File uploads support drag-and-drop and file dialog methods

### Korean Localization
The entire interface is in Korean, designed for Korean business users. All user-facing text, error messages, and documentation are in Korean.

### Build Environment
- **Development**: WSL2 Ubuntu environment
- **Deployment Target**: Windows 10/11
- **Build Issues**: WSL2 has symbolic link permission issues when building Windows executables

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

### Modifying Transformation Logic
The core transformation is in `DataTransform.tsx`:
- `handleTransform()`: Main transformation function
- `getPreview()`: Real-time preview generation
- Column configuration state management

### Debugging
- Use `npm run dev` for development with DevTools enabled
- Main process logs appear in terminal
- Renderer process logs appear in DevTools console

## Performance Considerations

- Large Excel files may cause memory issues
- CSV processing is more memory-efficient than Excel
- Consider implementing streaming for very large datasets
- UI remains responsive during processing through proper async handling