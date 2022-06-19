<template>
  <div class="bg">
    <div class="top">
      <div class="top-head">
        <span class="top-head-back iconfont" @click="jumpBack">&#xe677;</span>
        确认订单
      </div>
      <div class="top-receive">
        <h3 class="top-receive-title">收获地址</h3>
        <div class="top-receive-address">北京理工大学国防科技园2号楼10层</div>
        <div class="top-receive-contact">
          <span>瑶妹（先生） </span>
          <span>18911024266</span>
        </div>
        <span class="top-receive-icon iconfont"> &#xe665;</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'top-area',
  setup() {
    const router = useRouter()
    const jumpBack = () => {
      router.back()
    }
    return {
      jumpBack
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
.bg {
  margin-bottom: 0.53rem;
  height: 1.565rem;
  background-image: linear-gradient(
    0deg,
    rgba(0, 145, 255, 0) 4%,
    $btn-bgColor 50%
  );
}
.top {
  position: relative;
  &-head {
    text-align: center;
    line-height: 0.685rem;
    color: $bgColor;
    &-back {
      position: absolute;
      left: 0.18rem;
      font-size: 0.22rem;
    }
  }
  &-receive {
    position: absolute;
    left: 0.18rem;
    right: 0.18rem;
    background: $bgColor;
    border-radius: 0.04rem;
    padding: 0.16rem;
    color: $content-fontColor;
    box-shadow: 0 0.02rem 0.04rem rgba($color: #000000, $alpha: 0.1);
    &-title {
      font-size: 0.16rem;
      margin-bottom: 0.14rem;
    }
    &-address {
      font-size: 0.14rem;
      margin-bottom: 0.06rem;
    }
    &-contact {
      font-size: 0.12rem;
      color: #666;
    }
    &-icon {
      position: absolute;
      top: 50%;
      right: 0.18rem;
      transform: translateY(-50%);
      font-size: 0.18rem;
    }
  }
}
</style>
