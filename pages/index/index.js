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
    indexSearchHeight: 300,
    proInfo:null,
    iconInfo:null,
    funcInfo:null,
    picInfo:null,
    chapterDetail:null,
    isYidong: 1,
    currentChapter:null,
    chapter:null,
    date:"2015-09-01"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    //模拟异动xx篇 数据
    var proInfo=require('../../utils/moce/B1.js');
    
    var iconInfo= require('../../utils/moce/B3.js');
    var funcInfo= require('../../utils/moce/B2.js')
    var picInfo= require('../../utils/moce/B4.js');
    
    
    var sum = [], kvIndex = {};  //sum 为合并后的对象
    for (var i = 0; i < proInfo.data.length; i++) {
        for (var j = 0; j < iconInfo.data.length; j++) {
            if (proInfo.data[i].pid == iconInfo.data[j].pid) {
                var item
                if (kvIndex[proInfo.data[i].pid] == undefined) {
                    kvIndex[proInfo.data[i].pid] = sum.length;
                    item = {};
                    for (var attr in proInfo.data[i]) item[attr] = proInfo.data[i][attr];
                    sum[kvIndex[proInfo.data[i].pid]] = item;
 
                } else item = sum[kvIndex[proInfo.data[i].id]];
                for (var attr in iconInfo.data[j]) item[attr] = iconInfo.data[j][attr];
            }
        }
    }
    
    this.setData({
      proInfo:proInfo.data,
      iconInfo:iconInfo.data,
      picInfo:picInfo.data,
      funcInfo:funcInfo.data,
      chapterDetail:sum,
      chapterType:1,
    })
    
    // storage.addFile(Object.assign({ctx: this}, fileList.file101))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  

  //监听yidong组件 
  onGetYidong: function(e){
    //获取高度
    let contHeight 
    const sysInfo = wx.getSystemInfoSync()
    const query = wx.createSelectorQuery().in(this)
    query.select('.search-btn').boundingClientRect(function (res) {
      res.top
    })
    query.select('.index-panel').boundingClientRect(function (res) {
      res.top
    })
    
   
    query.exec((res) => {
      contHeight = sysInfo.windowHeight - res[0].height - res[1].height
      
      let otherHeight = 340/(sysInfo.screenHeight*sysInfo.pixelRatio)*sysInfo.windowHeight  //chapterPanel chapter-bar (rpx=>px)
      console.log(contHeight,otherHeight)
      this.setData({
        panelHeight:contHeight,
        contHeight,
      })
      console.log(this.data.contHeight)
     
    }) 


    let currentPid = e.detail.currentChapter.pid
    
    if(currentPid!==''){
      //根据pid 获取 pic
      for(var i=0;i<this.data.picInfo.length;i++){
        if(currentPid==this.data.picInfo[i].pid){
          this.setData({
            getChapterPic:this.data.picInfo[i]
          })
        }
      }
      let currentChapterDetail=[];
      //根据pid获取 funcInfo title
      for(let i=0;i<this.data.funcInfo.length;i++){
        if(currentPid==this.data.funcInfo[i].pid){
          currentChapterDetail.push(this.data.funcInfo[i])
        }
      }
      console.log(currentChapterDetail)
      this.setData({
        currentChapterDetail,
      })
      
    }
    this.setData({
      isYidong:e.detail.isYidong,
      currentChapter:e.detail.currentChapter,
      
    })



    this.typeWhich()

    if(this.data.currentChapterDetail.length===0){
      this.setData({
        isBlank:true
      })
    }

  },
  getSelected(e){
    
    this.setData({
      chapterType:e.currentTarget.dataset.type
    })
    this.typeWhich()
   
  },
  typeWhich(){
    //判断数据类型
    if(this.data.chapterType==1){
      console.log('1',this.data.currentChapterDetail)
      this.setData({
        list1 : this.data.currentChapterDetail.filter((item) => item.type=='1')
      })
    }else if(this.data.chapterType==2){
      this.setData({
        list2 : this.data.currentChapterDetail.filter((item) => item.type=='2')
      })
      }
  },
  changeChapType(e){
    console.log(e.currentTarget.dataset.chaptype)
    if(this.data.isYidong == 2){
      this.setData({
        isYidong:1
      })
    }else if(this.data.isYidong == 3){
      this.setData({
        isYidong: 2
      })
    }
  },
  gotoDetail(e){
    this.setData({
      isYidong:3,
      chapter:e.currentTarget.dataset.detail
    })
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    const sysInfo = wx.getSystemInfoSync()
    app.globalData.stockList = app.globalData.a105.data
    app.globalData.currentPage = 'index'
    storage.deleteFile(101)
    let indexSearchHeight
    const query = wx.createSelectorQuery().in(this)
    console.log(sysInfo)
    query.select('.search-btn').boundingClientRect(function (res) {
      res.top
    })
    query.select('.index-panel').boundingClientRect(function (res) {
      res.top
    })
    query.select('.custom-stock').boundingClientRect(function (res) {
      res.top
    })
    query.exec((res) => {
      indexSearchHeight = sysInfo.windowHeight - res[0].height - res[1].height - res[2].height 
      this.setData({
        indexSearchHeight,
      })
    })
    // console.log('window height is', sysInfo.windowHeight)
    // if (sysInfo.windowHeight > 780) {
    //   indexSearchHeight -= 16
    // }
    // if(sysInfo.windowHeight > 800) {
    //   indexSearchHeight -= 4
    // }
    // if (sysInfo.windowHeight > 850) {
    //   indexSearchHeight -= 56
    // }
    
    
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
      intervalTime: 2000,
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
      intervalTime: 2000,
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
      intervalTime: 2000,
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
      intervalTime: 2000,
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