const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// 테스트 데이터 생성 설정
const TEST_DATA_DIR = path.join(__dirname, '../test-data');
const DATA_SIZES = {
  small: 100,       // 100행
  medium: 1000,     // 1,000행
  large: 10000,     // 10,000행
  xlarge: 50000     // 50,000행
};

// 한국어 샘플 데이터
const SAMPLE_DATA = {
  names: [
    '김철수', '이영희', '박민수', '정혜진', '최성호', '윤지영', '임도현', '강수진',
    '오민석', '한예슬', '조현우', '송미나', '배준영', '남궁민', '서윤아', '황태희',
    '노준혁', '문채원', '유재석', '김나영', '이승기', '박보영', '정우성', '전지현',
    '송중기', '김태희', '현빈', '송혜교', '이병헌', '김희애', '조인성', '한지민'
  ],
  departments: [
    '경영관리부', '인사부', '재무부', '마케팅부', '영업부', '기술개발부', 
    '품질관리부', '생산관리부', '구매부', '물류부', '고객서비스부', '법무부'
  ],
  positions: [
    '사원', '주임', '대리', '과장', '차장', '부장', '이사', '상무', '전무', '사장'
  ],
  cities: [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원',
    '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ],
  companies: [
    '삼성전자', 'LG전자', 'SK하이닉스', '현대자동차', 'POSCO', 'KB금융',
    '신한금융', 'LG화학', '셀트리온', '카카오', '네이버', 'CJ제일제당',
    '한국전력', 'KT', 'LG생활건강', '아모레퍼시픽', '롯데케미칼', 'GS칼텍스'
  ],
  products: [
    '스마트폰', '노트북', '태블릿', '스마트워치', '이어폰', '모니터', '키보드',
    '마우스', '프린터', '카메라', '스피커', '냉장고', '세탁기', '에어컨', '텔레비전'
  ]
};

// 랜덤 데이터 생성 함수들
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName() {
  return getRandomItem(SAMPLE_DATA.names);
}

function generateRandomEmail(name) {
  const domains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'yahoo.com'];
  const username = name.replace(/\s+/g, '').toLowerCase();
  return `${username}${Math.floor(Math.random() * 999)}@${getRandomItem(domains)}`;
}

