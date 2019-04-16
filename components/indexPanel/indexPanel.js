// compontent/indexPanel/indexPanel.js
import storage from '../../utils/WXStorage'
import {fileFactory108, fileFactory145} from '../../utils/fileList'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    indexList:[
      {"stockCode":"A00001","code":"060001","stockName":"上证指数","py":"SZZS","market":"上指","type":"", "y":200},
      {"stockCode":"B00001","code":"060009","stockName":"深证成指","py":"SZCZ","market":"深指","type":"", "y":200},
      {"stockCode":"B00006","code":"060013","stockName":"创业板指","py":"CYBZ","market":"深指","type":""}
    ]
  },
  pageLifetimes: {
    show(){
      storage.deleteFile(145)
      let stockList = wx.getStorageSync('selectIndex')
      if(stockList) {
        this.setData({
          indexList: stockList
        })
      }
      let stockCodeStr = []
      for(let i = 0; i < this.data.indexList.length; i++) {
        stockCodeStr.push(this.data.indexList[i].code)
      }
      let file145 =  Object.assign({ctx: this}, fileFactory145(JSON.stringify(stockCodeStr)))
      storage.addFile(file145)
    },
   
    hide() {
      storage.deleteFile(145)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateToIndex(e) {
      app.globalData.stockList = app.globalData.indexList
    let stock = e.currentTarget.dataset.stock
    wx.setStorageSync(
      'selectStock',
      stock
    )
    app.globalData.selectStock = stock
    wx.navigateTo({
      url: `../stockIndex/stockIndex`,
    })
    },
  },
  
})
