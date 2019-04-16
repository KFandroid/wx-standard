import * as utils from './util.js'
import { createStaticFileKeyStr,
   createStockInfoKeyStr,
    createDateKeyStr,
    createAnomalyTableKeyStr,
    createArrKeyStr,
    createItemKeyStr } from './createKeyFn.js'
import EventBus from './pubsub.js'
const app = getApp()

export const file109 = { // 交易日历
    type: '109',
    changeCb: (data) => {
      let key = utils.addZeroAfter('a109', 31)
      let newTradeDate = data.data[data.data.length - 1]
      
      app.globalData.latestDate = newTradeDate
    //   this.setData({
    //     date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2),
    //     date2: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
    //   })
    app.globalData.static109 = true
      wx.setStorageSync(key, data)
      EventBus.emit('loginsuccess')
    //   this.isHasStaticData()
      
    },
    createKey: () => {
      
      let val = createStaticFileKeyStr(109)
      return val
    }
    // isCallMainBack: false
  }

export const file105 = { // 所有股票代码名称信息列表
    type: '105',
    changeCb: (data) => {
      app.globalData.a105 = data
      app.globalData.stockList = data.data
      let key = utils.addZeroAfter('a105', 31)
      app.globalData.static105 = true
    EventBus.emit('loginsuccess')
      wx.setStorage({ key, data })
    //   this.isHasStaticData()
    },
    createKey: () => {
      let val = createStaticFileKeyStr(105)
      return val
    }
  }
export const file101 = {
  type: '101',
  intervalTime: 6000,
  changeCb: function(data) {
    
    this.setData({
      t101: data
    })
  },
  createKey: () => {
    
    let latestDate = app.globalData.latestDate
    
    let dateStr = '' + latestDate.year +  utils.addZero(latestDate.month, 2) + utils.addZero(latestDate.day, 2)
    
    let val = createDateKeyStr(101, dateStr)
    return val
  }
}






export const file106 = { // 项目名称对应表
    type: '106',
    changeCb: (data) => {
      let itemArr = []
      let a106 = data.data
      for (let i = 0; i < a106.length; i++) {
        let cno = a106[i].no
        let temp = {}
        if (a106[i].hasOwnProperty('children')) {
          let children = a106[i].children
          for (let j = 0; j < children.length; j++) {
            temp = Object.assign({}, children[j])
            temp.cno = '' + cno + children[j].cno
            temp.name = a106[i].name
            temp.code = utils.addZero(cno, 3) + utils.addZero(children[j].cno, 3)
            temp.totalName = '' + temp.name + '-' + temp.cname
            itemArr.push(temp)
          }
        }
      }
      app.globalData.static106 = true
      let key = utils.addZeroAfter('a106', 31)
      wx.setStorageSync( key, data)
      app.globalData.t106 = data
      app.globalData.a106 = data
    EventBus.emit('loginsuccess')
    
    //   this.isHasStaticData()
    },
    createKey: () => {
      let val = createStaticFileKeyStr(106)
      return val
    }
  }

  export const fileFactory108 = function(stockCode) {
    return {
      type: '108',
      changeCb: (data) => {
        let stockInfo = {
          current: data.data.current,
          rise: data.data.rise,
          high: data.data.high,
          low: data.data.low,
          close: data.data.close,
          open: data.data.open,
          hand: data.data.hand,
          volume: data.data.volume
        }
        this.setData({
          stockInfo: Object.assign({}, this.data.stockInfo, stockInfo)
        })
      },
      intervalTime: 10000,
      createKey: () => {
        let val = createStockInfoKeyStr(108, stockCode)
        return val
      }
      // isCallMainBack: false
    }
  }

  export const fileFactory102 = (no) => ({ //分项统计数据
    type: '102',
    intervalTime: 14000,
    changeCb: function(data) {
      this.setData({
        t102: data
      })
    },
    createKey: () => {
      let latestDate = app.globalData.latestDate
      let dateStr = '' + latestDate.year +  utils.addZero(latestDate.month, 2) + utils.addZero(latestDate.day, 2)
      let val = createItemKeyStr(102, '00' + no.detail + '000', dateStr)
      return val
    }
  })

  export const fileFactory103 = (itemCode, page, sortCode) => ({ // 异动项目对应股票数据
    type: '103',
        intervalTime: 7000,
        changeCb: function(data){
          
          let tree = []
          let a105 = app.globalData.a105
          if (a105) {
            let data103 = data.data
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
              data: tree,
              page: parseInt(data.page),
              totalPage: parseInt(data.totalPage)
            })
          }
        },
        createKey: () => {
          let latestDate = app.globalData.latestDate
          let dateStr = '' + latestDate.year +  utils.addZero(latestDate.month, 2) + utils.addZero(latestDate.day, 2)
          let val = createAnomalyTableKeyStr(103, itemCode, page, dateStr, sortCode)
          return val
        }
  })

  export const fileFactory145 = (str) => ({ // 异动项目对应股票数据
        type: '145',
        intervalTime: 4000,
      changeCb: function(data){
       let stockList = this.data.indexList
       for(let j = 0; j < data.data.length; j++) {
         let temp = data.data[j]
        for(let i = 0; i < stockList.length; i++) {
          if(stockList[i].code === temp.code) {
            this.data.indexList[i] = Object.assign({}, this.data.indexList[i], temp)
          }
        }
       }
      
        this.setData({
          indexList: stockList
        })
      },
      createKey: () => {

        let val = createArrKeyStr(145, utils.addZero('', 10), str)
        return val
      }
  })
  