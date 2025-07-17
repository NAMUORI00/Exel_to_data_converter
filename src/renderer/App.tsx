import React, { useState } from 'react';
import { Layout, Typography, Card, Space, Button, message } from 'antd';
import { FileExcelOutlined, FileOutlined, SaveOutlined } from '@ant-design/icons';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import DataTransform from './components/DataTransform';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface FileData {
  data: any[];
  fileName: string;
  fileType: 'excel' | 'csv';
}

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileLoad = (data: FileData) => {
    setFileData(data);
    setTransformedData([]);
    message.success(`${data.fileName} 파일을 성공적으로 로드했습니다.`);
  };

  const handleTransform = (data: any[]) => {
    setTransformedData(data);
    message.success('데이터 변환이 완료되었습니다.');
  };

  const handleSave = async () => {
    if (!transformedData.length) {
      message.warning('저장할 데이터가 없습니다.');
      return;
    }

    setLoading(true);
    
    try {
      const { ipcRenderer } = window.require('electron');
      
      const { canceled, filePath } = await ipcRenderer.invoke('show-save-dialog', {
        defaultPath: 'converted_data.xlsx',
        filters: [
          { name: 'Excel Files', extensions: ['xlsx'] },
          { name: 'CSV Files', extensions: ['csv'] }
        ]
      });

      if (!canceled && filePath) {
        const isExcel = filePath.endsWith('.xlsx');
        const result = await ipcRenderer.invoke(
          isExcel ? 'save-excel-file' : 'save-csv-file',
          transformedData,
          filePath
        );

        if (result.success) {
          message.success('파일이 성공적으로 저장되었습니다.');
        } else {
          message.error(`파일 저장 실패: ${result.error}`);
        }
      }
    } catch (error) {
      message.error('파일 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            <FileExcelOutlined style={{ marginRight: 8 }} />
            Excel Data Converter
          </Title>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSave}
            disabled={!transformedData.length}
          >
            결과 저장
          </Button>
        </div>
      </Header>
      
      <Layout>
        <Sider width={400} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card title="1. 파일 업로드" size="small">
                <FileUpload onFileLoad={handleFileLoad} />
              </Card>
              
              {fileData && (
                <Card title="2. 데이터 변환" size="small">
                  <DataTransform 
                    data={fileData.data} 
                    onTransform={handleTransform}
                  />
                </Card>
              )}
            </Space>
          </div>
        </Sider>
        
        <Content style={{ padding: '24px', background: '#fff' }}>
          {fileData ? (
            <DataPreview 
              originalData={fileData.data}
              transformedData={transformedData}
              fileName={fileData.fileName}
            />
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#8c8c8c'
            }}>
              <div style={{ textAlign: 'center' }}>
                <FileExcelOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <Title level={4} style={{ color: '#8c8c8c' }}>
                  Excel 또는 CSV 파일을 업로드하세요
                </Title>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;