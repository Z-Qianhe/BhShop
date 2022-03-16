// pages/goods_detail/index.js
//  发送请求获取数据
//  点击轮播图 预览大图
//      给轮播图绑定点击事件
//      调用小程序的api previewImage
//  点击加入购物车
//    先绑定点击事件
//    获取缓存中的购物车数据 数组格式
//    先判断当前商品是否已经存在购物车
//    已经存在 修改商品数据 执行购物车数量++  重新把购物车数组 填充回缓存中
//    不存在购物车的数组中 直接给购物车数组添加一个新元素 带上一个购买属性
//    弹出用户提示
import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },

  // 商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone 部分手机 不识别webp图片
        // 最好找到后台 进行修改 
        // 临时自己改 确保后台存在1.webp格式 => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webpg/g,'.jpg'),
        pics:goodsObj.pics

      }
    })
  },

  // 点击轮播图 放大预览
  handlePrevewImage(e){
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击加入购物车
  handleCartAdd(){
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart')||[];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在 第一次添加
      this.GoodsInfo.num=1;
      cart.push( this.GoodsInfo);
    }else{
      // 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      // true防止用户手抖疯狂点击
      mask:true
    })
  }
  
})