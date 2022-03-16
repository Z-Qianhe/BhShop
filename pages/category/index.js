// pages/category/index.js
import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // web中的本地存储 和小程序中的本地存储的区别
    //    web：localStorage.setItem("key","value") localStorage.getItem("key")
    //    小程序中：wx.setStorageSync("key", "value"); wx:getStorageSync("key");
    // 村的时候 有没有做类型转换
    //   web 不管存入什么类型数据，最终都会先调用toString(),把数据变成了字符串，在存入进去
    //  小程序中不存在类型转换
    // 判断本地存储中有没有旧的数据
    // {time:Date.now(),data:[...]}
    // 没有旧数据 直接发送新请求
    // 有旧数据 同时旧数据没有过期 就使用 本地存储中的旧数据即可
    // this.getCates();

    // 1、获取本地存储中的数据（小程序中也是存在本地存储技术
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 悠久的数据
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let rightContent = this.Cates[index].children;
        this.setData({
          currentIndex: index,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    // .then(res => {
    //   // console.log(res);
    //   this.Cates=res.data.message;

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的 async await 来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })

  },
  // 左侧点击事件
  handleItemTap(e) {
    // 获取被点击的标题身上的索引
    // 给data中的currentIndex赋值就可以
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置 右侧内容的scroll-view标签的距离
      scrollTop: 0
    })


  }
})



