// components/skill/skill.js
Component({
  /**
   * 组件的属性列表
   */
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
        console.log('chapter',data)
      }
    },
    indexSearchHeight:{
      type:Number,
      value:280,
      observer(data){
        this.setData({
          scrollViewHeight:data-32
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
