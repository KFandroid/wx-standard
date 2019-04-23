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
    },
    rightBottomHei :{
      type: Number,
      value: 0,
      observer(newData) {
        let height = newData;

        const query = wx.createSelectorQuery().in(this)
        query.select('.row').boundingClientRect(function (res) {
          res.top
        })
        query.exec((res) => {
          this.setData({
            index: parseInt(height/res[0].height)
          })
          
        })
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: [],
    rowHeight: 0,
    listHeight : 0,
    index: 8
    
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