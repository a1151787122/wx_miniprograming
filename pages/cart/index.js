/*
  1.获取用户收获地址
    1.绑定点击事件
    2.调用小程序内置API 获取用户收获地址 wx.chooseAddress()

  2 把获取到的收获地址存入到本地存储中
  
  3 页面加载完毕
    0 onload onshow
    1 获取本地存储中的地址数据
    2 把数据设置给data中的一个变量
  4 全选事件 数据的显示
    1 onshow 获取缓存中的购物车数组
    2 根据购物车中的商品数据 所有的商品都被选中了 
  5 总价格和中数量
  6 商品的选中事件
    1 绑定change 事件
    2 获取对象的选中状态 取反
    3 重新填充data 和缓存中
    5 重新计算全选 全部价格 和全部商品数量
  7 全选和反选
  8 商品数量的编辑
    1 + - 按钮 保定同一个点击事件 区分的关键： 自定义属性
    2 传递被点击的商品 id goods_id
    3 当购物车的数量小于1 ：（wx.showModel 弹窗提示）询问用户是否要删除
  9 点击结算
    1 有没有收货信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付界面
  */

import { chooseAddress,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime, { keys } from '../../lib/runtime/runtime';
       
Page({

  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  }, 

  onLoad: function (options) {

  },
  onShow:function(){
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    this.setData({address});
    this.setCart(cart);
  },

  async handleChooseAddress(){
    /*chooseAddress chooseInvoiceTitle chooseInvoice 这三项 现在已经默认直接授权了
    详情: https://developers.weixin.qq.com/community/develop/doc/000c0a0a590490590d0ba0c3d51801?highLine=%25E5%25B0%258F%25E7%25A8%258B%25E5%25BA%258F%25E6%2594%25B6%25E8%258E%25B7%25E5%259C%25B0%25E5%259D%2580%25E5%258F%2591%25E7%25A5%25A8%25E6%258E%25A5%25E5%258F%25A3%25E6%258E%2588%25E6%259D%2583
   */
   
    const address=await chooseAddress();
    address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
    // 存到本地缓存中
    wx.setStorageSync('address',address);
  },

  // 商品 选择点击事件
  handleItemChange(e){
    // 1 获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart}= this.data;
    // 3找到被修改的对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    // 4 选中状态取反 
    cart[index].goods_checked=!cart[index].goods_checked;
    // 5，6  把购物车数据重新设置回data 中 和缓存中

    this.setCart(cart);
  },

  // 设置购物车状态 重新计算底部工具栏 的数据 全选 总价格  购买数量
  setCart(cart){
    // 计算 全选
    // every： 数组方法 会遍历整个数组  若每一个都存在就返回true 否则就返回false
    // 空数组 也会返回 true !!!!!!
    // const allChecked=cart.length?cart.every(v=>v.goods_checked):false;
    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.goods_checked){
        totalPrice+=v.goods_num*v.goods_price;
        totalNum+=v.goods_num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length != 0 ? allChecked:false; 
    this.setData({
      cart,
      allChecked, 
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart',cart);
  },
  handleItemAllChange(){
    // 1. 获取 data 中的数据
    let {cart,allChecked}=this.data;
    // 2.修改值
    allChecked=!allChecked;
    // 3.循环修改cart 数组中的商品选中状态
    cart.forEach(v=>v.goods_checked=allChecked);
    // 4. 把修改后的值 填充回data 和者缓存中
    this.setCart(cart);
  },

  async handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到需要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    // 4 进行修改数量
    if(cart[index].goods_num===1&&operation===-1){
      const res=await showModal({content:"您是否要删除"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].goods_num+=operation;
      // 5 置回缓存和data 中
      this.setCart(cart);
    }
  },

// 点击结算
  async handlePay(){
    // 1 判断收获地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      console.log(address);
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判读用户有没有选中商品
    if(totalNum===0){
      await showToast({title:"您还没有选中商品"});
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})