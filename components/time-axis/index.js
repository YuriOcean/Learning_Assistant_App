Component({
  properties: {
    times: {
      type: Array,
      value: ['08:00', '09:50', '13:30', '15:20', '18:30']
    }
  },

  data: {
    itemHeight: 120 // 每个时间块高度
  }
})