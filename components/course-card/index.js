Component({
  properties: {
    course: {
      type: Object,
      value: {}
    }
  },

  methods: {
    handleTap() {
      this.triggerEvent('tap', { course: this.data.course })
    }
  }
})