function generateRandomPhone() {
  const prefixes = ['010', '011', '016', '017', '018', '019'];
  const prefix = getRandomItem(prefixes);
  const middle = Math.floor(Math.random() * 9000) + 1000;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${middle}-${last}`;
}

function generateRandomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

function generateRandomSalary() {
  const base = Math.floor(Math.random() * 5000) + 2000; // 2000-7000만원
  return base * 10000; // 만원 단위
}

// 다양한 테스트 데이터셋 생성
function generateEmployeeData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const name = generateRandomName();
    data.push({
      순번: i + 1,
      이름: name,
      부서: getRandomItem(SAMPLE_DATA.departments),
      직급: getRandomItem(SAMPLE_DATA.positions),
      이메일: generateRandomEmail(name),
      전화번호: generateRandomPhone(),
      입사일: generateRandomDate('2010-01-01', '2024-12-31'),
      연봉: generateRandomSalary(),
      거주지: getRandomItem(SAMPLE_DATA.cities),
      상태: Math.random() > 0.1 ? '재직' : '퇴직'
    });
  }
  return data;
}

function generateSalesData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const quantity = Math.floor(Math.random() * 100) + 1;
    const price = Math.floor(Math.random() * 500000) + 50000;
    data.push({
      주문번호: `ORD-${String(i + 1).padStart(6, '0')}`,
      주문일자: generateRandomDate('2023-01-01', '2024-12-31'),
      고객명: generateRandomName(),
      회사명: getRandomItem(SAMPLE_DATA.companies),
      제품명: getRandomItem(SAMPLE_DATA.products),
      수량: quantity,
      단가: price,
      총액: quantity * price,
      배송지: getRandomItem(SAMPLE_DATA.cities),
      주문상태: getRandomItem(['주문확인', '배송준비', '배송중', '배송완료', '취소'])
    });
  }
  return data;
}

function generateInventoryData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const currentStock = Math.floor(Math.random() * 1000);
    const minStock = Math.floor(Math.random() * 100);
    data.push({
      제품코드: `PRD-${String(i + 1).padStart(6, '0')}`,
      제품명: getRandomItem(SAMPLE_DATA.products),
      카테고리: getRandomItem(['전자제품', '가전제품', '사무용품', '생활용품', '의류', '식품']),
      현재재고: currentStock,
      안전재고: minStock,
      재고상태: currentStock <= minStock ? '부족' : '정상',
      단위: getRandomItem(['개', '박스', 'kg', '세트', '팩']),
      공급업체: getRandomItem(SAMPLE_DATA.companies),
      최종입고일: generateRandomDate('2024-01-01', '2024-12-31'),
      단가: Math.floor(Math.random() * 100000) + 1000
    });
  }
  return data;
}

// CSV 파일 생성
function generateCSV(data, filename) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // 쉼표나 따옴표가 포함된 값은 따옴표로 감싸기
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');
  
  fs.writeFileSync(path.join(TEST_DATA_DIR, filename), csvContent, 'utf8');
  console.log(`✅ CSV 파일 생성 완료: ${filename} (${data.length}행)`);
}

// Excel 파일 생성
async function generateExcel(data, filename) {
  if (data.length === 0) return;
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('데이터');
  
  // 헤더 설정
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);
  
  // 헤더 스타일링
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  
  // 데이터 추가
  data.forEach(row => {
    const values = headers.map(header => row[header]);
    worksheet.addRow(values);
  });
  
  // 컬럼 너비 자동 조정
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value) {
        const length = cell.value.toString().length;
        if (length > maxLength) maxLength = length;
      }
    });
    column.width = Math.min(maxLength + 2, 30); // 최대 30자로 제한
  });
  
  await workbook.xlsx.writeFile(path.join(TEST_DATA_DIR, filename));
  console.log(`✅ Excel 파일 생성 완료: ${filename} (${data.length}행)`);
}

// 테스트 데이터 생성 메인 함수
async function generateTestData() {
  console.log('🚀 테스트 데이터 생성 시작...\n');
  
  // test-data 디렉터리 생성
  if (!fs.existsSync(TEST_DATA_DIR)) {
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  }
  
  // 다양한 크기의 테스트 데이터 생성
  for (const [size, count] of Object.entries(DATA_SIZES)) {
    console.log(`📊 ${size} 크기 데이터 생성 중... (${count.toLocaleString()}행)`);
    
    // 직원 데이터
    const employeeData = generateEmployeeData(count);
    await generateCSV(employeeData, `employee_${size}.csv`);
    await generateExcel(employeeData, `employee_${size}.xlsx`);
    
    // 매출 데이터
    const salesData = generateSalesData(count);
    await generateCSV(salesData, `sales_${size}.csv`);
    await generateExcel(salesData, `sales_${size}.xlsx`);
    
    // 재고 데이터
    const inventoryData = generateInventoryData(count);
    await generateCSV(inventoryData, `inventory_${size}.csv`);
    await generateExcel(inventoryData, `inventory_${size}.xlsx`);
    
    console.log(`✅ ${size} 크기 데이터 생성 완료\n`);
  }
  
  // 특수 테스트 케이스
  console.log('🔧 특수 테스트 케이스 생성 중...');
  
  // 단일 컬럼 데이터
  const singleColumnData = Array.from({ length: 1000 }, (_, i) => ({
    '단일컬럼': `데이터${i + 1}`
  }));
  await generateCSV(singleColumnData, 'single_column.csv');
  await generateExcel(singleColumnData, 'single_column.xlsx');
  
  // 많은 컬럼 데이터 (20개 컬럼)
  const manyColumnsData = Array.from({ length: 100 }, (_, i) => {
    const row = {};
    for (let j = 1; j <= 20; j++) {
      row[`컬럼${j}`] = `데이터${i + 1}_${j}`;
    }
    return row;
  });
  await generateCSV(manyColumnsData, 'many_columns.csv');
  await generateExcel(manyColumnsData, 'many_columns.xlsx');
  
  // 빈 셀이 많은 데이터
  const sparseData = Array.from({ length: 500 }, (_, i) => ({
    ID: i + 1,
    이름: Math.random() > 0.3 ? generateRandomName() : '',
    부서: Math.random() > 0.4 ? getRandomItem(SAMPLE_DATA.departments) : '',
    직급: Math.random() > 0.5 ? getRandomItem(SAMPLE_DATA.positions) : '',
    이메일: Math.random() > 0.6 ? generateRandomEmail('user') : '',
    전화번호: Math.random() > 0.7 ? generateRandomPhone() : ''
  }));
  await generateCSV(sparseData, 'sparse_data.csv');
  await generateExcel(sparseData, 'sparse_data.xlsx');
  
  console.log('✅ 특수 테스트 케이스 생성 완료\n');
  
  // 생성된 파일 목록
  const files = fs.readdirSync(TEST_DATA_DIR).filter(file => 
    file.endsWith('.csv') || file.endsWith('.xlsx')
  );
  
  console.log('📁 생성된 테스트 파일 목록:');
  files.forEach(file => {
    const filePath = path.join(TEST_DATA_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
  });
  
  console.log('\n🎉 모든 테스트 데이터 생성 완료!');
  console.log(`총 ${files.length}개 파일이 생성되었습니다.`);
}

// 스크립트 실행
if (require.main === module) {
  generateTestData().catch(console.error);
}

module.exports = { generateTestData };