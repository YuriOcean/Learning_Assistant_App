// 数据校验
export function validateSchedule(data) {
  const errors = []

  // 必填字段校验（修正字段名）
  const requiredFields = [
    { key: 'name', name: '课程名称' },
    { key: 'weekday', name: '星期' },
    { key: 'startTime', name: '开始时间' }
  ]

  requiredFields.forEach(field => {
    if (!data[field.key]?.trim()) {
      errors.push(`${field.name}不能为空`)
    }
  })

  // 时间格式校验
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/
  if (!timeRegex.test(data.startTime)) {
    errors.push("开始时间格式错误（HH:mm）")
  }
  if (!timeRegex.test(data.endTime)) {
    errors.push("结束时间格式错误（HH:mm）")
  }

  // 时间顺序校验
  if (data.startTime >= data.endTime) {
    errors.push("结束时间必须晚于开始时间")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// 冲突检测
export function checkTimeConflicts(courses) {
  const timeMap = new Map()
  
  courses.forEach(course => {
    const key = `${course.weekday}-${course.startTime}`
    timeMap.set(key, (timeMap.get(key) || 0) + 1)
  })

  return Array.from(timeMap.entries())
    .filter(([_, count]) => count > 1)
    .map(([timeSlot]) => timeSlot)
}