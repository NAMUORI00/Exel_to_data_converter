import React, { useState, useEffect } from 'react';
import { Table, Tabs, Card, Tag, Space, Typography, Statistic, Alert } from 'antd';
import { FileTextOutlined, SwapOutlined, BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DataPreviewProps {
  originalData: any[];
  transformedData: any[];
  fileName: string;
}

const DataPreview: React.FC<DataPreviewProps> = ({ originalData, transformedData, fileName }) => {
  const [originalColumns, setOriginalColumns] = useState<any[]>([]);
  const [transformedColumns, setTransformedColumns] = useState<any[]>([]);

  useEffect(() => {
    if (originalData && originalData.length > 0) {
      const columns = Object.keys(originalData[0]).map((key, index) => ({
        title: key,
        dataIndex: key,
        key: key,
        width: 150,
        ellipsis: true,
        render: (text: any) => (
          <Text style={{ fontSize: '12px' }}>
            {text !== null && text !== undefined ? String(text) : '-'}
          </Text>
        )
      }));
      setOriginalColumns(columns);
    }
  }, [originalData]);

  useEffect(() => {
    if (transformedData && transformedData.length > 0) {
      const allKeys = Object.keys(transformedData[0]);
      
      // 대용량 데이터의 경우 처음 50개 컬럼만 표시
      const MAX_COLUMNS = 50;
      const keysToShow = allKeys.slice(0, MAX_COLUMNS);
      
      const columns = keysToShow.map((key, index) => ({
        title: key,
        dataIndex: key,
        key: key,
        width: 150,
        ellipsis: true,
        render: (text: any) => (
          <Text style={{ fontSize: '12px' }}>
            {text !== null && text !== undefined ? String(text) : '-'}
          </Text>
        )
      }));
      
      setTransformedColumns(columns);
    }
  }, [transformedData]);

  const getDataStats = (data: any[]) => {
    if (!data || data.length === 0) return { rows: 0, columns: 0 };
    return {
      rows: data.length,
      columns: Object.keys(data[0]).length
    };
  };

  const originalStats = getDataStats(originalData);
  const transformedStats = getDataStats(transformedData);

  const tabItems = [
    {
      key: 'original',
      label: (
        <Space>
          <FileTextOutlined />
          원본 데이터
          <Tag color="blue">{originalStats.rows} 행</Tag>
        </Space>
      ),
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Statistic 
              title="데이터 행 수" 
              value={originalStats.rows} 
              prefix={<BarChartOutlined />}
            />
            <Statistic 
              title="컬럼 수" 
              value={originalStats.columns}
              prefix={<BarChartOutlined />}
            />
          </Space>
          
          <Table
            columns={originalColumns}
            dataSource={originalData}
            rowKey={(record, index) => index?.toString() || '0'}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} 항목`
            }}
            scroll={{ x: 'max-content', y: 400 }}
            size="small"
            bordered
          />
        </div>
      )
    }
  ];

  if (transformedData && transformedData.length > 0) {
    tabItems.push({
      key: 'transformed',
      label: (
        <Space>
          <SwapOutlined />
          변환된 데이터
          <Tag color="green">{transformedStats.rows} 행</Tag>
        </Space>
      ),
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Statistic 
              title="데이터 행 수" 
              value={transformedStats.rows}
              prefix={<BarChartOutlined />}
            />
            <Statistic 
              title="컬럼 수" 
              value={transformedStats.columns}
              prefix={<BarChartOutlined />}
            />
          </Space>
          
          {transformedStats.columns > 50 && (
            <Alert
              message="대용량 데이터 알림"
              description={`총 ${transformedStats.columns.toLocaleString()}개의 컬럼 중 처음 50개만 표시됩니다. 전체 데이터를 확인하려면 파일로 저장하세요.`}
              type="info"
              icon={<InfoCircleOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          
          <Table
            columns={transformedColumns}
            dataSource={transformedData}
            rowKey={(record, index) => index?.toString() || '0'}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} 항목`
            }}
            scroll={{ x: 'max-content', y: 400 }}
            size="small"
            bordered
            loading={transformedStats.columns > 1000 && transformedColumns.length === 0}
          />
        </div>
      )
    });
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {fileName}
        </Title>
        <Text type="secondary">
          데이터 미리보기 및 변환 결과
        </Text>
      </div>
      
      <div style={{ flex: 1 }}>
        <Tabs 
          type="card" 
          items={tabItems}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default DataPreview;