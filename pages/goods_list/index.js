// pages/goods_list/index.js
// 1 用户上滑页面 滚动条触底加载下一页数据
//   找到滚动条触底事件 微信小程序
//   判断还有没有下一页数据
//    获取到总页数
//      
//    获取当前页码 pagenum
//    判断
//   假如没有 弹出提示
//   假如还有 就加载
// 下拉刷新页面
//    触发下拉刷新事件 需要在页面的json文件中开启一个配置项
//    找到 出发下拉刷新的事件
//    重置 数据 数组
//    重置 页码 设置为1
//    重新发送请求
//    数据请求回来 需要手动的关闭 等待效果
import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    goods_id:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.goods_id=options.goods_id;
    this.getGoodsList();

    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)
    

  },

  // 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      // 拼接
      goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();

  },


  // 标题的点击事件
  handleTabsItemChange(e){
    // console.log(e);
    // 获取被点击的标题索引
    const {index} = e.detail;
    //  修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data
    this.setData({
      tabs
    })
  },

  // 页面上滑 
  onReachBottom(){
    // console.log("页面触底");
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      // 没有下一页数据
      // console.log('%c'+"没有数据了","color:red;font-size:100px");
      wx:wx.showToast({
        title: '没有下一页数据',
        
      })
    }else{
      // console.log('%c'+"有数据了","color:red;font-size:100px");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh(){
    // console.log('%c'+"刷新","color:red;font-size:10px;");
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1,
    // 发送请求
    this.getGoodsList();
  }
  
})