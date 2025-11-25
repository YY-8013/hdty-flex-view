<template>
  <div
    v-loading="loading"
    element-loading-text="正在跳转中..."
    ref="wrapperRef"
    class="hdty-iframe-wrapper"
    :style="activeWrapperStyle">
    <iframe
      v-if="currentUrl"
      ref="iframeRef"
      :src="currentUrl"
      frameborder="0"
      scrolling="auto"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      oallowfullscreen="true"
      msallowfullscreen="true"
      @load="loadComplete">
    </iframe>
    <div
      ref="maskRef"
      class="hdty-iframe-mask"
      :style="{ display: !loading ? 'none': '' }">
    </div>
  </div>
</template>

<script>
  import { subSystemUrl } from '@/api/menu';
  export default {
    name: 'IframeView',
    props: {
      // 跳转路径
      path: {
        type: String,
        default: ''
      },
      // 目标程序身份标识
      appId: {
        type: [Number, String],
        default: ''
      },
      // 目标程序客户端标识
      appClient: {
        type: [Number, String],
        default() {
          return appEnv.clientTYPE;
        }
      },
      // 跳转请求参数
      params: {
        type: Object,
        default: null
      },
      // 跳转请求图像参数
      images: {
        type: Object,
        default: null
      },
      // 最高权重跳转请求参数
      superParams: {
        type: Object,
        default: null
      },
      // 最高权重跳转请求图像参数
      superImages: {
        type: Object,
        default: null
      },
      // 是否仅作为子页面
      subpage: {
        type: Boolean,
        default: null
      },
      // 是否只显示主内容
      bodypage: {
        type: Boolean,
        default: null
      },
      // 是否进行登录认证
      landing: {
        type: Boolean,
        default: null
      },
      // 是否转接跳转参数
      forward: {
        type: Boolean,
        default: true
      },
      // 是否转换跳转路径
      transform: {
        type: Boolean,
        default: true
      },
      // 宽度
      width: {
        type: [Number, String],
        default: null
      },
      // 高度
      height: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        currentUrl: '',
        currentTheme: this.$store.state.app.theme || this.$app.themeDefault,
        currentSize: this.$store.state.app.size || this.$app.sizeDefault,
        loading: false
      }
    },
    computed: {
      activeInitImages() {
        return this.$utilLink.processLinkParamsKeywords(this.images, 1);
      },
      activeParentParams() {
        return  {
          ...this.$route.params,
          ...this.$route.query
        };
      },
      activeOriginParams() {
        return this.$utilStr.parameterToObj(this.path);
      },
      activeSuperImages() {
        return this.$utilLink.processLinkParamsKeywords(this.superImages, 1);
      },
      activeForward() {
        return !this.$utilStr.isEmpty(this.superParams) && !this.$utilStr.isEmpty(this.superParams.forward)
          ? this.$utilStr.parseBoolean(this.superParams.forward)
          : !this.$utilStr.isEmpty(this.activeOriginParams) && !this.$utilStr.isEmpty(this.activeOriginParams.forward)
            ? this.$utilStr.parseBoolean(this.activeOriginParams.forward)
            : !this.$utilStr.isEmpty(this.forward)
              ? this.$utilStr.parseBoolean(this.forward)
              : !this.$utilStr.isEmpty(this.params) && !this.$utilStr.isEmpty(this.params.forward)
                ? this.$utilStr.parseBoolean(this.params.forward)
                : false;
      },
      activeTransform() {
        return !this.$utilStr.isEmpty(this.superParams) && !this.$utilStr.isEmpty(this.superParams.transform)
          ? this.$utilStr.parseBoolean(this.superParams.transform)
          : !this.$utilStr.isEmpty(this.activeOriginParams) && !this.$utilStr.isEmpty(this.activeOriginParams.transform)
            ? this.$utilStr.parseBoolean(this.activeOriginParams.transform)
            : !this.$utilStr.isEmpty(this.transform)
              ? this.$utilStr.parseBoolean(this.transform)
              : !this.$utilStr.isEmpty(this.params) && !this.$utilStr.isEmpty(this.params.transform)
                ? this.$utilStr.parseBoolean(this.params.transform)
                : false;
      },
      activeAllParams() {
        return {
          path: this.path,
          appId: this.appId,
          appClient: this.appClient,
          params: this.params,
          images: this.images,
          superParams: this.superParams,
          superImages: this.superImages,
          subpage: this.subpage,
          bodypage: this.bodypage,
          landing: this.landing,
          forward: this.forward,
          transform: this.transform
        }
      },
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      activeAllParams: {
        handler() {
          this.reload();
        },
        deep: true,
        immediate: false
      },
    },
    created() {
      // 接收postMessage消息
      window.addEventListener('message', this.receivePostMessage);
      // 加载Iframe
      this.load();
    },
    methods: {
      // 接收postMessage消息
      receivePostMessage(evt) {
        let { type, data } = evt.data;
        if (type === 'status') {
          if(data === 'ready') {
            this.gotoIframe();
          }
          if(data === 'load') {
            this.loadComplete();
            window.removeEventListener('message', this.receivePostMessage);
          }
        }
      },
      // 加载Iframe
      load() {
        this.loading = true;
        this.currentUrl = '';
        if(this.activeTransform) {
          this.transformURL();
        } else {
          this.currentUrl = this.$utilLink.processLinkParams(this.path, this.params, this.activeInitImages, this.landing, this.appId, this.appClient, this.subpage, this.bodypage, this.activeParentParams, this.superParams, this.activeSuperImages, this.activeForward, false).fullPath;
        }
      },
      // 重新加载Iframe
      reload() {
        this.load();
      },
      // 转换URL
      transformURL() {
        // 参数
        let dataParams = {
          path: this.path || this.$route.path,
          appId: this.appId,
          appClient: this.appClient,
          images: this.activeInitImages,
          superImages: this.activeSuperImages,
          landing: this.landing,
          clientType: appEnv.clientTYPE,
        };
        subSystemUrl(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            let currentTransformPath = data.subSystemUrl;
            let currentTransformImages = {
              ...this.activeInitImages,
              ...data.subSystemImages
            };
            let currentTransformSuperImages = {
              ...this.activeSuperImages,
              ...data.subSystemSuperImages
            };
            this.currentUrl = this.$utilLink.processLinkParams(currentTransformPath, this.params, currentTransformImages, this.landing, this.appId, this.appClient, this.subpage, this.bodypage, this.activeParentParams, this.superParams, currentTransformSuperImages, this.activeForward, true).fullPath;
          } else {
            this.loadComplete();
          }
        }).catch(error => {
          this.loadComplete();
          console.error(error);
        });
      },
      // 前往Iframe
      gotoIframe() {
        if(this.$app.joinAppPenetrateEnabled) {
          let ifr = this.$refs.iframeRef;
          if(ifr) {
            let ifrWin = this.$refs.iframeRef.contentWindow;
            ifrWin.postMessage({
              type: 'option',
              data: {
                style: {
                  theme: this.currentTheme,
                  size: this.currentSize
                }
              }
            }, '*');
          }
        }
      },
      // Iframe加载完成
      loadComplete() {
        this.loading = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hdty-iframe-wrapper {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 300px;
    margin: 0 auto;
    padding: 0;
    iframe {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .hdty-iframe-mask {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      @include bg_background_color_second;
      z-index: 999;
    }
  }
</style>
