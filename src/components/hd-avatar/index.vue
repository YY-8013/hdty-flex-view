<template>
  <div class="hdty-avatar">
    <div v-if="loading" class="hdty-avatar-placeholder"></div>
    <div v-else-if="error" class="hdty-avatar-error"></div>
    <img v-else :src="avatar" title="查看大图" :large="avatar" :preview="'avatar_'+$utilStr.uuid()">
    <slot>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    provide() {
      return {
        hdAvatar: this
      };
    },
    props: {
      avatar: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: true,
        error: false
      }
    },
    watch: {
      avatar: {
        handler() {
          this.loadImage();
        },
        immediate: true
      }
    },
    mounted() {
      this.setPreviewTopBar();
    },
    methods: {
      loadImage() {
        this.loading = true;
        this.error = false;
        const img = new Image();
        img.onload = this.handleLoad;
        img.onerror = this.handleError.bind(this);
        img.src = this.avatar;
      },
      handleLoad() {
        this.loading = false;
        this.$previewRefresh();
      },
      handleError(e) {
        this.loading = false;
        this.error = true;
        this.$emit('error', e);
      },
      setPreviewTopBar() {
        this.$preview.on('imageLoadComplete', (i, item) => {
          let scrollWrapEl = this.$preview.self.scrollWrap;
          let topBarEl = scrollWrapEl.querySelector('.pswp__top-bar');
          let rotateBtnEl = topBarEl.querySelector('.pswp__button--rotate');
          if(rotateBtnEl) {
            rotateBtnEl.remove();
          }
          let targetEl = topBarEl.querySelector('.pswp__button--zoom');
          rotateBtnEl = document.createElement('button');
          rotateBtnEl.title = '向右旋转';
          rotateBtnEl.className = 'pswp__button pswp__button--rotate';
          let index = 0;
          rotateBtnEl.onclick = () => {
            index++;
            item.container.lastChild.style.transform = 'rotate('+(index% 4)* 90+'deg)';
          };
          topBarEl.insertBefore(rotateBtnEl, targetEl);
          topBarEl.querySelector('.pswp__button--zoom').setAttribute('title', '放大/缩小');
          topBarEl.querySelector('.pswp__button--fs').setAttribute('title', '切换全屏');
          topBarEl.querySelector('.pswp__button--close').setAttribute('title', '关闭窗口');
          scrollWrapEl.querySelector('.pswp__button--arrow--left').setAttribute('title', '上一张');
          scrollWrapEl.querySelector('.pswp__button--arrow--right').setAttribute('title', '下一张');
        });
      }
    }
  }
</script>

<style scoped>

</style>
