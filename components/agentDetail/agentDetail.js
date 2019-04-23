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
        for (let i = 0; i < newData.length; i++) {
          newData[i].time = newData[i].time.substring(8, 10) + ':' + newData[i].time.substring(10, 12)
        }
        this.setData({
          data: newData.slice(-this.data.index)
        })
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

  }
})