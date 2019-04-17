// components/optionalStock/optionalStock.js
import EventBus from '../../utils/pubsub.js'
import storage from '../../utils/WXStorage.js'
const app = getApp()
Component({
  properties: {
    scrollHeight: {
      type: Number,
      value: 260,
      observer(data) {

      }
    },
    t107: {
      type: Object,
      value: null,
      observer(data) {
        
        for (let i = 0; i < this.data.codeDetail.length; i++) {
          for (let j = 0; j < data.data.length; j++) {
            
            if (this.data.codeDetail[i].code == data.data[j].code) {
              data.data[j].stockName = this.data.codeDetail[i].stockName
              data.data[j].stockCode = this.data.codeDetail[i].stockCode
            }
          }
        }
        for (let i = 0; i < this.data.allData.length; i++) {
          let flag = true;
          for (let j = 0; j < data.data.length; j++) {
            if (this.data.allData[i].stockCode = data.data[j].stockCode) {
              flag = false;
            }
          }
          if (flag) {
            data.data.push(this.data.allData[i])
          }
        }
        for(let i = 0; i < data.data.length; i++) {
          if(parseFloat(data.data[i].zf) > 0 ) {
            
            data.data[i].riseFlag = true
          } else if(parseFloat(data.data[i].zf) < 0 ){
            data.data[i].riseFlag = false
          } else {
            data.data[i].riseFlag = 0
          }
        }
        this.setData({
          allData: data.data
        })
      }
    }
  },
  data: {
    index: 0,
    allData: [],
    data: [],
    hasGetData: false,
    selector: [],
    codeDetail: [],
    page: 1,
    totalPage: 1,
    plateWidth:0,
    codeStr: '',
  },
  pageLifetimes: {
    show() {
      this.data.hasGetData = false
      this.getAndSetData()
      // 页面被展示
      const query = wx.createSelectorQuery().in(this)
      query.select('.select-custom ').boundingClientRect()
      query.exec( (res) =>{
        let plateWidth = (res[0].width - 40) / 3
        this.setData({
          plateWidth
        })
      })
    },
    hide() {
      storage.deleteFile(107)
      this.data.hasGetData = false
    }
  },
  lifetimes: {
    attached() {
     this.getAndSetData()
    },
    detached() {
      storage.deleteFile(107)
      this.data.hasGetData = false
    }
  },
  methods: {
    setPlate(selector) {
      this.setData({
        plate: selector.slice(0, 3)
      })
    },
    getAndSetData() {
      
      if(this.data.hasGetData) {
        return
      }
      
      if (!wx.getStorageSync('customStockClass')) {
        wx.setStorageSync('customStockClass', [{
          id: +(+new Date() + "").substring(0, 10),
          name: '自选股'
        }])
      }
      this.setData({
        selector: wx.getStorageSync('customStockClass')
      })
      if(app.globalData.selectCustomStockTableIndex >= 0) {
        this.setPlate(this.data.selector)
        if(this.data.selector[this.data.index] === undefined) {
          app.globalData.selectCustomStockTableIndex = 0
        }
        this.setData({
          index: app.globalData.selectCustomStockTableIndex
        })
      }
      let t105 = app.globalData.a105.data
      
      
      let data = wx.getStorageSync('customStockTable')[this.data.selector[this.data.index].name]
      
      let allDataTemp = []
      if (data) {
        for (let i = 0; i < t105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (t105[i].stockCode == data[j]) {
              allDataTemp.push(Object.assign({}, t105[i]))
            }
          }
        }
      }
      this.setData({
        allData: allDataTemp
      })
      this.getK107()
      EventBus.on('updateOptionStock', this.getK107.bind(this))
    },
    navigateToStock(e) {
      // 改变股票切换列表并进入个股页面
    app.globalData.stockList = this.data.allData
    let stock = e.currentTarget.dataset.stock
    wx.setStorageSync(
      'selectStock',
      stock
    )
    app.globalData.selectStock = stock
    if(app.globalData.currentPage == 'stockIndex') {
      EventBus.emit('reloadstock', stock)
    } else {
      wx.navigateTo({
        url: `../stockIndex/stockIndex`,
      })
    }
    
    
    },
    bindPickerChange: function (e) {
      app.globalData.selectCustomStockTableIndex = e.detail.value
      this.setData({
        index: e.detail.value,
        allData: [],
        data: [],
        page: 1,
        totalPage: 1
      })
      let t105 = app.globalData.a105.data
      let data = wx.getStorageSync('customStockTable')[wx.getStorageSync('customStockClass')[e.detail.value].name]
      let allDataTemp = []
      for (let i = 0; i < t105.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (t105[i].stockCode == data[j]) {
            allDataTemp.push({
              stockName: t105[i].stockName,
              stockCode: t105[i].stockCode
            })
          }
        }
      }
      this.setData({
        selector: wx.getStorageSync('customStockClass'),
        allData: allDataTemp
      })
      this.getK107()
    },
    getK107() {
      
      this.data.hasGetData = true
      let codeArr = []
      let temp = wx.getStorageSync('customStockTable')[this.data.selector[this.data.index].name]
      if (!temp) {
        temp = []
      }
      let t105 = app.globalData.a105.data
      let codeDetail = []
      for (let i = 0; i < t105.length; i++) {
        for (let j = 0; j < temp.length; j++) {
          if (t105[i].stockCode === temp[j]) {
            codeArr.push(t105[i].code)
            codeDetail.push(t105[i])
          }
        }
      }
      this.setData({
        codeDetail: codeDetail
      })
      this.triggerEvent('getK107', {
        id: this.data.selector[this.data.index].id,
        codeStr: '[' + codeArr.join(',') + ']'
      })
    },
    toEditCustom() {
      wx.navigateTo({
        url: '../addCustomClass/addCustomClass'
      })
    },
    updateStock(e) {
      let a105 = app.globalData.a105.data
      let lists = []
      let codeList = []
      for (let i = 0; i < a105.length; i++) {
        for (let j = 0; j < this.data.allData.length; j++) {
          if ('0' + this.data.allData[j].code == a105[i].code && codeList.indexOf('0' + this.data.allData[j].code) < 0) {
            lists.push(a105[i])
          }
        }
      }
      let currentStock
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].code == '0' + e.currentTarget.dataset.item.code) {
          currentStock = lists[i]
        }
      }
      EventBus.emit('changeStockAndStockList', {
        stock: currentStock,
        stockList: lists
      })
    }
  }
})