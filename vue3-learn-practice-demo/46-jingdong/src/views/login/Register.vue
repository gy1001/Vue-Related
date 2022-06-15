<template>
  <div class="wraper">
    <div class="register">
      <img
        class="register-icon"
        src="http://www.dell-lee.com/imgs/vue3/超市.png"
      />
      <input type="tel" placeholder="请输入手机号" />
      <input type="password" placeholder="请输入密码" />
      <input type="password" placeholder="确认密码" />
      <div class="register-btn" @click="handleRegister">注册</div>
      <div class="register-link" @click="handleLoginClick">已有账号去登陆</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
const useRegisterEffect = () => {
  const router = useRouter()
  const handleRegister = () => {
    router.push({ name: 'login' })
  }
  const handleLoginClick = () => {
    router.push({ name: 'login' })
  }
  return { handleRegister, handleLoginClick }
}
export default {
  name: 'register-item',
  setup() {
    const { handleRegister, handleLoginClick } = useRegisterEffect()
    return { handleRegister, handleLoginClick }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
.register {
  position: absolute;
  width: 100vw;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  &-icon {
    display: block;
    width: 0.66rem;
    height: 0.66rem;
    margin: 0 auto 0.24rem auto;
  }
  &-link {
    font-size: 0.14rem;
    width: 0.98rem;
    padding-right: 0.12rem;
    margin: 0 auto;
    color: rgba($color: #000000, $alpha: 0.5);
  }
  input {
    display: block;
    width: 2.79rem;
    margin: 0.16rem auto;
    padding-left: 0.16rem;
    font-size: 0.16rem;
    line-height: 0.48rem;
    color: rgba($color: #000000, $alpha: 0.5);
    background-color: #f9f9f9;
    border-radius: 0.06rem;
    border: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
    outline-color: $btn-bgColor;
  }
  &-btn {
    display: block;
    width: 2.95rem;
    margin: 0.32rem auto 0.16rem auto;
    font-size: 0.16rem;
    line-height: 0.48rem;
    text-align: center;
    color: $bgColor;
    background: $btn-bgColor;
    box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 145, 255, 0.32);
    border: none;
    border-radius: 0.04rem;
    border-radius: 0.04rem;
    outline-color: $btn-bgColor;
  }
}
</style>
