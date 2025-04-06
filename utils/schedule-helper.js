/​*
 课程表数据校验与处理工具
 */

/​*
 检测课程时间冲突
 @param {Course[]} courses 课程列表
 @returns {Conflict[]} 冲突列表
 */
export function detectConflicts(courses) {
  const timeMap = new Map()

  // 1. 构建时间槽位映射
  courses.forEach(course => {
    const key = `${course.weekday}-${course.startTime}-${course.endTime}`
    if (!timeMap.has(key)) {
      timeMap.set(key, [])
    }
    timeMap.get(key).push(course)
  })

  // 2. 过滤出冲突项
  return Array.from(timeMap.entries())
    .filter(([_, courses]) => courses.length > 1)
    .map(([slot, courses]) => ({
      timeSlot: slot,
      conflictingCourses: courses
    }))
}

/​*
 验证课程数据有效性
 @param {Course} course 
 @returns {ValidationResult}
 */
export function validateCourse(course) {
  const errors = []

  // 必填字段校验
  if (!course.name?.trim()) errors.push('课程名称不能为空')
  if (!course.weekday) errors.push('星期信息缺失')
  if (!course.startTime) errors.push('开始时间不能为空')
  if (!course.endTime) errors.push('结束时间不能为空')

  // 时间格式校验
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/
  if (!timeRegex.test(course.startTime)) errors.push('开始时间格式错误')
  if (!timeRegex.test(course.endTime)) errors.push('结束时间格式错误')

  // 时间顺序校验
  if (course.startTime >= course.endTime) {
    errors.push('结束时间必须晚于开始时间')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/​*
 过滤无效课程
 @param {Course[]} courses 
 @returns {Course[]}
 */
export function filterInvalidCourses(courses) {
  return courses.filter(course => {
    const { isValid } = validateCourse(course)
    return isValid
  })
}