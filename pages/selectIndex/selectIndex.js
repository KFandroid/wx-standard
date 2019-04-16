// pages/selectIndex/selectIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showarea: false,
    falseFlag: false,
    indexInfo:[{"stockCode":"A00001","code":"060001","stockName":"上证指数","py":"SZZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00002","code":"060002","stockName":"Ａ股指数","py":"AGZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00003","code":"060003","stockName":"Ｂ股指数","py":"BGZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00009","code":"060004","stockName":"上证380","py":"SZ380","market":"上指","type":"", "y":200},
    {"stockCode":"A00010","code":"060005","stockName":"上证180","py":"SZ180","market":"上指","type":"", "y":200},
    {"stockCode":"A00016","code":"060006","stockName":"上证50","py":"SZ50","market":"上指","type":"", "y":200},
    {"stockCode":"A00132","code":"060007","stockName":"上证100","py":"SZ100","market":"上指","type":"", "y":200},
    {"stockCode":"A00133","code":"060008","stockName":"上证150","py":"SZ150","market":"上指","type":"", "y":200},
    {"stockCode":"B00001","code":"060009","stockName":"深证成指","py":"SZCZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00002","code":"060010","stockName":"深成指R","py":"SCZR","market":"深指","type":"", "y":200},
    {"stockCode":"B00004","code":"060011","stockName":"深证100","py":"SZ100","market":"深指","type":"", "y":200},
    {"stockCode":"B00005","code":"060012","stockName":"中小板指","py":"ZXBZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00006","code":"060013","stockName":"创业板指","py":"CYBZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00008","code":"060014","stockName":"中小300","py":"ZX300","market":"深指","type":"", "y":200},
    {"stockCode":"B00009","code":"060015","stockName":"深证200","py":"SZ200","market":"深指","type":"", "y":200},
    {"stockCode":"B00012","code":"060016","stockName":"创业300","py":"CY300","market":"深指","type":"", "y":200}],
    selectIndex: [{"stockCode":"A00001","code":"060001","stockName":"上证指数","py":"SZZS","market":"上指","type":""}, 
    {"stockCode":"B00001","code":"060009","stockName":"深证成指","py":"SZCZ","market":"深指","type":""}, 
    {"stockCode":"B00006","code":"060013","stockName":"创业板指","py":"CYBZ","market":"深指","type":""}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let rowCount = 3
    let heightInterval = 40
    let rangeArr = []
    
    const query = wx.createSelectorQuery().in(this)
    query.select('.movearea').boundingClientRect(function (res) {
      res.top
    })
    
    query.exec((res) => {
      let stockList = wx.getStorageSync('selectIndex')
    
      if(stockList) {
        stockList.forEach(item => {
          item.selected = true
        })
        this.setData({
          selectIndex: stockList
        })
      }
      
      let widthInterval = res[0].width / (rowCount)
      for(let i = 0; i < this.data.indexInfo.length; i++) {
        let xIndex= i % 3
        this.data.indexInfo[i].x = widthInterval * xIndex
        let yIndex = Math.ceil((i + 1) / 3)
        this.data.indexInfo[i].y = heightInterval * yIndex + 126
        this.setData({
          indexInfo: this.data.indexInfo
        })
      }
      for(let i = 0; i < this.data.selectIndex.length; i++) {
        this.data.selectIndex[i].x = i * 120
        this.data.selectIndex[i].y = 30
        rangeArr[i] = {
          x: i * 120,
          y: 30
        }
        this.data.rangeArr = rangeArr
        for(let j = 0; j < this.data.indexInfo.length ; j++) {
          if(this.data.selectIndex[i].code === this.data.indexInfo[j].code) {
            this.data.indexInfo[j].selected = true
          }
        }
      }
      
      this.setData({
        selectIndex: this.data.selectIndex,
        indexInfo: this.data.indexInfo
      })
      this.setData({
        showarea: true
      })
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  moveRect: function(e) {
    let x = e.detail.x
    let y = e.detail.y
    let index = e.target.dataset.index
    let area = 25*25 + 55 * 55
    let currentStockCode = this.data.indexInfo[index].stockCode
    for(let i = 0; i < this.data.rangeArr.length; i++) {
      let xLength = this.data.rangeArr[i].x - x
      let yLength = this.data.rangeArr[i].y - y
      let area2 = xLength * xLength + yLength * yLength
      
      if(area2 < area) {
        
        let stockCode = this.data.selectIndex[i].stockCode
        // for(let j = 0; j < this.data.selectIndex.length; j++) {
        //   if(this.data.selectIndex[j].stockCode === currentStockCode) {
        //     this.setData({
        //       indexInfo: this.data.indexInfo
        //     })
        //     return
        //   }
        // }
       
        for(let i = 0; i < this.data.indexInfo.length; i++) {
          if(stockCode === this.data.indexInfo[i].stockCode) {
            this.data.indexInfo[i].selected = false
          }
        }
        this.data.selectIndex[i].code = this.data.indexInfo[index].code
        this.data.selectIndex[i].stockCode = this.data.indexInfo[index].stockCode
        this.data.selectIndex[i].stockName = this.data.indexInfo[index].stockName
        this.data.indexInfo[index].selected = true
        this.setData({
          selectIndex: this.data.selectIndex,
          indexInfo: this.data.indexInfo
        })
        wx.setStorageSync('selectIndex', this.data.selectIndex)
        break
      }
    }

  },
  start: function(e) {
  },
  end: function(e) {
    let index = e.target.dataset.index
    if(this.data.indexInfo[index].selected !== true) {
      this.setData({
        indexInfo: this.data.indexInfo
      })
    }
  },
})