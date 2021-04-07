
// promise 形式的 chooseAddress
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail:(err) => {
        reject(err);
      }
    });
  })
}

// promise 形式的 showModal
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: '您是否要删除',
      // 不能直接success{。。。} 这样{} 里面的内用 用this 是success的this
      success :(res)=> {
        resolve(res);
      },fail:(err)=>{
        reject(err);
      }
    })
  })
}

// promise 形式的 showToast
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}