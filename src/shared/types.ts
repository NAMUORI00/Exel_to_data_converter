export interface FileData {
  data: any[];
  fileName: string;
  fileType: 'excel' | 'csv';
}

export interface TransformConfig {
  startColumn: number;
  endColumn: number;
  separator: string;
}

export interface ProcessResult {
  success: boolean;
  data?: any[];
  error?: string;
  message?: string;
}

export interface FileDialogResult {
  canceled: boolean;
  filePath?: string;
  filePaths?: string[];
}