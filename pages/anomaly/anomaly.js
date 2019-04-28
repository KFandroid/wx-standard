// pages/anomaly/anomaly.js
const app = getApp()

  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funcInfo:null,
    picInfo:null,
    chapterDetail:null,
    chapterPid:'',
    getChapterPic: null,
    chapterType:1,
    currentChapter:[],
    list1:null,
    list2:null,
    isBlank:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //模拟异动xx篇 数据
    var funcInfo= require('../../utils/moce/B2.js')
    var picInfo= require('../../utils/moce/B4.js');

    var sum = [], kvIndex = {};  //sum 为合并后的对象
    /* for (var i = 0; i < funcInfo.data.length; i++) {
        for (var j = 0; j < picInfo.data.length; j++) {
            if (funcInfo.data[i].pid == picInfo.data[j].pid) {
                var item
                if (kvIndex[funcInfo.data[i].pid] == undefined) {
                    kvIndex[funcInfo.data[i].pid] = sum.length;
                    item = {};
                    for (var attr in funcInfo.data[i]) item[attr] = funcInfo.data[i][attr];
                    sum[kvIndex[funcInfo.data[i].pid]] = item;
 
                } else item = sum[kvIndex[funcInfo.data[i].id]];
                for (var attr in picInfo.data[j]) item[attr] = picInfo.data[j][attr];
            }
        }
    } */

    console.log(funcInfo.data,picInfo.data)
    this.setData({
      funcInfo:funcInfo.data,
      picInfo:picInfo.data,
      chapterDetail:app.globalData.chapterDetail,
      chapterPid: app.globalData.chapterDetail.pid
    })
    console.log(this.data.chapterPid)


    let currentPid = this.data.chapterPid
    
    if(this.data.chapterPid!==''){
      //根据pid 获取 pic
      for(var i=0;i<this.data.picInfo.length;i++){
        if(currentPid==this.data.picInfo[i].pid){
          this.setData({
            getChapterPic:this.data.picInfo[i]
          })
        }
      }
      let currentChapter=[];
      //根据pid获取 funcInfo title
      for(let i=0;i<this.data.funcInfo.length;i++){
        if(currentPid==this.data.funcInfo[i].pid){
          currentChapter.push(this.data.funcInfo[i])
        }
      }
      this.setData({
        currentChapter,
      })
      
    }


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
    this.typeWhich()

    if(this.data.currentChapter.length===0){
      this.setData({
        isBlank:true
      })
    }
    
    
    let contHeight 
    const sysInfo = wx.getSystemInfoSync()
    const query = wx.createSelectorQuery().in(this)
    query.select('.search-btn').boundingClientRect(function (res) {
      res.top
    })
    query.select('.index-panel').boundingClientRect(function (res) {
      res.top
    })
    query.select('.chapterPanel').boundingClientRect(function (res) {
      res.top
    })
    query.exec((res) => {
      contHeight = sysInfo.windowHeight - res[0].height - res[1].height - res[2].height 
      this.setData({
        contHeight,
      })
    })


    

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
      console.log('1',this.data.currentChapter)
      this.setData({
        list1 : this.data.currentChapter.filter((item) => item.type=='1')
      })
    }else if(this.data.chapterType==2){
      this.setData({
        list2 : this.data.currentChapter.filter((item) => item.type=='2')
      })
      }
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

  }
})