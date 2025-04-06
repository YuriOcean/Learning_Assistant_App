import { scheduleStore } from '../../../store/scheduleStore'
import { getSchedule } from '../../../api/schedule'

Page({
  data: {
    currentWeek: 1,
    weekData: []
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      const res = await getSchedule(scheduleStore.currentWeek)
      const parsedData = this.parseScheduleData(res.data)
      this.setData({ weekData: parsedData })
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  parseScheduleData(rawData) {
    return rawData.map(day => ({
      day: day.weekday,
      courses: day.courses.map(c => ({
        ...c,
        duration: this.calculateDuration(c.startTime, c.endTime),
        color: this.generateCourseColor()
      }))
    }))
  },

  calculateDuration(start, end) {
    const diff = new Date(`1970-01-01 ${end}`) - new Date(`1970-01-01 ${start}`)
    return Math.floor(diff / (1000 * 60 * 60))
  },

  generateCourseColor() {
    return `hsl(${Math.random() * 360}, 70%, 85%)`
  }
})