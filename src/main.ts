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
      webSecurity: false
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

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
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);
      
      data.forEach(row => {
        const values = headers.map(header => row[header]);
        worksheet.addRow(values);
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
    const csv = Papa.unparse(data);
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