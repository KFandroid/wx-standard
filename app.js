// 初始化设置
import storage from 'utils/util.js'
const util = require('./utils/util.js')
const socket = require('./utils/socket.js')


const getStorage = function (key, defaultValue) {
  let val = wx.getStorageSync(key)
  if (val == '') {
    val = defaultValue
  }
  return val
}

const addZeroAfter = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.push('0')
  }
  return code.join('')
}
//app.js
App({
  onLaunch: function () {
    wx.onMemoryWarning(() => {
      console.log('警告内存占用过多！！！')
    })
    // wx.onSocketOpen(() => {
    //   console.log('open!!!!')
    // })
  },
  onShow() {
    const constKey = ['a105', 'a106', 'a109']
    for (let i = 0; i < constKey.length; i++) {
      let key = addZeroAfter(constKey[i], 31)
      let data = getStorage(key, null)
      if (data) {
        this.globalData[key] = this.globalData[constKey[i]] = data
      }
    }

    let settingItem = wx.getStorageSync('settingItem')
    if (settingItem) {
      this.globalData.settingItem = settingItem
    }
  },
  onHide() {
  },
  globalData: {
    selectCustomStockTableIndex: 0,
    indexList: [{"stockCode":"A00001","code":"060001","stockName":"上证指数","py":"SZZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00002","code":"060002","stockName":"Ａ股指数","py":"AGZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00003","code":"060003","stockName":"Ｂ股指数","py":"BGZS","market":"上指","type":"", "y":200},
    {"stockCode":"A00009","code":"060004","stockName":"上证380","py":"SZ380","market":"上指","type":"", "y":200},
    {"stockCode":"A00010","code":"060005","stockName":"上证180","py":"SZ180","market":"上指","type":"", "y":200},
    {"stockCode":"A00016","code":"060006","stockName":"上证50","py":"SZ50","market":"上指","type":"", "y":200},
    {"stockCode":"A00132","code":"060007","stockName":"上证100","py":"SZ100","market":"上指","type":"", "y":200},
    {"stockCode":"A00133","code":"060008","stockName":"上证150","py":"SZ150","market":"上指","type":"", "y":200},
    {"stockCode":"B00001","code":"060009","stockName":"深证成指","py":"SZCZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00002","code":"060010","stockName":"深成指R","py":"SCZR","market":"深指","type":"", "y":200},
    {"stockCode":"B00004","code":"060011","stockName":"深证100","py":"SZ100","market":"深指","type":"", "y":200},
    {"stockCode":"B00005","code":"060012","stockName":"中小板指","py":"ZXBZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00006","code":"060013","stockName":"创业板指","py":"CYBZ","market":"深指","type":"", "y":200},
    {"stockCode":"B00008","code":"060014","stockName":"中小300","py":"ZX300","market":"深指","type":"", "y":200},
    {"stockCode":"B00009","code":"060015","stockName":"深证200","py":"SZ200","market":"深指","type":"", "y":200},
    {"stockCode":"B00012","code":"060016","stockName":"创业300","py":"CY300","market":"深指","type":"", "y":200}],
    indicatorSetting: {
      kdj1: 9,
      rsi1: 6,
      rsi2: 12,
      rsi3: 24,
      wr1: 10,
      wr2: 6,
      boll1: 20,
      boll2: 2,
      bias1: 6,
      bias2: 12,
      bias3: 21
    },
    selectStock: {
      code: '010001',
      stockName: '平安银行',
      stockCode: '000001'
    },
    userInfo: null,
    stockList: null,
    kSizeLevel: 2,
    kDate: null,
    kDateArr: [],
    k105: [],
    settingItem: {
      jhjj: false,
      fsjx: false,
      fsjlx: false,
      ydjx: {
        show: true,
        period: [5, 10]
      },
      cbjx: {
        show: false,
        period: [5, 10]
      },
      cjljx: {
        show: true,
        period: [5, 10]
      },
      beforeRf: true
    }
  }
})