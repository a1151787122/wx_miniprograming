/*
  1 页面加载的时候
    1从缓存中获取购物车数据 渲染到页面中
      这些数据 goods_checked = true
  2 微信支付
    1 哪些人 那些账号 可以实现微信支付
      1 企业账号
      2 企业账号的小程序后台中 必须给开发者 添加上白名单
        1一个app id 可以绑定多个开发者
*/

 import { chooseAddress,showModal,showToast} from "../../utils/asyncWx.js";
 import regeneratorRuntime, { keys } from '../../lib/runtime/runtime';
        
 Page({
 
   data: {
     address:{},
     cart:[],
     totalPrice:0,
     totalNum:0
   }, 
 
   onShow:function(){
     const address = wx.getStorageSync('address');
     // 获取缓存中的购物车数据
     let cart=wx.getStorageSync('cart')||[];
    //  过滤过车数组
     cart=cart.filter(v=>v.goods_checked);

     let totalPrice=0;
     let totalNum=0;
     cart.forEach(v=>{
         totalPrice+=v.goods_num*v.goods_price;
         totalNum+=v.goods_num;
     })
     this.setData({
       cart,
       totalPrice,
       totalNum,
       address
     })
     wx.setStorageSync('cart',cart);
   },

 })