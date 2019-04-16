

export const reStatus = function(code){
    if(code === '01') {
        wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 4000
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
      } else if(code === '10004') {
        wx.showToast({
          title: '请输入正确的密码！',
          icon: 'none',
          duration: 4000
        })
      }else if(code==='10005'){
        wx.showToast({
          title: '该用户已注册',
          icon: 'none',
          duration: 4000
        })
      }else if(code==='10006'){
        wx.showToast({
          title: '未查询到该手机发送的验证码',
          icon: 'none',
          duration: 4000
        })
      }
}