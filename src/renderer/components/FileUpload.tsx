import React, { useState } from 'react';
import { Upload, Button, message, Space } from 'antd';
import { InboxOutlined, FileExcelOutlined, FileOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface FileUploadProps {
  onFileLoad: (data: { data: any[], fileName: string, fileType: 'excel' | 'csv' }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const { ipcRenderer } = window.require('electron');
    
    setLoading(true);
    
    try {
      const filePath = file.path;
      const fileName = file.name;
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
      const isCsv = fileName.endsWith('.csv');
      
      if (!isExcel && !isCsv) {
        message.error('Excel(.xlsx, .xls) 또는 CSV(.csv) 파일만 지원됩니다.');
        return false;
      }

      const result = await ipcRenderer.invoke(
        isExcel ? 'read-excel-file' : 'read-csv-file',
        filePath
      );

      if (result.success) {
        onFileLoad({
          data: result.data,
          fileName: result.fileName,
          fileType: isExcel ? 'excel' : 'csv'
        });
        message.success(`${fileName} 파일을 성공적으로 로드했습니다.`);
      } else {
        message.error(`파일 로드 실패: ${result.error}`);
      }
    } catch (error) {
      message.error('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }

    return false; // prevent default upload behavior
  };

  const handleOpenFile = async () => {
    const { ipcRenderer } = window.require('electron');
    
    try {
      const result = await ipcRenderer.invoke('show-open-dialog', {
        properties: ['openFile'],
        filters: [
          { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
          { name: 'CSV Files', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown';
        
        // Create a mock file object for consistent handling
        const mockFile = {
          path: filePath,
          name: fileName
        } as File;
        
        await handleFileUpload(mockFile);
      }
    } catch (error) {
      message.error('파일 선택 중 오류가 발생했습니다.');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Dragger
        name="file"
        multiple={false}
        beforeUpload={handleFileUpload}
        showUploadList={false}
        style={{ padding: '20px' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          파일을 드래그하거나 클릭하여 업로드
        </p>
        <p className="ant-upload-hint">
          Excel(.xlsx, .xls) 또는 CSV(.csv) 파일을 지원합니다.
        </p>
      </Dragger>
      
      <Button 
        type="default" 
        onClick={handleOpenFile}
        loading={loading}
        style={{ width: '100%' }}
      >
        파일 선택
      </Button>
      
      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <Space>
          <FileExcelOutlined /> Excel
          <FileOutlined /> CSV
        </Space>
      </div>
    </Space>
  );
};

export default FileUpload;