<template>
  <div
    class="hdty-percent"
    :style="activeWrapperStyle">
    <svg :style="{transform: 'rotate('+rotate+'deg)'}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle
        r="37%"
        cy="50%"
        cx="50%"
        :stroke-width="radius"
        :stroke="backgroundColor"
        fill="none"
      />
      <circle
        ref="$bar"
        r="37%"
        cy="50%"
        cx="50%"
        :stroke="barColor"
        :stroke-width="radius"
        :stroke-linecap="isRound ? 'round' : 'square'"
        :stroke-dasharray="(circleWidth - radius)*3.14"
        :stroke-dashoffset="isAnimation ? (circleWidth - radius) * 3.14 : (circleWidth - radius) * 3.14 * (100 - progress) / 100"
        fill="none"
      />
    </svg>
    <cite>{{ progress }}%</cite>
  </div>
</template>

<script>
  export default {
    props: {
      // 进度条厚度
      radius: {
        type: [Number, String],
        default: 8
      },
      // 进度条百分比
      progress: {
        type: [Number, String],
        default: 0
      },
      // 进度条颜色
      barColor: {
        type: String,
        default: '#ffa500'
      },
      // 背景颜色
      backgroundColor: {
        type: String,
        default: 'none'
      },
      // 是否是动画效果
      isAnimation: {
        type: Boolean,
        default: true,
      },
      // 是否是圆形画笔
      isRound: {
        type: Boolean,
        default: true,
      },
      // 组件的id，多组件共存时使用
      id: {
        type: [String, Number],
        default() {
          return this.$utilStr.uuid();
        }
      },
      // 整个动画时长
      duration: {
        type: [String, Number],
        default: 1000,
      },
      // 延迟多久执行
      delay: {
        type: [String, Number],
        default: 200,
      },
      // 动画缓动函数
      timeFunction: {
        type: String,
        default: 'cubic-bezier(0.99, 0.01, 0.22, 0.94)',
      },
      // 旋转起点角度
      rotate: {
        type: Number,
        default: 270
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
      },
    },
    computed: {
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      id: {
        handler(val) {
          this.idStr = `circle_progress_keyframes_${this.id}`;
        },
        immediate: true
      },
      progress: {
        handler() {
          this.init();
        },
        immediate: false
      }
    },
    data() {
      return {
        idStr: `circle_progress_keyframes_${this.id}`,
        circleWidth: [Number, String], // 圆的大小
      }
    },
    beforeDestroy() {
      // 清除旧组件的样式标签
      document.getElementById(this.idStr) && document.getElementById(this.idStr).remove();
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        let offsetWidth = this.$el.offsetWidth;
        this.circleWidth = offsetWidth / 100 * 80;
        if (this.isAnimation) {
          // 重复定义判断
          if (document.getElementById(this.idStr)) {
            console.warn('vue-circle-progress should not have same id style');
            document.getElementById(this.idStr).remove();
          }
          // 生成动画样式文件
          let style = document.createElement('style');
          style.id = this.idStr;
          style.type = 'text/css';
          style.innerHTML = `
              @keyframes circle_progress_keyframes_name_${this.id} {
              from {stroke-dashoffset: ${(this.circleWidth - this.radius) * 3.14}px;}
              to {stroke-dashoffset: ${(this.circleWidth - this.radius) * 3.14 * (100 - this.progress) / 100}px;}}
              .circle_progress_bar${this.id} {animation: circle_progress_keyframes_name_${this.id} ${this.duration}ms ${this.delay}ms ${this.timeFunction} forwards;}`;

          // 添加新样式文件
          document.getElementsByTagName('head')[0].appendChild(style);

          // 往svg元素中添加动画class
          this.$refs.$bar.classList.add(`circle_progress_bar${this.id}`);
        }
      }
    }
  }
</script>

<style scoped>
  .hdty-percent {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
  cite {
    position: absolute;
    top: 50%;
    left: 50%;
    font-family: "DIN-Bold", sans-serif;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
