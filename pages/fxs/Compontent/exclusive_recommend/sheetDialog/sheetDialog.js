Component({
  properties: {

    sheetDialogHidden: {
      type: Boolean,
      value: false
    },

  },


  data: {
    // 这里是一些组件内部数据
    inputValue: "",
    onCancleClick: false,

  },

  methods: {
  
    // 这里是一个自定义方法,取消
    cancleBtn: function() {
      // Properties pro = new Properties();
      console.log("点击取消按钮")
      this.setData({
        sheetDialogHidden: true,
      })

    },
  }
})