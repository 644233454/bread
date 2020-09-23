// cmps/good/good.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    good:{
      type:Object,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail:function(){
      wx.navigateTo({
        url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${ JSON.stringify(this.data.good)}`
      });
    }
  }
})
