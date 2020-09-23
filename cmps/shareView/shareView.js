// cmps/shareView/shareView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    btntitleList:[
      {
        image:"/assets/imgs/smallCode.png",
        title:"小程序码"
      },
      {
        image:"/assets/imgs/poster.png",
        title:"生成海报"
      },
      {
        image:"/assets/imgs/shareURL.png",
        title:"分享链接"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goodDetail:function(event){
      let itemIndex = event.currentTarget.dataset.itemindex;
      if(itemIndex ==0){
        this.triggerEvent('suo');
        console.log("我是组件");
        console.log(this.data.text);
        console.log(event);
      }
      if(itemIndex ==1){
        // this.triggerEvent('code1');
        console.log("我是组件");
      }
      if(itemIndex ==2){
        // this.triggerEvent('code2');
        console.log("我是组件");
      }
     
    },
    hideView:function(){
      this.triggerEvent('hide');
      console.log("隐藏")
    }
  }
})
