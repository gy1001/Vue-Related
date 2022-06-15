<template>
  <div class="wraper">
    <div class="login">
      <img
        class="login-icon"
        src="http://www.dell-lee.com/imgs/vue3/超市.png"
      />
      <input type="number" placeholder="请输入手机号" v-model="mobile" />
      <input type="password" placeholder="请输入密码" v-model="password" />
      <div class="login-btn" @click="loginSubmit">登录</div>
      <div class="login-link" @click="toRegister">立即注册</div>
    </div>
    <Toast v-if="isShowToast" :message="toastMessage" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/requests'
import Toast, { useToastEffect } from '../../components/showToast.vue'
export default {
  name: 'jd-login',
  components: {
    Toast
  },
  setup() {
    const router = useRouter()
    const password = ref('')
    const mobile = ref('')
    const { isShowToast, toastMessage, showToast } = useToastEffect()
    const loginSubmit = async () => {
      if (!mobile.value || !password.value) {
        showToast('用户名密码必填')
        return
      }
      try {
        const result = await post('/api/user/login', {
          username: mobile.value,
          password: password.value
        })
        if (result?.errno === 0) {
          localStorage.isLogin = true
          router.push({ path: '/' })
        } else {
          console.log('登录失败')
          showToast('登录失败')
        }
      } catch (e) {
        console.log('请求失败')
        showToast('请求失败')
      }
    }
    const toRegister = () => {
      router.push({ name: 'register' })
    }
    return {
      isShowToast,
      toastMessage,
      loginSubmit,
      toRegister,
      mobile: mobile,
      password: password
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';
.login {
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
    width: 0.56rem;
    padding-right: 0.12rem;
    margin: 0 auto;
    color: $content-notice-fontColor;
    border-right: 0.01rem solid rgba($color: #000000, $alpha: 0.5);
  }
  input {
    display: block;
    width: 2.79rem;
    margin: 0.16rem auto;
    padding-left: 0.16rem;
    font-size: 0.16rem;
    line-height: 0.48rem;
    color: $content-notice-fontColor;
    background-color: #f9f9f9;
    border-radius: 0.6rem;
    border: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
    outline-color: $btn-bgColor;
    // 去除type=number时的上下箭头
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
  input[type='number'] {
    -moz-appearance: textfield;
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
  &-btn:hover {
    background-color: rgba(0, 145, 255, 0.9);
    box-shadow: 0 0.04rem 0.08rem 0.03rem rgba(0, 145, 255, 0.32);
  }
}
</style>
