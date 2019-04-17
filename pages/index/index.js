// pages/index/index.js
import {
  createConnect,
  connect
} from '../../utils/socket'
import storage from '../../utils/WXStorage.js'
import * as util from '../../utils/util'
import * as fileList from '../../utils/fileList'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateBottom: util.formatTimeYmd(new Date()),
    t101: null,
    t106: null,
    t102: null,
    t103: null,
    t107: null,
    bottomIndex: '1',
    pagesrc: '',
    indexSearchHeight: 300
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    
    
    // storage.addFile(Object.assign({ctx: this}, fileList.file101))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const sysInfo = wx.getSystemInfoSync()
    app.globalData.stockList = app.globalData.a105.data
    app.globalData.currentPage = 'index'
    storage.deleteFile(101)
    let indexSearchHeight = sysInfo.windowHeight - 150 - 210
    
    this.setData({
      indexSearchHeight,
    })
    // storage.addFile(Object.assign({ctx: this}, fileList.file101))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    storage.clearFile()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  selectBottomIndex: function(e) {
    console.log(e)
    this.setData({
      bottomIndex: e.currentTarget.dataset.index
    })
    debugger
  },
  changePageSrc() {
    
    wx.navigateTo({
      url: "../webView/webView?src=https://www.baidu.com/"
    })
  },
  getK107(e) {
    storage.deleteFile(107)
    storage.addFile({
      type: '107',
      intervalTime: 10000,
      changeCb: (data) => {
        this.setData({
          t107: data
        })
      },
      createKey: () => {
        let val = this.createOptionalStockStr(107, '000000', '000000', e.detail.id, e.detail.codeStr)
        return val
      }
    })
  },
  getK103(e) {
    storage.deleteFile(103)
    storage.addFile({
      type: '103',
      intervalTime: 7000,
      changeCb: (data) => {
        this.setData({
          t103: data
        })
      },
      createKey: () => {
        let page = 1
        if (e.detail.page) {
          page = e.detail.page
        }
        let sort = '0000'
        if (e.detail.sort) {
          sort = e.detail.sort
        }
        let val = this.createKeyStr2(103, e.detail.code, '000000', true, page, null, sort)
        return val
      }
    })
  },
  dateChange(e) {
    this.setData({
      dateBottom: e.detail,
      t101: null,
      t106: null,
      t102: null
    })
    let storage = this.data.storage
    storage.deleteFile(101)
    storage.addFile({
      type: '101',
      intervalTime: 6000,
      changeCb: (data) => {
        this.setData({
          t101: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(101, '000000', '000000', true)
        return val
      }
    })
    storage.addFile({
      type: '106',
      changeCb: (data) => {
        this.setData({
          t106: data
        })

        let key = addZeroAfter('a106', 31)
        wx.setStorage({
          key,
          data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(106, '000000', '000000', true)
        return val
      }
    })
  },
  stopGetK103() {
    storage.deleteFile(103)
  },
  closeGetChild() {
    storage.deleteFile(102)
  },
  getT102(no) {
    storage.deleteFile(102)
    storage.addFile(Object.assign({ctx: this}, fileList.fileFactory102(no)))
  },
  getK107(e) {
    
    storage.deleteFile(107)
    storage.addFile({
      type: '107',
      intervalTime: 10000,
      changeCb: (data) => {
        this.setData({
          t107: data
        })
      },
      createKey: () => {
        let val = this.createOptionalStockStr(107, '000000', '000000', e.detail.id, e.detail.codeStr)
        return val
      }
    })
  },
  createOptionalStockStr: function (fileType, itemCode, stockCode, vn, str) {
    let page = '000'
    let dateStr = '00000000'
    let sortCode = '0000'
    let timestamp = '0000000000'
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode]
    if (kData) {
      // timestamp = addZero(kData.timestamp, 10)
      // dateStr = addZero(kData.data[kData.data.length - 1].time.replace(':', ''), 8).substring(0, 8)
    }
    let value = {
      storage: key + '0000' + vn + str,
      query: '' + fileType + itemCode + page + stockCode + dateStr + timestamp + sortCode + vn + str
    }
    return value
  }
})