<template>
  <div class="toast">{{ message }}</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  name: 'toast-item',
  props: { message: String }
}
export const useToastEffect = () => {
  const toastData = reactive({
    toastMessage: '',
    isShowToast: false
  })
  const showToast = msg => {
    toastData.isShowToast = true
    toastData.toastMessage = msg
    setTimeout(() => {
      toastData.isShowToast = false
    }, 1500)
  }
  const { toastMessage, isShowToast } = toRefs(toastData)
  return { showToast, toastMessage, isShowToast }
}
</script>

<style lang="scss" scoped>
@import '../style/variable.scss';
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.12rem 0.16rem;
  color: $content-notice-fontColor;
  border-radius: 0.08rem;
  background-color: $bgColor;
  box-shadow: 0.01rem 0.01rem 0.02rem 0.01rem $content-notice-fontColor;
}
</style>
