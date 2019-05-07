// components/skill/skill.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */  
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      console.log('组件移除')
    },
    ready(){
      const query = wx.createSelectorQuery().in(this)
      query.select('.skill-form').boundingClientRect(function (res) {
        res.top
      })
      query.exec((res) => {
       console.log(res)
       this.setData({
        scrollViewHeight:this.data.indexSearchHeight-res[0].height
      })
      })
    }
  },

  properties: {
    /* proInfo: {
      type: Object,
      value: null,
      observer(data) {
  
        let oridata = data.sort(this.compare('sort'))
        this.setData({
          proInfo:oridata
        })
      }
    },
    iconInfo: {
      type: Object,
      value: null,
      observer(data) {
        this.setData({
          iconInfo:data
        })
      }
    }, */
    chapterDetail:{
      type:Object,
      value: null,
      observer(data){
        let oridata = data.sort(this.compare('sort'))
        this.setData({
          chapterDetail:oridata
        })
        console.log(oridata)
       
      }
    },
    indexSearchHeight:{
      type:Number,
      value:280,
      observer(data){
        this.setData({
          indexSearchHeight:data
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleIndex:'1',
    scrollViewHeight:200,
    chapterDetail:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToChapter(e){
      //跳转到异动anomaly详情页面



      
      app.globalData.isYidong= true
      /* wx.navigateTo({
        url: `../anomaly/anomaly`,
      }) */

     /*  this.setData({
        isYidong: true
      }) */
      this.triggerEvent('getYidong', { isYidong:2,
      currentChapter:e.currentTarget.dataset.chapter
      });


      
    },
    getIndex(e){
      this.setData({
        titleIndex:e.currentTarget.dataset.index
      })
    },
          //排序
    compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }
  }
})
