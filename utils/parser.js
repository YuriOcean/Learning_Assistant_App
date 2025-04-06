const XLSX = require('xlsx');

export function parseExcel(buffer) {
  try {
    // 1. 读取Excel工作簿
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: true,
      dateNF: 'yyyy-mm-dd hh:mm'
    });

    // 2. 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 3. 转换为JSON格式
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: ['课程名称', '星期', '开始时间', '结束时间', '教室'],
      range: 1,
      defval: ''
    });

    // 4. 数据标准化
    return rawData.map((row, index) => ({
      id: `${Date.now()}_${index}`,
      name: cleanString(row['课程名称']) || `未命名课程-${index+1}`,
      weekday: normalizeWeekday(row['星期']),
      startTime: formatTime(row['开始时间']),
      endTime: formatTime(row['结束时间']),
      location: cleanString(row['教室']) || '地点未指定'
    }));

  } catch (err) {
    throw new Error(`Excel解析失败: ${err.message}`);
  }

  // 辅助函数：星期标准化
  function normalizeWeekday(input) {
    const map = {
      '一': '周一', '1': '周一',
      '二': '周二', '2': '周二',
      '三': '周三', '3': '周三',
      '四': '周四', '4': '周四',
      '五': '周五', '5': '周五'
    }
    return map[input?.toString().trim()] || input;
  }

  // 辅助函数：时间格式化
  function formatTime(value) {
    if (value instanceof Date) {
      return `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 处理文本时间
    const timeStr = value?.toString().replace(/[^0-9:]/g, '') || '';
    const [hours = '00', minutes = '00'] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  // 辅助函数：字符串清理
  function cleanString(str) {
    return str?.toString().replace(/[\n\r\t]/g, '').trim() || '';
  }
}

// 网络请求模块（应放在api/request.js中）
const BASE_URL = 'https://your-api-domain.com';

export const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};