// components/optionalStock/optionalStock.js
import EventBus from '../../utils/pubsub.js'
import storage from '../../utils/WXStorage.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'
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
            if (this.data.allData[i].stockCode === data.data[j].stockCode) {
              flag = false;
            }
          }
          if (flag) {
            data.data.push(this.data.allData[i])
          }
        }
        for(let i = 0; i < data.data.length; i++) {
          data.data[i].oriCjl = data.data[i].cjl
          if(parseFloat(data.data[i].zf) > 0 ) {
            
            data.data[i].riseFlag = true
          } else if(parseFloat(data.data[i].zf) < 0 ){
            data.data[i].riseFlag = false
          } else {
            data.data[i].riseFlag = 0
          }
          data.data[i].oriCjl = data.data[i].cjl
          data.data[i].cjl = getNumUnit(data.data[i].cjl)
        }

        let oriData = data.data
        let items = this.data.itemsFlag
        
        if(items!==''){
          
          this.sortList(items,oriData)
          }else {
          this.setData({
            allData:oriData
          })
        }
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
    selectorStart: 0,
    totalPage: 1,
    plateWidth:0,
    codeStr: '',
    itemsFlag: '' ,
    lastFlag:'',
    trangDirction: null,  // true 为 上，false 为下
    trangStatus: false,  //记录当前是否点击了字段
  },
  pageLifetimes: {
    show() {
      this.data.hasGetData = false
      this.getAndSetData()
      // 页面被展示
      // this.setView()
    },
    hide() {
      storage.deleteFile(107)
      this.data.hasGetData = false
    }
  },
  lifetimes: {
    attached() {
     this.getAndSetData()
    //  this.setView()
    },
    detached() {
      storage.deleteFile(107)
      this.data.hasGetData = false
    }
  },
  methods: {
    removeThis(detail) {
      this.setData({
        selectedCode: detail.currentTarget.dataset.item.stockCode
      })
      wx.showModal({
        title: '提示',
        content: '是否确认删除该自选股',
        success: res => {
          if (res.confirm) {
            let temp = wx.getStorageSync('customStockTable')
            temp[this.data.selector[this.data.index].name] = wx.getStorageSync('customStockTable')[this.data.selector[this.data.index].name].filter(item => {
              return item !== this.data.selectedCode
            })
            wx.setStorageSync('customStockTable', temp)
            this.data.hasGetData = false
            this.getAndSetData()
          }
        }
      })
    },
    addPlate() {
      
      if(this.data.selectorStart < this.data.selector.length - 1) {
        this.data.selectorStart += 1
        this.setPlate()
      }
      
    },
    minusPlate() {
      
      if(this.data.selectorStart > 0) {
        this.data.selectorStart -= 1
        this.setPlate()
      }
    },
    setPlate() {
      let selector = this.data.selector
      this.setData({
        plate: selector.slice(this.data.selectorStart, this.data.selectorStart + 3)
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
        wx.setStorageSync('customStockTable', {
          '自选股': []})
      }
      this.setData({
        selector: wx.getStorageSync('customStockClass')
      })
      if(app.globalData.selectCustomStockTableIndex >= 0) {
        this.data.selector.forEach((element, index) => {
          element.index = index
        });
        this.setPlate()
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
      let index = e.currentTarget.dataset.index
      app.globalData.selectCustomStockTableIndex = index
      this.setData({
        index,
        allData: [],
        data: [],
        page: 1,
        totalPage: 1
      })
      let t105 = app.globalData.a105.data
      
      let data = wx.getStorageSync('customStockTable')[wx.getStorageSync('customStockClass')[index].name]
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
        // selector: wx.getStorageSync('customStockClass'),
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
    },
flagItem(e){
  let item = e.currentTarget.dataset.item
  console.log(item)
  if(!this.data.trangStatus){
    
    this.setData({
      trangStatus:true,
      trangDirction:true,
      lastFlag:item,  //记录当前字段方便切换对比
      itemsFlag:item
    })
  }else{
    
    if(this.data.lastFlag==item){ //只在当前字段进行排序
  
      this.setData({
        trangDirction:!this.data.trangDirction,
        allData:this.data.allData.reverse()
      })
      console.log(this.data.allData)
    }else{      //切换到其他字段排序
     
      this.setData({
        itemsFlag:item,
        lastFlag: item,
        trangDirction:true,

      })
    }
    
  }
      /* this.setData({
        itemsFlag:item,
        
      }) */
      let data = this.data.allData
      this.sortList(item,data)
    },
    //自选股排序判断
    compare (property) {
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
       }
    },
    dataSort(data,field){
      
      console.log('字段',field)
     if(this.data.trangDirction===true){
      this.setData({
        allData:data.sort(this.compare(field))
      })
      } else{
        this.setData({
          allData:data.sort(this.compare(field)).reverse()
        })
      }
    },
    sortList(items,data){
      switch(items)
          {
            case 'gp':
            console.log(items)
            break;
          
            case 'dm':
            console.log(items)
            this.dataSort(data,'stockCode')
            
            break;
          
            case 'zx':
            console.log(items)
            this.dataSort(data,'cjj')
              
            break;
          
            case 'zf':
            console.log(items)
            this.dataSort(data,'zf')
            
            break;

            case 'cjl':
            this.dataSort(data,'oriCjl')
            
            break;
    }
  }
}
})