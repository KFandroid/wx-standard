  
  const app = getApp()

  
  /**
   * type: 文件类型
   * isReturn 是否返回了数据
   * changeCb 当数据返回时的回调函数
   * createKey 创建Key值的函数
   * filter 过滤器，当过滤器返回true时请求数据没有过滤器的file给个默认返回true的函数
   * intervalTime 间隔时间，当file存在间隔时间时则会定时请求
   */
  class WXFile {
    constructor(file, storage) {
      this.type = file.type
      this.isReturn = true
      this.changeCb = (data) => {
        
        file.changeCb.bind(file.ctx)(data) //绑定file的上下文 箭头函数的this优先级比bind的优先级高
        this.isReturn = true
      }
      this.createKey = () => {
        // this.isReturn = false
        return file.createKey.bind(file.ctx)()
      }
      // if(file.hasOwnProperty('intervalTime')) {
        this.intervalTime = file.intervalTime || 0 // FIXME
      if(file.filter) {
        this.filter = () => {
          return file.filter.bind(file.ctx)()
        }
      } else {
        
        this.filter = () => true
      }

      // }
      this.updateHandle = null
      if (this.intervalTime) {
        this.updateHandle = setInterval(() => {
          let key = this.createKey()
          storage.getData(key)
        }, this.intervalTime)
      }
    }
  
    // this.isCallMainBack = file.isCallMainBack
  
  // 删除file时的操作，目前仅清空定时器
    deleteFile() {
  
      if (this.updateHandle) {
        clearInterval(this.updateHandle)
      }
    }
  
  }
  
  
// 管理file的容器
  class WXStorage {
    /**
     *
     * @param fileList
     * @param fileList
     */
    constructor(fileList) {
      this.fileList = []
      this.fileTypeList = []
      this.upDateHandle = []
      // 新建
      for (let i = 0; i < fileList.length; i++) {
        this.fileList.push(new WXFile(fileList[i], this))
        this.fileTypeList.push('' + fileList[i].type)
      }
    }
  /**
   * 是否所有请求的数据都返回回来了
   */
    hasDealData() {
      let flag = true
      this.fileList.forEach(file => {
        if(!file.isReturn) {
          flag = false
        }
      })
      return flag
    }
    /**
     * 添加一个file，并请求
     * @param {Object} file 
     */
    addFile(file) {
      if (this.fileTypeList.indexOf(file.type) > 0) {
        return
      }
      let newFile = new WXFile(file, this)
      let key = newFile.createKey()
      this.fileList.push(newFile)
      this.fileTypeList.push('' + file.type)
      this.getData(key)
    }
    // 根据fileType删除file
    deleteFile(fileType) {
      fileType = '' + fileType
      let index = this.fileTypeList.indexOf(fileType)
  
      if (index > -1) {
        let file = this.fileList[index]
        file.deleteFile()
        this.fileTypeList.splice(index, 1)
        this.fileList.splice(index, 1)
  
      }
    }
  // 清空所有的file
    clearFile() {
      
      let fileList = [].concat(this.fileList)
      fileList.forEach(file => {
        this.deleteFile(file.type)
      })
    }
  
    init() {
      this.fileList.forEach(file => {
        let key = file.createKey()
        this.getData(key)
      })
    }
  
    // 请求一遍所有的file
    getFileData() {
      this.fileList.forEach(file => {
        let key = file.createKey()
        this.getData(key)
      })
    }
    /**
     * 监听file的改变
     * @param {String} fileType 
     * @param {Object} data
     */
    observeFileChange(fileType, data) {
      let fileIndex = this.fileTypeList.indexOf(fileType)
      // 当file改变时，将数据存入内存
      if (fileIndex > -1) {
        this.setAData(fileType, data)
        let changeData = this.fileList[fileIndex].changeCb(data)
        if (changeData) {
          this.setAData(fileType, changeData)
        }
      }
    }
  
    /**
     * 将数据存入内存
     * @param {String} key 
     * @param {Object} data 
     */
    setAData(key, data) {
  
      function createKey(data) {
        return key + data.code + data.page + data.stockCode + data.date + data.sortCode
      }
  
      if (data.page === data.totalPage && parseInt(data.totalPage) > 0) {
  
        let pageTable = app.globalData['pageTable' + data.stockCode] || {}
        pageTable[key] = data.totalPage
        app.globalData['pageTable' + data.stockCode] = pageTable
      }
      let tableKey
      if (key.length > 3) {
        tableKey = key
      } else {
        tableKey = createKey(data)
      }
      app.globalData['a' + tableKey.slice(0, 3)] = data
      app.globalData['a' + tableKey] = data
    }
    /**
     * 从内存或本地文件中获取
     * @param {String} key 
     */
    getStorage(key) {
      let data
      let fileType = key.slice(0, 3)
      if (app.globalData['a' + key] !== undefined) {
        data = app.globalData['a' + key]
        this.observeFileChange(fileType, data)
      }
    }
  // 发送请求
    getData(keyValue) {
      let fileType = keyValue.storage.slice(0, 3)
      let index = this.fileTypeList.indexOf(fileType)
      let file = this.fileList[index]
      
      if(file.filter()) { //如果file满足发送条件则发送否则不发送
        this.getStorage(keyValue.storage)
        this.sendMessage(keyValue.query)
      }  
    }
  
    sendMessage(msg) {
/*       if(msg.indexOf('112') == 0){
        console.log('请求',msg)
      } */
      wx.sendSocketMessage({
        data: msg,
        success(data) {
  
        },
        fail(err) {
  
        }
      })
    }
  }
  
  export default new WXStorage([])