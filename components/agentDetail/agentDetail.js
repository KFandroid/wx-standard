// components/agentDetail/agentDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    agentData: {
      type: Array,
      value: [],
      observer(newData) {
        this.processData()
      }
    }, 
    height: {
      type: Number,
      value: 160,
      oberver(newData) {
        
        this.processData()
      }
    },
    pcp: {
      type: Number,
      value: 0,
      observer(newData) {
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    processData() {
      let number = Math.floor( this.data.height / 18)
        let data = this.data.agentData
        for (let i = 0; i < data.length; i++) {
          data[i].time = data[i].time.substring(8, 10) + ':' + data[i].time.substring(10, 12)
        }
        this.setData({
          data: data.slice(-number)
        })
    }
  }
})