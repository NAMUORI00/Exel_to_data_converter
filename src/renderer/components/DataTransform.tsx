import React, { useState, useEffect } from 'react';
import { Button, InputNumber, Space, Typography, Divider, message, Card, Table, Input, Switch, Select, Row, Col, Checkbox } from 'antd';
import { SwapOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface DataTransformProps {
  data: any[];
  onTransform: (transformedData: any[]) => void;
}

interface ColumnConfig {
  name: string;
  cellLength: number;
  enabled: boolean;
}

const DataTransform: React.FC<DataTransformProps> = ({ data, onTransform }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeHeader, setIncludeHeader] = useState<boolean>(false);
  const [separator, setSeparator] = useState<string>('');
  const [customSeparator, setCustomSeparator] = useState<string>('|');
  const [includeDataInLength, setIncludeDataInLength] = useState<boolean>(false);

  useEffect(() => {
    if (data && data.length > 0) {
      const cols = Object.keys(data[0]);
      setColumns(cols);
      
      // 기본 컬럼 설정: 각 컬럼당 2셀씩 할당, 모든 컬럼 활성화
      const defaultConfigs = cols.map(col => ({
        name: col,
        cellLength: 2,
        enabled: true
      }));
      setColumnConfigs(defaultConfigs);
    }
  }, [data]);

  const handleTransform = () => {
    if (!data || data.length === 0) {
      message.warning('변환할 데이터가 없습니다.');
      return;
    }

    if (columnConfigs.length === 0) {
      message.warning('컬럼 설정이 없습니다.');
      return;
    }

    if (getEnabledConfigs().length === 0) {
      message.warning('선택된 컬럼이 없습니다.');
      return;
    }

    setLoading(true);

    try {
      // 모든 행의 데이터를 1행으로 통합
      const resultCells: string[] = [];
      const actualSeparator = separator === 'custom' ? customSeparator : separator;
      
      // 헤더 포함 여부에 따라 처리 (활성화된 컬럼만)
      const enabledConfigs = columnConfigs.filter(config => config.enabled);
      
      if (includeHeader) {
        // 헤더 먼저 추가
        enabledConfigs.forEach(config => {
          resultCells.push(config.name);
          const extraCells = includeDataInLength ? config.cellLength - 1 : config.cellLength;
          for (let i = 0; i < extraCells; i++) {
            resultCells.push(actualSeparator);
          }
        });
      }
      
      // 데이터 행 추가 (활성화된 컬럼만)
      data.forEach(row => {
        enabledConfigs.forEach(config => {
          const value = row[config.name];
          const cellValue = value !== null && value !== undefined ? String(value) : '';
          
          // 데이터 셀 추가
          resultCells.push(cellValue);
          
          // 추가 셀 계산 및 추가
          const extraCells = includeDataInLength ? config.cellLength - 1 : config.cellLength;
          for (let i = 0; i < extraCells; i++) {
            resultCells.push(actualSeparator);
          }
        });
      });

      // 결과를 객체 형태로 변환 (Excel/CSV 호환)
      const transformedData = [{}];
      resultCells.forEach((cell, index) => {
        transformedData[0][`컬럼_${index + 1}`] = cell;
      });

      onTransform(transformedData);
      message.success(`${data.length}개 행의 데이터가 ${resultCells.length}개 셀로 변환되었습니다.`);
    } catch (error: any) {
      message.error('데이터 변환 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateColumnConfig = (index: number, cellLength: number) => {
    const newConfigs = [...columnConfigs];
    newConfigs[index].cellLength = cellLength;
    setColumnConfigs(newConfigs);
  };

  const updateColumnEnabled = (index: number, enabled: boolean) => {
    const newConfigs = [...columnConfigs];
    newConfigs[index].enabled = enabled;
    setColumnConfigs(newConfigs);
  };

  const toggleAllColumns = (enabled: boolean) => {
    const newConfigs = columnConfigs.map(config => ({
      ...config,
      enabled
    }));
    setColumnConfigs(newConfigs);
  };

  const getEnabledConfigs = () => {
    return columnConfigs.filter(config => config.enabled);
  };

  const getPreview = () => {
    if (!data || data.length === 0 || columnConfigs.length === 0) return '미리보기 없음';
    
    const firstRow = data[0];
    const previewCells: string[] = [];
    const actualSeparator = separator === 'custom' ? customSeparator : separator;
    const enabledConfigs = getEnabledConfigs();
    
    if (enabledConfigs.length === 0) return '선택된 컬럼이 없습니다';
    
    // 헤더 포함 시 헤더 먼저 추가
    if (includeHeader) {
      enabledConfigs.forEach(config => {
        previewCells.push(`[${config.name}]`);
        const extraCells = includeDataInLength ? config.cellLength - 1 : config.cellLength;
        for (let i = 0; i < extraCells; i++) {
          previewCells.push(actualSeparator ? `[${actualSeparator}]` : '[ ]');
        }
      });
    }
    
    // 첫 번째 행 데이터 추가
    enabledConfigs.forEach(config => {
      const value = firstRow[config.name];
      const cellValue = value !== null && value !== undefined ? String(value) : '';
      
      previewCells.push(`[${cellValue}]`);
      const extraCells = includeDataInLength ? config.cellLength - 1 : config.cellLength;
      for (let i = 0; i < extraCells; i++) {
        previewCells.push(actualSeparator ? `[${actualSeparator}]` : '[ ]');
      }
    });
    
    return previewCells.join(' ');
  };

  const getTotalCells = () => {
    const enabledConfigs = getEnabledConfigs();
    const cellsPerRow = enabledConfigs.reduce((total, config) => {
      return total + 1 + (includeDataInLength ? config.cellLength - 1 : config.cellLength);
    }, 0);
    
    const headerCells = includeHeader ? cellsPerRow : 0;
    const dataCells = cellsPerRow * data.length;
    return headerCells + dataCells;
  };

  const getCellsPerRow = () => {
    const enabledConfigs = getEnabledConfigs();
    return enabledConfigs.reduce((total, config) => {
      return total + 1 + (includeDataInLength ? config.cellLength - 1 : config.cellLength);
    }, 0);
  };

  const tableColumns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={columnConfigs.every(config => config.enabled)}
            indeterminate={columnConfigs.some(config => config.enabled) && !columnConfigs.every(config => config.enabled)}
            onChange={(e) => toggleAllColumns(e.target.checked)}
          />
          <span>컬럼명</span>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (value: string, record: ColumnConfig, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={record.enabled}
            onChange={(e) => updateColumnEnabled(index, e.target.checked)}
          />
          <span>{value}</span>
        </div>
      ),
    },
    {
      title: includeDataInLength ? '셀 길이 (데이터 포함)' : '추가 빈칸 수',
      dataIndex: 'cellLength',
      key: 'cellLength',
      width: '60%',
      render: (value: number, record: ColumnConfig, index: number) => (
        <InputNumber
          min={1}
          max={10}
          value={value}
          onChange={(val) => updateColumnConfig(index, val || 1)}
          style={{ width: '100%' }}
          size="small"
          disabled={!record.enabled}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 기본 설정 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong>기본 설정</Text>
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={[8, 8]}>
            <Col span={6}>
              <Text style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>헤더 포함</Text>
              <Switch
                checked={includeHeader}
                onChange={setIncludeHeader}
                size="small"
              />
            </Col>
            <Col span={6}>
              <Text style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>데이터 길이 포함</Text>
              <Switch
                checked={includeDataInLength}
                onChange={setIncludeDataInLength}
                size="small"
              />
            </Col>
            <Col span={12}>
              <Text style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>셀 간 구분자</Text>
              <Select
                value={separator}
                onChange={setSeparator}
                style={{ width: '100%' }}
                size="small"
              >
                <Option value="">없음</Option>
                <Option value=" ">공백</Option>
                <Option value="-">대시</Option>
                <Option value="_">언더바</Option>
                <Option value="custom">커스텀</Option>
              </Select>
            </Col>
          </Row>
          
          {separator === 'custom' && (
            <Row>
              <Col span={12}>
                <Text style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>커스텀 구분자</Text>
                <Input
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  placeholder="구분자 입력"
                  size="small"
                  maxLength={5}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* 컬럼별 셀 길이 설정 */}
      <div>
        <Text strong>컬럼별 셀 길이 설정</Text>
        <Divider style={{ margin: '8px 0' }} />
      </div>

      <Table
        columns={tableColumns}
        dataSource={columnConfigs}
        pagination={false}
        size="small"
        rowKey="name"
        style={{ marginBottom: 16 }}
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          {includeHeader ? '헤더 + 첫 번째 행 미리보기:' : '첫 번째 행 미리보기:'}
        </Text>
        <div style={{ 
          marginTop: 4, 
          padding: '4px 8px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          fontSize: '12px',
          wordBreak: 'break-all',
          fontFamily: 'monospace'
        }}>
          {getPreview()}
        </div>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '11px', color: '#666' }}>
          <div>• 총 행 수: {data.length}개 {includeHeader ? '(헤더 포함)' : ''}</div>
          <div>• 선택된 컬럼: {getEnabledConfigs().length}개 / 전체 {columnConfigs.length}개</div>
          <div>• 행당 셀 수: {getCellsPerRow()}개 {includeDataInLength ? '(데이터 포함)' : '(데이터 + 빈칸)'}</div>
          <div>• 최종 총 셀 수: {getTotalCells()}개</div>
        </div>
      </Card>

      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={handleTransform}
        loading={loading}
        disabled={getEnabledConfigs().length === 0}
        style={{ width: '100%' }}
      >
        1행으로 통합 변환
      </Button>
    </Space>
  );
};

export default DataTransform;