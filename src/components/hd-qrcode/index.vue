<template>
  <div class="hdty-qrcode">
    <vue-qr
      :text="value"
      :size="activeSize"
      :correct-level="correctLevel"
      :margin="margin"
      :color-dark="darkColor"
      :color-light="lightColor"
      :dot-scale="dotScale"
      :auto-color="activeBackgroundOptions.autoColor"
      :white-margin="activeBackgroundOptions.whiteMargin"
      :background-color="activeBackgroundOptions.bgColor"
      :bg-src="activeBackgroundOptions.bgSrc"
      :gif-bg-src="activeBackgroundOptions.gifBgSrc"
      :background-dimming="activeBackgroundOptions.bgDimming"
      :logo-src="activeLogoOptions.logoSrc"
      :logo-scale="activeLogoOptions.logoScale"
      :logo-margin="activeLogoOptions.logoMargin"
      :logo-corner-radius="activeLogoOptions.logoCornerRadius"
      :logo-background-color="activeLogoOptions.logoBgColor"
      :binarize="activeAfterTreatmentOptions.binarize"
      :binarize-threshold="activeAfterTreatmentOptions.binarizeThreshold"
      :bind-element="activeAfterTreatmentOptions.bindElement"
      :callback="callback">
    </vue-qr>
  </div>
</template>

<script>
  import VueQr from 'vue-qr';
  export default {
    name: "index",
    provide() {
      return {
        hdQRCode: this
      };
    },
    components: {
      VueQr
    },
    props: {
      // 绑定值
      value: {
        type: [String, Number],
        default: ''
      },
      // 二维码尺寸（large / medium / small / mini）
      size: {
        type: [String, Number],
        default: 'small'
      },
      // 二维码容错率级别（0-3）
      correctLevel: {
        type: Number,
        default: 0
      },
      // 二维码外边距
      margin: {
        type: Number,
        default: 0
      },
      // 二维码实点的颜色
      darkColor: {
        type: String,
        default: '#000'
      },
      // 二维码空白区的颜色
      lightColor: {
        type: String,
        default: '#fff'
      },
      // 二维码数据区域点缩小比例(0 < scale < 1)
      dotScale: {
        type: Number,
        default: 1
      },
      // 二维码背景图像配置
      backgroundOptions: {
        type: Object,
        default() {
          return {
            // 是否使用背景图的主要颜色作为实点的颜色(设置此项时darkColor和lightColor则被忽略)
            autoColor: true,
            // 背景图周围是否绘制白色边框
            whiteMargin: false,
            // 背景色
            bgColor: '',
            // 嵌入的背景图地址
            bgSrc: '',
            // 嵌入的背景图gif地址(设置此项时bgSrc则被忽略，但会影响性能)
            gifBgSrc: '',
            // 叠加在背景图上的遮罩颜色(设置背景图解码出现问题时设置此项会有一定帮助)
            bgDimming: ''
          };
        }
      },
      // 二维码logo图像配置
      logoOptions: {
        type: Object,
        default() {
          return {
            // 嵌入至二维码中心的LOGO图地址
            logoSrc: '',
            // logo相对二维码的缩小比例
            logoScale: 0.2,
            // logo周围外边距
            logoMargin: 0,
            // logo圆角半径
            logoCornerRadius: 0,
            // logo背景色
            logoBgColor: ''
          };
        }
      },
      // 二维码后处理配置
      afterTreatmentOptions: {
        type: Object,
        default() {
          return {
            // 二维码是否二值化处理
            binarize: false,
            // 二值化处理的阈值(0 < threshold < 255)
            binarizeThreshold: 128,
            // 二维码是否自动绑定到HTML上
            bindElement: true
          };
        }
      }
    },
    data() {
      return {
        // 默认二维码背景图像配置
        defaultBackgroundOptions: {
          // 是否使用背景图的主要颜色作为实点的颜色(设置此项时darkColor和lightColor则被忽略)
          autoColor: true,
          // 背景图周围是否绘制白色边框
          whiteMargin: false,
          // 背景色
          bgColor: '',
          // 嵌入的背景图地址
          bgSrc: '',
          // 嵌入的背景图gif地址(设置此项时bgSrc则被忽略，但会影响性能)
          gifBgSrc: '',
          // 叠加在背景图上的遮罩颜色(设置背景图解码出现问题时设置此项会有一定帮助)
          bgDimming: ''
        },
        // 默认二维码logo图像配置
        defaultLogoOptions: {
          // 嵌入至二维码中心的LOGO图地址
          logoSrc: '',
          // logo相对二维码的缩小比例
          logoScale: 0.2,
          // logo周围外边距
          logoMargin: 0,
          // logo圆角半径
          logoCornerRadius: 0,
          // logo背景色
          logoBgColor: ''
        },
        // 默认二维码后处理配置
        defaultAfterTreatmentOptions: {
          // 二维码是否二值化处理
          binarize: false,
          // 二值化处理的阈值(0 < threshold < 255)
          binarizeThreshold: 128,
          // 二维码是否自动绑定到HTML上
          bindElement: true
        },
        callback: undefined
      }
    },
    computed: {
      activeSize() {
        if(this.size === 'large') {
          return 430;
        } else if(this.size === 'medium') {
          return 344;
        } else if(this.size === 'small') {
          return 258;
        } else if(this.size === 'mini') {
          return 112;
        } else {
          return this.size;
        }
      },
      activeBackgroundOptions() {
        return Object.assign(this.defaultBackgroundOptions, this.backgroundOptions);
      },
      activeLogoOptions() {
        return Object.assign(this.defaultLogoOptions, this.logoOptions);
      },
      activeAfterTreatmentOptions() {
        return Object.assign(this.defaultAfterTreatmentOptions, this.afterTreatmentOptions);
      },
    },
    created() {
      this.callback = (dataURL, qid) => {
        this.$emit('currentChanged', dataURL, qid);
      };
    }
  }
</script>

<style scoped>

</style>
