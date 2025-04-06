const XLSX = require('../../../utils/xlsx.full.min')

Page({
  data: {
    progress: 0,
    uploading: false,
    errorMsg: ''
  },

  // 文件导入入口
  async handleFileImport() {
    if (this.data.uploading) return
    
    try {
      const res = await wx.chooseMessageFile({
        count: 1,
        type: 'file'
      })
      
      const file = res.tempFiles[0]
      await this.validateFile(file)
      
      this.setData({ uploading: true, progress: 5 })
      
      const buffer = await this.readFileWithRetry(file.path, 3)
      this.updateProgress(30)
      
      const courseData = await this.parseExcel(buffer)
      this.updateProgress(70)
      
      await this.uploadSchedule(courseData)
      this.updateProgress(100)
      
      wx.showToast({ title: '导入成功' })
      
    } catch (err) {
      console.error('[Import Error]', err)
      this.handleError(err)
    } finally {
      this.setData({ uploading: false })
    }
  },

  // 文件验证
  validateFile(file) {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.xlsx')) {
        reject(new Error('仅支持.xlsx格式文件'))
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('文件大小不能超过5MB'))
      }
      resolve()
    })
  },

  // 带重试的文件读取
  async readFileWithRetry(path, retryCount) {
    let attempt = 0
    while (attempt < retryCount) {
      try {
        return await this.readFile(path)
      } catch (err) {
        attempt++
        if (attempt >= retryCount) throw err
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  },

  // 文件读取封装
  readFile(path) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: path,
        encoding: 'binary',
        success: res => resolve(res.data),
        fail: err => reject(new Error(`文件读取失败: ${err.errMsg}`))
      })
    })
  },

  // Excel解析核心逻辑
  async parseExcel(buffer) {
    try {
      const workbook = XLSX.read(buffer, {
        type: 'binary',
        cellDates: true,
        dateNF: 'HH:mm'
      })

      const sheetName = workbook.SheetNames[0]
      if (!sheetName) throw new Error('未找到有效工作表')

      const worksheet = workbook.Sheets[sheetName]
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: ['课程名称', '星期', '开始时间', '结束时间', '教室'],
        range: 1,
        defval: ''
      })

      return rawData.map((row, index) => ({
        id: `${Date.now()}_${index}`,
        name: this.cleanString(row['课程名称']) || `未命名课程-${index + 1}`,
        weekday: this.normalizeWeekday(row['星期']),
        startTime: this.formatTime(row['开始时间']),
        endTime: this.formatTime(row['结束时间']),
        location: this.cleanString(row['教室']) || '地点未指定'
      }))
      
    } catch (err) {
      throw new Error(`Excel解析失败: ${err.message}`)
    }
  },

  // 数据上传
  async uploadSchedule(data) {
    if (!data || data.length === 0) {
      throw new Error('未找到有效课程数据')
    }

    const { result } = await wx.cloud.callFunction({
      name: 'uploadSchedule',
      data: {
        schedule: data,
        timestamp: Date.now()
      },
      timeout: 15000
    })

    if (result.code !== 200) {
      throw new Error(result.message || '上传服务异常')
    }
  },

  // 辅助方法 - 周次标准化
  normalizeWeekday(input) {
    const weekdayMap = {
      '一': '周一', '1': '周一',
      '二': '周二', '2': '周二',
      '三': '周三', '3': '周三',
      '四': '周四', '4': '周四',
      '五': '周五', '5': '周五',
      '六': '周六', '6': '周六',
      '日': '周日', '7': '周日'
    }
    return weekdayMap[input.toString().trim()] || '未知'
  },

  // 辅助方法 - 时间格式化
  formatTime(value) {
    // 处理Excel时间数值（1900日期系统）
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000))
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }
    
    // 处理文本时间
    const timeStr = value.toString().replace(/[^0-9:]/g, '')
    const [hours = '00', minutes = '00'] = timeStr.split(':')
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
  },

  // 辅助方法 - 字符串清理
  cleanString(str) {
    return str.toString().replace(/[\n\r\t]/g, '').trim()
  },

  // 进度更新
  updateProgress(progress) {
    this.setData({ progress })
    wx.setStorageSync('lastProgress', progress)
  },

  // 错误处理
  handleError(err) {
    const errorMap = {
      '文件读取失败': '文件读取失败，请检查文件权限',
      'Excel解析失败': '文件格式错误，请检查模板',
      '未找到有效课程数据': '文件中没有有效课程数据'
    }

    const message = errorMap[err.message.split(':')[0]] || err.message
    this.setData({ errorMsg: message })
    
    wx.showModal({
      title: '导入失败',
      content: message,
      showCancel: false,
      confirmColor: '#E64340'
    })
  }
})