  import {
    utf8ByteArrayToString
  } from './crypt.js'
  import analysisByte from './analysis.js'
  
  // let url = 'ws://222.190.119.83:8082/l1WebSocket' // 外网地址
  // let url = 'ws://47.101.191.138:8082/l1WebSocket' // aliyun地址
  // let url = 'ws://192.168.137.50:8082/l1WebSocket' // 张孙浩
  // let url = 'ws://192.168.0.104:8082/ws'  //小伍
   let url = 'ws://101.132.168.103:8888/ws' //线上
  // let url = 'ws://192.168.0.100:8082/ws' // 王
  let reconnectHandle = null
  const MAX_CONNECTION_NUM = 10 // 最大连接数10
  let connectCount = 0
  let socketTask
  let socketConnectFail
  export const shortConnectUrl = '101.132.168.103:7877'
  export const createConnect = () => {
    
    if (!socketTask) {
      socketTask = wx.connectSocket({ // 创建一个 WebSocket 连接
        url: url,
        fail(err) {
          if (err) {
            socketConnectFail = true // 定义一个全局变量，当链接失败时改变变量的值
          }
        }
      })
    }
  
    wx.onSocketError(function(res) {
      // 监听WebSocket错误。
  
      if (reconnectHandle) {
        clearInterval(reconnectHandle)
      }
      reconnectHandle = setInterval(() => {
        wx.closeSocket()
      if(connectCount !== MAX_CONNECTION_NUM) {
        socketTask = wx.connectSocket({ // 创建一个 WebSocket 连接
          url: url,
          fail(err) {
            if (err) {
              connectCount++
              socketConnectFail = true // 定义一个全局变量，当链接失败时改变变量的值
            }
          }
        })
      }
      }, 10000)
  
    })
  
    wx.onSocketClose(function(res) { // 监听WebSocket关闭。
  
      if (reconnectHandle) {
        clearInterval(reconnectHandle)
      }
      reconnectHandle = setInterval(() => {
        wx.closeSocket()
        if(connectCount !== MAX_CONNECTION_NUM) {
          socketTask = wx.connectSocket({ // 创建一个 WebSocket 连接
          url: url,
          fail(err) {
            if (err) {
              connectCount++
              socketConnectFail = true // 定义一个全局变量，当链接失败时改变变量的值
            }
          }
        })
      }
      }, 3000)
    })
  }
  
  export const connect = function(cb) { // 定义一个方法
    wx.onSocketMessage(function(res) { // 监听WebSocket接受到服务器的消息事件。
      cb(analysisByte(res.data))
    })
  };

  