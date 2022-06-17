import { createStore } from 'vuex'

const getLocalCartList = () => {
  try {
    return JSON.parse(localStorage.cartList)
  } catch (e) {
    return {}
  }
}

const setLocalStorageCartList = state => {
  const { cartList } = state
  const cartListString = JSON.stringify(cartList)
  localStorage.cartList = cartListString
}

export default createStore({
  state: {
    // 购物车数据结构 cartList: {shopId :{shopName:"",addressId:"",productList:{}}}
    // 第一层是商店Id：shopId  第二层是商店名和地址及其内容 {shopName:"",productList:{}}
    cartList: getLocalCartList()
  },
  getters: {},
  mutations: {
    changeCartItemInfo(state, payload) {
      // 商品的增减
      const { shopId, productId, productInfo, num, shopName } = payload
      // 商店信息
      const shopInfo = state.cartList[shopId] || {
        shopName: shopName,
        productList: {}
      }
      // 商品信息
      let product = shopInfo.productList[productId]
      // 不存在则赋值空对象
      if (!product) {
        product = productInfo // 不存在则把商品信息添加进去
        product.count = 0
        product.checked = true
      }
      product.count += num // 计算商品总数
      if (num > 0) {
        product.checked = true
      }
      if (product.count < 0) {
        product.count = 0
      }
      // 把信息添加到cartList
      shopInfo.productList[productId] = product
      state.cartList[shopId] = shopInfo
      setLocalStorageCartList(state)
    },
    changeCartItemChecked(state, payload) {
      const { shopId, productId } = payload
      const shopInfo = state.cartList[shopId]
      shopInfo.productList[productId].checked =
        !shopInfo.productList[productId].checked
      setLocalStorageCartList(state)
    },
    clearCartProducts(state, payload) {
      const { shopId } = payload
      state.cartList[shopId].productList = {}
      setLocalStorageCartList(state)
    },
    // 全选
    changeCartProductsChecked(state, payload) {
      const { shopId, isCheckedAll } = payload
      const cartList = state.cartList[shopId]?.productList
      for (const i in cartList) {
        cartList[i].checked = isCheckedAll
      }
      setLocalStorageCartList(state)
    }
  },
  actions: {},
  modules: {}
})
