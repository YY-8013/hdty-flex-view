<template>
  <div
    class="hdty-video"
    :class="!activeWrapperStyle.height && 'hdty-video-rectangle'"
    :style="activeWrapperStyle">
    <div class="hdty-video-panel">
      <div v-if="connecting" class="hdty-video-tips hdty-video-empty">
        <i :class="emptyIcon">
        </i>
        <span v-if="emptyText">{{ emptyText }}</span>
      </div>
      <div v-else class="hdty-video-wrapper">
        <div v-if="loading" class="hdty-video-tips hdty-video-poster-empty">
          <i :class="posterEmptyIcon">
          </i>
          <span v-if="posterEmptyText">{{ posterEmptyText }}</span>
        </div>
        <div v-else-if="error" class="hdty-video-tips hdty-video-poster-error">
          <i :class="posterErrorIcon">
          </i>
          <span v-if="posterErrorText">{{ posterErrorText }}</span>
        </div>
        <div class="hdty-video-body">
          <img v-if="!error" :src="poster" class="hdty-video-poster">
          <div class="hdty-video-play-btn" @click="handleClick"></div>
        </div>
        <div class="hdty-video-footer">
          <p v-if="title" class="hdty-elip" :title="title">{{ title }}</p>
          <p v-if="subtitle" class="hdty-elip" :title="subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    provide() {
      return {
        hdVideo: this
      };
    },
    props: {
      // 连接标识
      session: {
        type: String,
        default: ''
      },
      // 封面图片
      poster: {
        type: String,
        default: ''
      },
      // 标题文本
      title: {
        type: String,
        default: ''
      },
      // 副标题文本
      subtitle: {
        type: String,
        default: ''
      },
      // 鼠标移入元素显示提示文本
      tooltipText: {
        type: String,
        default: '点击播放视频'
      },
      // 空连接时显示图标
      emptyIcon: {
        type: String,
        default: 'icon-video-player'
      },
      // 空连接时显示文本
      emptyText: {
        type: String,
        default: '视频正在连接...'
      },
      // 空封面时显示图标
      posterEmptyIcon: {
        type: String,
        default: 'icon-video-player'
      },
      // 空封面时显示文本
      posterEmptyText: {
        type: String,
        default: '封面正在加载...'
      },
      // 封面错误时显示图标
      posterErrorIcon: {
        type: String,
        default: 'icon-video-player'
      },
      // 封面错误时显示文本
      posterErrorText: {
        type: String,
        default: '封面加载错误'
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
        connecting: true,
        loading: false,
        error: false
      }
    },
    watch: {
      session: {
        handler(val) {
          if(val) {
            this.connecting = false;
          } else {
            this.connecting = true;
            this.loading = false;
            this.error = false;
          }
        },
        immediate: true
      },
      poster: {
        handler(val) {
          if(val) {
            this.loadImage();
          } else {
            this.loading = true;
            this.error = false;
          }
        },
        immediate: true
      }
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
    methods: {
      loadImage() {
        this.loading = true;
        this.error = false;
        const img = new Image();
        img.onload = this.handleLoad;
        img.onerror = this.handleError.bind(this);
        img.src = this.poster;
      },
      handleLoad() {
        this.loading = false;
      },
      handleError(e) {
        this.loading = false;
        this.error = true;
        this.$emit('error', e);
      },
      handleClick(e) {
        this.$emit('play', this.session, e);
      }
    }
  }
</script>

<style scoped>

</style>
