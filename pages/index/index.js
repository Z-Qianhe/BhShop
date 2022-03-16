//0 引入 用来发送请求的方法  一定要把路径补全
import {request} from "../../request/index";
Page({
  data: {
    //轮播图数组
    swiperList:[],
    // 导航数组
    cateList:[],
    //楼层数据
    floorList:[]
  },
    //页面开始加载就会触发
  onLoad:function(options){
    //发送异步请求获取轮播图数据 优化的手段可以通过es6的 promise来解决这个问题
    // var reqTask = wx.request({
    //   //url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',//请求那些数据
    //   //data: {},//请求的参数
    //   //header: {'content-type':'application/json'},
    //   //method: 'GET',默认数值
    //   // dataType: 'json',默认数值
    //   // responseType: 'text',
    //   // success: (result)=>{
    //   //   // console.log(result);
    //   //   //获取数据
    //   //   this.setData({
    //   //     swiperList:result.data.message
    //   //   })
    //   },
      // fail: ()=>{},
      // complete: ()=>{}
    // });

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
      .then(result => {
        this.setData({
          swiperList:result
        })
      })
  },
  //获取分组数据
  getCateList(){
    request({url:"/home/catitems"})
      .then(result => {
        this.setData({
          cateList:result
        })
      })
  },

  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
      .then(result => {
        this.setData({
          floorList:result
        })
      })
  }

})