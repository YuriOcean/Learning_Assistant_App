// 引入XLSX库（需确保文件路径正确）
const XLSX = require('../../../utils/xlsx.full.min')

/​**​
 * 解析Excel文件并转换为标准课程表格式
 * @param {ArrayBuffer} buffer Excel文件二进制数据
 * @returns {Course[]} 标准化后的课程数据
 */
export function parseExcel(buffer) {
  try {
    // 1. 读取Excel工作簿
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: true, // 自动解析日期
      dateNF: 'HH:mm' // 时间格式定义
    })

    // 2. 获取第一个工作表
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) throw new Error('未找到有效工作表')
    const worksheet = workbook.Sheets[sheetName]

    // 3. 转换为JSON数据（含中文表头映射）
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: ['课程名称', '星期', '开始时间', '结束时间', '教室'],
      range: 1, // 跳过表头行
      defval: '' // 空单元格默认值
    })

    // 4. 数据标准化处理
    return rawData.map((row, index) => ({
      id: `${Date.now()}_${index}`, // 生成唯一ID
      name: _cleanString(row['课程名称']) || `未命名课程-${index + 1}`,
      weekday: _normalizeWeekday(row['星期']),
      startTime: _formatTime(row['开始时间']),
      endTime: _formatTime(row['结束时间']),
      location: _cleanString(row['教室']) || '未指定教室'
    }))

  } catch (err) {
    throw new Error(`Excel解析失败: ${err.message}`)
  }

  // 内部工具函数

  /​**​ 清洗字符串 */
  function _cleanString(str) {
    return str?.toString()
      .replace(/[\n\r\t]/g, '') // 移除控制字符
      .trim() || ''
  }

  /​**​ 标准化星期格式 */
  function _normalizeWeekday(input) {
    const mapping = {
      '一': '周一', '1': '周一', 'Mon': '周一',
      '二': '周二', '2': '周二', 'Tue': '周二',
      '三': '周三', '3': '周三', 'Wed': '周三',
      '四': '周四', '4': '周四', 'Thu': '周四',
      '五': '周五', '5': '周五', 'Fri': '周五',
      '六': '周六', '6': '周六', 'Sat': '周六',
      '日': '周日', '7': '周日', 'Sun': '周日'
    }
    return mapping[input?.toString().trim()] || '未知'
  }

  /​**​ 时间格式化 */
  function _formatTime(value) {
    // 处理Excel数字时间（1900日期系统）
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000))
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }
    
    // 处理文本时间
    const timeStr = value?.toString()
      .replace(/[^0-9:]/g, '') // 移除非时间字符
      .slice(0, 5) || '00:00'
    const [hours = '00', minutes = '00'] = timeStr.split(':')
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
  }
}