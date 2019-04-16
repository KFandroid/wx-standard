// pages/stockTable/stockTable.js
import { formatDate, addZero } from '../../utils/util.js'
// import debounce from '../../utils/debounce.js'
// import { connect } from '../../utils/socket.js'
// import WXStorage from '../../utils/WXStorage.js'
import {
  createConnect,
  connect
} from '../../utils/socket'
import storage from '../../utils/WXStorage.js'
import * as fileList from '../../utils/fileList'

const today = formatDate(new Date())
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
    itemName: '开盘-连续上涨',
    dateFlag: '最新',
    today,
    currentSortItem: 'time',
    sortCode: '0050',
    scrollHeight: 300,
    sortItem: '时间正序',
    date: "2018-11-29",
    page: 1,
    handle103: null,
    storage: null,
    totalPage: 1,
    itemCode: '',
    pageNum: 30,
    data: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh() // 要手动调用
    },
    onLoad: function (option) {
      
      let latestDate = app.globalData.latestDate
      let dateStr = '' + latestDate.year + addZero(latestDate.month, 2) + addZero(latestDate.day, 2)
      this.setData({
        date: dateStr,
        itemCode: option.cno,
        itemName: option.name
      })
      let file103 = fileList.fileFactory103(this.data.itemCode, this.data.page, this.data.sortCode)
      
      storage.addFile(Object.assign({ctx: this}, file103))
      
      if (this.data.date != this.data.today) {
        this.setData({
          dateFlag: '历史',
        })
      }
    },
    setView() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.scrollView').boundingClientRect(function (res) {
        res.top
      })
      query.selectViewport().scrollOffset(function (res) {
        res.scrollTop // 显示区域的竖直滚动位置
      })
      const sysInfo = wx.getSystemInfoSync()
      query.exec((res) => {
        this.setData({
          scrollHeight: sysInfo.windowHeight - res[0].top - 44,
          topVal: -res[0].top
        })
      })
    },
    convert2B: function () {

      let a103 = this.data.a103
      let a105 = this.data.a105
      let tree = []
      if (a103 && a105) {
        let data103 = a103.data
        let data105 = a105.data
        tree = data103
        for (let i = 0, length = tree.length; i < length; i++) {
          let stockNo = tree[i].stockNo
          for (let index = 0, length2 = data105.length; index < length2; index++) {
            if (data105[index].stockCode === stockNo) {
              tree[i] = Object.assign({}, tree[i], data105[index])
            }
          }
        }
        this.setData({
          data: tree
        })
      }
    },
    changeSort: function (e) {
      let sortCode = e.currentTarget.dataset.sort
      let currentSortCode = this.data.sortCode.slice(0, 3)
      let sortItem
      let sortName

      switch (sortCode) {
        case '001':
          sortItem = '代码'
          sortName = 'code'
          break
        case '002':
          sortItem = '名称'
          sortName = 'name'
          break
        case '003':
          sortItem = '价格'
          sortName = 'price'
          break
        case '004':
          sortItem = '涨幅'
          sortName = 'rise'
          break
        case '005':
          sortItem = '更新时间'
          sortName = 'time'
          break
        case '006':
          sortItem = '成交量'
          sortName = 'hand'
          break
        case '007':
          sortItem = '关键值'
          sortName = 'key'
          break
      }
      if (this.data.sortCode[3] === '0') {
        this.setData({
          sortCode: sortCode + '1',
          sortItem: sortItem + '倒序',
          currentSortItem: sortName
        })
      } else {
        this.setData({
          sortCode: sortCode + '0',
          sortItem: sortItem + '正序',
          currentSortItem: sortName
        })
      }

      let file103 = fileList.fileFactory103(this.data.itemCode, this.data.page, this.data.sortCode)
      storage.deleteFile(103)
      storage.addFile(Object.assign({ctx: this}, file103))
    },
    navigateToStock(e) {
      app.globalData.stockList = this.data.data
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
    pageUp:function () {
      let page = this.data.page - 1
      this.setData({
        page,
      })
      let file103 = fileList.fileFactory103(this.data.itemCode, this.data.page, this.data.sortCode)
      storage.deleteFile(103)
      storage.addFile(Object.assign({ctx: this}, file103))
    },
    pageDown: function () {
      let page = this.data.page + 1
      this.setData({
        page,
      })
      let file103 = fileList.fileFactory103(this.data.itemCode, this.data.page, this.data.sortCode)
      storage.deleteFile(103)
      storage.addFile(Object.assign({ctx: this}, file103))
    }, 
    onShow: function () {
      this.setView()
    },
    onHide: function () {
      storage.deleteFile(103)
    },
    onUnload: function () {
      storage.deleteFile(103)
    },
  }
})
