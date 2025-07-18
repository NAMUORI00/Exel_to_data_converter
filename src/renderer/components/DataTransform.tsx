import React, { useState, useEffect } from 'react';
import { Button, InputNumber, Space, Typography, Divider, message, Card, Table, Input, Switch, Select, Row, Col, Checkbox, Modal, Form, Progress, Tabs, Alert, Collapse } from 'antd';
import { SwapOutlined, PlayCircleOutlined, SaveOutlined, FolderOpenOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

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
  const [presetModalVisible, setPresetModalVisible] = useState<boolean>(false);
  const [presetForm] = Form.useForm();
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

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

  const handleTransform = async () => {
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

    // Excel 열 제한 검증 (16,384개 제한)
    const totalCells = getTotalCells();
    if (totalCells > 16384) {
      Modal.error({
        title: 'Excel 열 제한 초과',
        content: (
          <div>
            <p>생성될 셀 수가 Excel의 최대 열 제한(16,384개)을 초과합니다.</p>
            <p><strong>현재 설정으로 생성될 셀 수: {totalCells.toLocaleString()}개</strong></p>
            <p>다음 방법을 시도해보세요:</p>
            <ul>
              <li>컬럼 수를 줄이거나 비활성화</li>
              <li>각 컬럼의 셀 길이를 줄임</li>
              <li>데이터 행 수를 줄임</li>
              <li>CSV 형식으로 저장 (열 제한 없음)</li>
            </ul>
          </div>
        ),
        width: 500
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressText('변환 준비 중...');

    try {
      // 대용량 데이터 처리를 위한 비동기 처리
      const resultCells: string[] = [];
      const actualSeparator = separator === 'custom' ? customSeparator : separator;
      const enabledConfigs = columnConfigs.filter(config => config.enabled);
      
      // 헤더 포함 여부에 따라 처리 (활성화된 컬럼만)
      if (includeHeader) {
        enabledConfigs.forEach(config => {
          resultCells.push(config.name);
          const extraCells = includeDataInLength ? config.cellLength - 1 : config.cellLength;
          for (let i = 0; i < extraCells; i++) {
            resultCells.push(actualSeparator);
          }
        });
      }
      
      // 대용량 데이터를 청크 단위로 처리
      const CHUNK_SIZE = 1000;
      const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
      
      setProgressText(`데이터 변환 중... (0/${totalChunks})`);
      
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, data.length);
        const chunk = data.slice(start, end);
        
        // 각 청크를 처리
        chunk.forEach(row => {
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
        
        // 진행률 업데이트
        const progressPercent = Math.round((chunkIndex + 1) / totalChunks * 50); // 50%까지는 데이터 처리
        setProgress(progressPercent);
        setProgressText(`데이터 변환 중... (${chunkIndex + 1}/${totalChunks})`);
        
        // UI 블로킹 방지를 위한 비동기 처리
        if (chunkIndex % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      // 결과를 배열 형태로 변환 (컬럼명 없이 데이터만)
      setProgressText('결과 데이터 생성 중...');
      const transformedData = [resultCells];
      
      setProgress(100);
      setProgressText('변환 완료!');
      
      onTransform(transformedData);
      message.success(`${data.length.toLocaleString()}개 행의 데이터가 ${resultCells.length.toLocaleString()}개 셀로 변환되었습니다.`);
    } catch (error: any) {
      message.error('데이터 변환 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
      setProgress(0);
      setProgressText('');
    }
  };

  const updateColumnConfig = (index: number, cellLength: number) => {
    const newConfigs = [...columnConfigs];
    newConfigs[index].cellLength = cellLength;
    setColumnConfigs(newConfigs);
  };

  const handleIncludeDataInLengthChange = (checked: boolean) => {
    setIncludeDataInLength(checked);
    
    // 설정 변경 시 기존 0 값들을 조정
    if (checked) {
      // 데이터 길이 포함 ON: 0 값을 1로 변경
      const newConfigs = columnConfigs.map(config => ({
        ...config,
        cellLength: config.cellLength === 0 ? 1 : config.cellLength
      }));
      setColumnConfigs(newConfigs);
    }
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

  const handleSavePreset = async () => {
    setPresetModalVisible(true);
  };

  const handlePresetSave = async (values: any) => {
    const { ipcRenderer } = window.require('electron');
    
    try {
      const result = await ipcRenderer.invoke('show-save-dialog', {
        title: '프리셋 저장',
        defaultPath: `${values.name}.json`,
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        const presetData = {
          name: values.name,
          description: values.description,
          includeHeader,
          separator,
          customSeparator,
          includeDataInLength,
          columnConfigs
        };

        const saveResult = await ipcRenderer.invoke('save-preset', presetData, result.filePath);
        
        if (saveResult.success) {
          message.success('프리셋이 저장되었습니다.');
          setPresetModalVisible(false);
          presetForm.resetFields();
        } else {
          message.error(`프리셋 저장 실패: ${saveResult.error}`);
        }
      }
    } catch (error) {
      message.error('프리셋 저장 중 오류가 발생했습니다.');
    }
  };

  const validatePresetData = (preset: any) => {
    const validationErrors: string[] = [];
    
    // 기본 구조 검증
    if (!preset || typeof preset !== 'object') {
      validationErrors.push('프리셋 파일 형식이 잘못되었습니다.');
      return { isValid: false, errors: validationErrors };
    }
    
    if (!preset.name || typeof preset.name !== 'string') {
      validationErrors.push('프리셋 이름이 없거나 잘못되었습니다.');
    }
    
    if (!preset.settings || typeof preset.settings !== 'object') {
      validationErrors.push('프리셋 설정이 없거나 잘못되었습니다.');
      return { isValid: false, errors: validationErrors };
    }
    
    const settings = preset.settings;
    
    // 설정 값 검증
    if (typeof settings.includeHeader !== 'boolean') {
      validationErrors.push('헤더 포함 설정이 잘못되었습니다.');
    }
    
    if (typeof settings.includeDataInLength !== 'boolean') {
      validationErrors.push('데이터 길이 포함 설정이 잘못되었습니다.');
    }
    
    if (settings.separator !== undefined && typeof settings.separator !== 'string') {
      validationErrors.push('구분자 설정이 잘못되었습니다.');
    }
    
    if (settings.customSeparator !== undefined && typeof settings.customSeparator !== 'string') {
      validationErrors.push('커스텀 구분자 설정이 잘못되었습니다.');
    }
    
    // 컬럼 설정 검증
    if (settings.columnConfigs && !Array.isArray(settings.columnConfigs)) {
      validationErrors.push('컬럼 설정이 잘못된 형식입니다.');
    } else if (settings.columnConfigs) {
      settings.columnConfigs.forEach((config: any, index: number) => {
        if (!config || typeof config !== 'object') {
          validationErrors.push(`컬럼 설정 ${index + 1}번이 잘못되었습니다.`);
          return;
        }
        
        if (!config.name || typeof config.name !== 'string') {
          validationErrors.push(`컬럼 설정 ${index + 1}번의 이름이 잘못되었습니다.`);
        }
        
        if (typeof config.cellLength !== 'number' || config.cellLength < 0 || config.cellLength > 10) {
          validationErrors.push(`컬럼 설정 ${index + 1}번의 셀 길이가 잘못되었습니다. (0-10 범위)`);
        }
        
        if (typeof config.enabled !== 'boolean') {
          validationErrors.push(`컬럼 설정 ${index + 1}번의 활성화 상태가 잘못되었습니다.`);
        }
      });
    }
    
    return { isValid: validationErrors.length === 0, errors: validationErrors };
  };

  const applyPresetSafely = (preset: any) => {
    const warnings: string[] = [];
    let appliedCount = 0;
    
    try {
      // 기본 설정 적용
      if (typeof preset.settings.includeHeader === 'boolean') {
        setIncludeHeader(preset.settings.includeHeader);
        appliedCount++;
      }
      
      if (typeof preset.settings.includeDataInLength === 'boolean') {
        setIncludeDataInLength(preset.settings.includeDataInLength);
        appliedCount++;
      }
      
      if (typeof preset.settings.separator === 'string') {
        setSeparator(preset.settings.separator);
        appliedCount++;
      }
      
      if (typeof preset.settings.customSeparator === 'string') {
        setCustomSeparator(preset.settings.customSeparator);
        appliedCount++;
      }
      
      // 컬럼 설정 적용
      if (preset.settings.columnConfigs && columns.length > 0) {
        const newColumnConfigs = columns.map(col => {
          const savedConfig = preset.settings.columnConfigs.find((c: any) => c.name === col);
          
          if (savedConfig) {
            // 저장된 설정이 유효한지 확인
            const cellLength = Math.max(0, Math.min(10, savedConfig.cellLength || 2));
            const enabled = typeof savedConfig.enabled === 'boolean' ? savedConfig.enabled : true;
            
            if (cellLength !== savedConfig.cellLength) {
              warnings.push(`컬럼 "${col}"의 셀 길이가 ${cellLength}로 조정되었습니다.`);
            }
            
            return { name: col, cellLength, enabled };
          } else {
            warnings.push(`컬럼 "${col}"에 대한 설정이 없어 기본값을 사용합니다.`);
            return { name: col, cellLength: 2, enabled: true };
          }
        });
        
        setColumnConfigs(newColumnConfigs);
        appliedCount++;
      }
      
      return { success: true, appliedCount, warnings };
    } catch (error) {
      return { success: false, appliedCount, warnings, error: error instanceof Error ? error.message : '알 수 없는 오류' };
    }
  };

  const handleLoadPreset = async () => {
    const { ipcRenderer } = window.require('electron');
    
    try {
      const result = await ipcRenderer.invoke('show-open-dialog', {
        title: '프리셋 불러오기',
        properties: ['openFile'],
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const loadResult = await ipcRenderer.invoke('load-preset', result.filePaths[0]);
        
        if (loadResult.success) {
          const preset = loadResult.data;
          
          // 프리셋 데이터 유효성 검증
          const validation = validatePresetData(preset);
          
          if (!validation.isValid) {
            message.error(
              <div>
                <div>프리셋 파일에 오류가 있습니다:</div>
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            );
            return;
          }
          
          // 안전하게 프리셋 적용
          const applyResult = applyPresetSafely(preset);
          
          if (applyResult.success) {
            let successMessage = `프리셋 "${preset.name}"이 적용되었습니다.`;
            
            if (applyResult.warnings.length > 0) {
              Modal.warning({
                title: '프리셋 적용 완료',
                content: (
                  <div>
                    <div style={{ marginBottom: 12 }}>{successMessage}</div>
                    <div style={{ marginBottom: 8 }}>다음 사항을 확인해주세요:</div>
                    <ul style={{ paddingLeft: 16 }}>
                      {applyResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                ),
                width: 500
              });
            } else {
              message.success(successMessage);
            }
          } else {
            message.error(`프리셋 적용 실패: ${applyResult.error}`);
          }
        } else {
          message.error(`프리셋 로드 실패: ${loadResult.error}`);
        }
      }
    } catch (error) {
      message.error('프리셋 로드 중 오류가 발생했습니다.');
    }
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
          min={includeDataInLength ? 1 : 0}
          value={value}
          onChange={(val) => updateColumnConfig(index, val || (includeDataInLength ? 1 : 0))}
          style={{ width: '100%' }}
          size="small"
          disabled={!record.enabled}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Excel 열 제한 경고 */}
      {getTotalCells() > 16384 && (
        <Alert
          type="warning"
          showIcon
          message="Excel 열 제한 초과"
          description={
            <div>
              생성될 셀 수 {getTotalCells().toLocaleString()}개가 Excel 한계(16,384개)를 초과합니다. 
              CSV 저장을 권장하거나 설정을 조정해주세요.
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 변환 실행 버튼 */}
      <Button
        type="primary"
        size="large"
        icon={<PlayCircleOutlined />}
        onClick={handleTransform}
        loading={loading}
        disabled={getEnabledConfigs().length === 0}
        style={{ width: '100%', height: '50px', fontSize: '16px' }}
      >
        1행으로 통합 변환
      </Button>

      {/* 진행률 표시 */}
      {loading && progress > 0 && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>{progressText}</Text>
          </div>
          <Progress 
            percent={progress} 
            size="small" 
            showInfo={true}
            format={(percent) => `${percent}%`}
          />
        </Card>
      )}

      {/* 설정 탭 */}
      <Tabs 
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '컬럼 설정',
            children: (
              <div>
                <Table
                  columns={tableColumns}
                  dataSource={columnConfigs}
                  pagination={false}
                  size="small"
                  rowKey="name"
                  style={{ marginBottom: 16 }}
                />
              </div>
            )
          },
          {
            key: '2',
            label: '기본 설정',
            children: (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>헤더 포함</Text>
                        <Switch
                          checked={includeHeader}
                          onChange={setIncludeHeader}
                          size="small"
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>데이터 길이 포함</Text>
                        <Switch
                          checked={includeDataInLength}
                          onChange={handleIncludeDataInLengthChange}
                          size="small"
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
                
                <Card size="small">
                  <Text style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>셀 간 구분자</Text>
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
                  
                  {separator === 'custom' && (
                    <div style={{ marginTop: 8 }}>
                      <Input
                        value={customSeparator}
                        onChange={(e) => setCustomSeparator(e.target.value)}
                        placeholder="구분자 입력"
                        size="small"
                        maxLength={5}
                      />
                    </div>
                  )}
                </Card>
              </Space>
            )
          },
          {
            key: '3',
            label: '미리보기',
            children: (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card size="small">
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {includeHeader ? '헤더 + 첫 번째 행 미리보기:' : '첫 번째 행 미리보기:'}
                  </Text>
                  <div style={{ 
                    marginTop: 8, 
                    padding: '8px 12px', 
                    background: '#f5f5f5', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    minHeight: '60px'
                  }}>
                    {getPreview()}
                  </div>
                </Card>
                
                <Card size="small">
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div>• 총 행 수: {data.length}개 {includeHeader ? '(헤더 포함)' : ''}</div>
                    <div>• 선택된 컬럼: {getEnabledConfigs().length}개 / 전체 {columnConfigs.length}개</div>
                    <div>• 행당 셀 수: {getCellsPerRow()}개 {includeDataInLength ? '(데이터 포함)' : '(데이터 + 빈칸)'}</div>
                    <div style={{ 
                      color: getTotalCells() > 16384 ? '#ff4d4f' : '#666',
                      fontWeight: getTotalCells() > 16384 ? 'bold' : 'normal'
                    }}>
                      • 최종 총 셀 수: {getTotalCells().toLocaleString()}개
                      {getTotalCells() > 16384 && (
                        <span style={{ color: '#ff4d4f', fontSize: '10px', marginLeft: 8 }}>
                          (Excel 한계 초과!)
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Space>
            )
          },
          {
            key: '4',
            label: '프리셋',
            children: (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleSavePreset}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    프리셋 저장
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    icon={<FolderOpenOutlined />}
                    onClick={handleLoadPreset}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    프리셋 불러오기
                  </Button>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* 프리셋 저장 모달 */}
      <Modal
        title="프리셋 저장"
        open={presetModalVisible}
        onCancel={() => {
          setPresetModalVisible(false);
          presetForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={presetForm}
          layout="vertical"
          onFinish={handlePresetSave}
          initialValues={{
            name: '',
            description: ''
          }}
        >
          <Form.Item
            name="name"
            label="프리셋 이름"
            rules={[
              { required: true, message: '프리셋 이름을 입력해주세요.' },
              { max: 50, message: '프리셋 이름은 50자 이내로 입력해주세요.' }
            ]}
          >
            <Input placeholder="프리셋 이름을 입력하세요" />
          </Form.Item>

          <Form.Item
            name="description"
            label="설명 (선택사항)"
            rules={[
              { max: 200, message: '설명은 200자 이내로 입력해주세요.' }
            ]}
          >
            <Input.TextArea 
              placeholder="프리셋에 대한 설명을 입력하세요" 
              rows={3}
            />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              저장될 설정:
            </Text>
            <ul style={{ fontSize: '11px', marginTop: 8, color: '#666' }}>
              <li>헤더 포함: {includeHeader ? '예' : '아니오'}</li>
              <li>데이터 길이 포함: {includeDataInLength ? '예' : '아니오'}</li>
              <li>구분자: {separator || '없음'}</li>
              <li>컬럼 설정: {columnConfigs.length}개 컬럼</li>
            </ul>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPresetModalVisible(false);
                presetForm.resetFields();
              }}>
                취소
              </Button>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default DataTransform;