<template>
  <div class="wrapper">
    <div class="position">
      <span class="position__icon iconfont">&#xe636;</span>
      山西理工大学国防科技园2号楼10层 北京北京北京北京北京北京
      <span class="position__notice iconfont">&#xe63d;</span>
    </div>
    <div class="searchbar">
      <div class="searchbar-icon">
        <span class="iconfont">&#xe60c;</span>
      </div>
      <input type="search" placeholder="山姆会员商店优惠商品" />
    </div>
    <div class="banner">
      <img
        class="banner__img"
        src="http://www.dell-lee.com/imgs/vue3/banner.jpg"
      />
    </div>
    <div class="icons">
      <div class="icons__item" v-for="item in navList" :key="item.desc">
        <img
          :src="`http://www.dell-lee.com/imgs/vue3/${item.imgName}.png`"
          alt=""
          class="icons__item-icon"
        />
        <p class="icons__item-desc">{{ item.desc }}</p>
      </div>
    </div>
    <div class="border-line"></div>
  </div>
  <div class="docker">
    <!-- BEM 命名规则
      block_element Modifier
     -->
    <span class="docker_item docker_item--active">
      <i class="iconfont">&#xe752;</i>
      <div class="docker_item-title">首页</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe64e;</i>
      <div class="docker_item-title">购物车</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe600;</i>
      <div class="docker_item-title">订单</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe63c;</i>
      <div class="docker_item-title">我的</div>
    </span>
  </div>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <!-- <router-view /> -->
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const navList = reactive([
      { imgName: '超市', desc: '超市便利' },
      { imgName: '菜市场', desc: '菜市场' },
      { imgName: '水果店', desc: '水果店' },
      { imgName: '鲜花', desc: '鲜花绿植' },
      { imgName: '医药健康', desc: '医药健康' },
      { imgName: '家居', desc: '家居时尚' },
      { imgName: '蛋糕', desc: '烘培蛋糕' },
      { imgName: '签到', desc: '签到' },
      { imgName: '大牌免运', desc: '大牌免运' },
      { imgName: '红包', desc: '红包套餐' }
    ])
    return { navList }
  }
})
</script>

<style lang="scss" scoped>
@import './style/variable.scss';
@import './style/mixins.scss';
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.49rem;
  right: 0;
  padding: 0 0.18rem;
  .position {
    @include ellipse;
    padding: 0.16rem 0;
    line-height: 0.22rem;
    font-size: 0.16rem;
    position: relative;
    padding-right: 0.24rem;
    color: $content-fontColor;
    &__icon {
      top: 1rem;
      margin-right: 0.08rem;
    }
    &__notice {
      position: absolute;
      font-size: 0.2rem;
      top: 0.17rem;
      right: 0;
    }
  }
}
.searchbar {
  display: flex;
  border-radius: 0.16rem;
  height: 0.32rem;
  background: rgba($color: #272727, $alpha: 0.1);
  color: #b7b7b7;
  overflow: hidden;
  input {
    width: 100%;
    height: 100%;
    font-size: 0.14rem;
    line-height: 0.16rem;
    border: 0rem;
    outline: none;
    background: rgba($color: #272727, $alpha: 0.05);
  }
  &-icon {
    line-height: 0.32rem;
    margin: 0rem 0.07rem;
  }
}
.banner {
  margin-top: 0.12rem;
  height: 0;
  overflow: hidden;
  padding-bottom: 25.4%; // 放置图片加载过程导致的页面抖动
  &__img {
    width: 100%;
    border-bottom: 25%;
  }
}
.icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0.16rem;
  color: $content-fontColor;
  &__item {
    width: 20%;
    &-icon {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      margin: 0 auto;
    }
    &-desc {
      text-align: center;
      margin: 0.06rem 0 0.16rem 0;
      font-size: 0.12rem;
    }
  }
}
.border-line {
  margin: 0 -0.18rem;
  height: 0.1rem;
  background: $content-bgColor;
}
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
    .iconfont {
      font-size: 0.18rem;
      margin-top: 0.07rem;
      margin-bottom: 0.02rem;
      display: inline-block;
    }
  }
}
</style>
