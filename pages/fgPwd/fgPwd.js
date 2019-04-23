// pages/fgPwd/fgPwd.js
import { shortConnectUrl } from '../../utils/socket.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    pwd:'',
    pwd2: '',
    code:'',
  },
  gainValue: function(e){
    let key = e.target.dataset.key
    let obj = {}
    obj[key] = e.detail.value
    this.setData(obj)
  },
  send_code: function(){
    // let tel= JSON.stringify(this.data.tel);
    // console.log(this.data.tel);
    // var regTel=new RegExp('0?(13|14|15|18)[0-9]{9}','g');//判断用户输入的是否为手机号码
    // var rsTel=regTel.exec(this.data.tel);
    if(!this.data.tel){
      wx.showToast({
        title: '请输入的是正确的手机号码',
        icon: 'none',
        duration: 4000
      })
    }else{
      wx.request({
        url: `http://${shortConnectUrl}/userLogin/sendVerificationCode`, // 获取验证码
        method:'POST',
        data: {
          subscriberPhone: this.data.tel,
        },
        header: {
          "Content-Type": "application/json"
        },
        success(res) {    
          console.log(res)
        },
        fail:function(err){
          console.log(err)
        },
      })
    }
  },
  confirm: function(){
    let fgData = {
        subscriberPhone: this.data.tel,
        verificationCode: this.data.code,
        passWord: this.data.pwd,
        secondPassword: this.data.pwd2
    }
    this.submit(fgData)
    
  },
  submit: function(fgData){
    //console.log(fgData)
    wx.request({
      url: `http://${shortConnectUrl}/userLogin/resetPassword`,
      method:'POST',
      data: fgData,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) =>{
        //console.log(res)
        if(res.data.code=='01'){
          wx.showToast({
            title: '密码修改成功',
            icon: 'none',
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateBack({
                  delta: 1
                })
              }, 2000) 
            }
          }) 
        } else if(code === '02'){
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 4000
          })
        }else if(code === '10001'){
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 4000
          })
        }else if(code ==='10002'){
          wx.showToast({
            title: '该用户未注册',
            icon: 'none',
            duration: 4000
          })
        }else if(code === '10003'){
          wx.showToast({
            title: '两次密码不一样',
            icon: 'none',
            duration: 4000
          })
        }
      },
      fail:function(err){  //请求失败
        console.log(err)
      },
    })
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