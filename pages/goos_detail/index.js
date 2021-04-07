import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  goodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsDetail(goods_id); 
  },
  async getGoodsDetail(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}});
    let goodsObj = res.data.message;
    this.goodsInfo = goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // 部分iphone 手机不识别webp 格式的图片
        // 最好是找后台修改
        // 临时修改 确保后台存在webp->jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
  },
  handlePreviewImage(e){
    const urls = this.goodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, urls
    })
  },
  handleCart(){
    console.log('asdd');
    // 1.获取缓存中的购物车数组 
    let cart=wx.getStorageSync('cart')||[];
    // 2.判断商品对象是否在购物车中
    let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index===-1){
      // 3.不存在 第一次添加
      this.goodsInfo.goods_num=1;
      this.goodsInfo.goods_checked=true;
      cart.push(this.goodsInfo);
    }else{
      // 4.已存在数据 执行num++
      cart[index].goods_num++;
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorage({data: cart,key: 'cart'});
    // 6.弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon:'success',
      // mask: ture  弹窗消失前用户不能做其他操作
      mask:true
    })
  }
})