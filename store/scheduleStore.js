import { observable, action } from 'mobx-miniprogram'

export const scheduleStore = observable({
  currentWeek: 1,
  courseData: [],
  
  // Action
  setCurrentWeek: action(function(week) {
    this.currentWeek = week
  }),
  
  updateCourseData: action(function(data) {
    this.courseData = data
  })
})