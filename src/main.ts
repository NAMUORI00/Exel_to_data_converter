import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import * as Papa from 'papaparse';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      devTools: isDev  // 개발 모드에서만 개발자 도구 활성화
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    autoHideMenuBar: true,  // 메뉴바 자동 숨김
    show: false  // 창 생성 시 즉시 표시하지 않음
  });

  // 메뉴바 완전 제거
  mainWindow.setMenuBarVisibility(false);
  
  // 프로덕션 모드에서만 개발자 도구 단축키 비활성화
  if (!isDev) {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J 등 개발자 도구 단축키 차단
      if (input.key === 'F12' || 
          (input.control && input.shift && input.key === 'I') ||
          (input.control && input.shift && input.key === 'J') ||
          (input.control && input.shift && input.key === 'C')) {
        event.preventDefault();
      }
    });
  }

  // 페이지 로드 완료 후 창 표시
  mainWindow.webContents.once('ready-to-show', () => {
    mainWindow.show();
    
    // 개발 모드에서만 개발자 도구 열기
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null as any;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for file processing
ipcMain.handle('read-excel-file', async (event, filePath: string) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    const data: any[] = [];
    
    worksheet.eachRow((row, rowNumber) => {
      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        rowData[`col${colNumber}`] = cell.value;
      });
      data.push(rowData);
    });
    
    return {
      success: true,
      data,
      fileName: path.basename(filePath)
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('read-csv-file', async (event, filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const result = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });
    
    return {
      success: true,
      data: result.data,
      fileName: path.basename(filePath)
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('save-excel-file', async (event, data: any[], filePath: string) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    
    if (data.length > 0) {
      // 배열 형태의 데이터를 직접 저장 (헤더 없이)
      data.forEach(row => {
        if (Array.isArray(row)) {
          // 배열인 경우 바로 추가
          worksheet.addRow(row);
        } else {
          // 객체인 경우 값만 추출해서 추가
          const values = Object.values(row);
          worksheet.addRow(values);
        }
      });
    }
    
    await workbook.xlsx.writeFile(filePath);
    
    return {
      success: true,
      message: 'File saved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('save-csv-file', async (event, data: any[], filePath: string) => {
  try {
    // 배열 형태의 데이터를 헤더 없이 CSV로 변환
    const csv = Papa.unparse(data, {
      header: false  // 헤더 없이 데이터만 저장
    });
    fs.writeFileSync(filePath, csv);
    
    return {
      success: true,
      message: 'File saved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('show-save-dialog', async (event, options: any) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options: any) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// 프리셋 저장 핸들러
ipcMain.handle('save-preset', async (event, preset: any, filePath: string) => {
  try {
    const presetData = {
      name: preset.name,
      description: preset.description,
      settings: {
        includeHeader: preset.includeHeader,
        separator: preset.separator,
        customSeparator: preset.customSeparator,
        includeDataInLength: preset.includeDataInLength,
        columnConfigs: preset.columnConfigs
      },
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(presetData, null, 2));
    
    return {
      success: true,
      message: '프리셋이 저장되었습니다.'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

// 프리셋 로드 핸들러
ipcMain.handle('load-preset', async (event, filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const presetData = JSON.parse(fileContent);
    
    return {
      success: true,
      data: presetData
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});