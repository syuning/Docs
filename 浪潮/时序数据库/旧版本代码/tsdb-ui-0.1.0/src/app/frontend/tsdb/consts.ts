export const aggFuns = [
    { label: '平均值/AVG', value: 'avg' },
    { label: '计数/COUNT', value: 'count' },
    { label: '偏差/DEV', value: 'dev' },
    { label: '最初值/FIRST', value: 'first' },
    { label: '最末值/LAST', value: 'last' },
    { label: '最大值/MAX', value: 'max' },
    { label: '最小值/MIN', value: 'min' },
    { label: '求和/SUM', value: 'sum' }
  ];

export const interpolations = [
    { label: 'None', value: 'none' },
    { label: 'NaN', value: 'nan' },
    { label: 'Null', value: 'null' },
    { label: 'Zero', value: 'zero' }
  ];

export const filterTypes = [
    { label: 'LITERAL_OR', value: 'literal_or' },
    { label: 'ILITERAL_OR', value: 'iliteral_or' },
    { label: 'NOT_LITERAL_OR', value: 'not_literal_or' },
    { label: 'NOT_ILITERAL_OR', value: 'not_iliteral_or' },
    { label: 'WILDCARD', value: 'wildcard' },
    { label: 'IWILDCARD', value: 'iwildcard' },
    { label: 'REGEXP', value: 'regexp' }
];

export const timeUnitOptions = [
    { label: '小时', value: 'h' },
    { label: '分钟', value: 'm' },
    { label: '天', value: 'd' },
    { label: '周', value: 'w' },
    { label: '月', value: 'n' },
    { label: '年', value: 'y' },
    { label: '秒', value: 's' },
    { label: '毫秒', value: 'ms' }
];

export const metrics = [
    {label: '温度/temperature', value: 'temperature'},
    {label: '湿度/humid', value: 'humid'},
    {label: '风度/wind', value: 'wind'},
    {label: '降水/precipitation', value: 'precipitation'},
    {label: '空气质量/pm25', value: 'pm25'},
  ];

export const tags = [
    'city', 'zcode', 'isoke'
  ];

export const cities = [
  '北京', '上海', '广州', '深圳', '杭州'
];

export const userTypes = [
     { label: '应用用户', value: 'RW' },
     { label: '数据源用户', value: 'WO' },
     { label: '管理用户', value: 'ADMIN' }
    ];

export const subdomain = {
  mode: 'default',
  labelKey: 'label',
  valueKey: 'value',
  datas: []
};

export const specData = [
  { dataPoint: 3000, timeSeries: 500000, planCode: 'std_3000' },
  { dataPoint: 10000, timeSeries: 1000000, planCode: 'std_10000' },
  { dataPoint: 15000, timeSeries: 2000000, planCode: 'std_15000' },
  { dataPoint: 30000, timeSeries: 4000000, planCode: 'std_30000' },
  { dataPoint: 50000, timeSeries: 8000000, planCode: 'std_50000' },
];

export const durationList = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5', value: '5'},
  {label: '6', value: '6'},
  {label: '7', value: '7'},
  {label: '8', value: '8'},
  {label: '9', value: '9'}
];