<template>
  <div class="docker">
    <!-- BEM 命名规则
      block_element Modifier
     -->
    <span
      v-for="(item, index) in dockerList"
      :key="item.icon"
      :class="{
        docker_item: true,
        'docker_item--active': index === currentIndex
      }"
    >
      <router-link :to="item.to">
        <i class="iconfont" v-html="item.icon"></i>
        <div class="docker_item-title">{{ item.title }}</div>
      </router-link>
    </span>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  props: ['currentIndex'],
  setup() {
    const dockerList = reactive([
      { title: '首页', icon: '&#xe752;', to: { name: 'homeIndex' } },
      { title: '购物车', icon: '&#xe64e;', to: { name: 'cartList' } },
      { title: '订单', icon: '&#xe600;', to: { name: 'orderList' } },
      { title: '我的', icon: '&#xe63c;', to: { name: 'mine' } }
    ])
    return {
      dockerList
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style/variable.scss';
.docker {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.49rem;
  border-top: solid 0.01rem #f1f1f1;
  background-color: lightblue;
  text-align: center;
  display: flex;
  padding: 0 0.18rem;
  box-sizing: border-box;
  color: $content-fontColor;
  background-color: $bgColor;
  &_item {
    &--active {
      color: #1fa4fc;
    }
    flex: 1;
    &-title {
      font-size: 0.2rem; // 低于12px 浏览器不会再处理，所以要进行特殊处理
      transform-origin: center top;
      transform: scale(0.5, 0.5);
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    .iconfont {
      font-size: 0.18rem;
      margin-top: 0.07rem;
      margin-bottom: 0.02rem;
      display: inline-block;
    }
  }
}
</style>
