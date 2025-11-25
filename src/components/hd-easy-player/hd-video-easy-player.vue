<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="closed"
    append-to-body
    lenon
    :before-close="handleDialogBeforeClose"
    @closed="handleClose">
    <div class="hd-easy-player-box" style="height: 540px">
      <EasyPlayer
        :videoUrl="currentSourcesSrc"
        :video-title="videoTitle"
        live
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @timeupdate="handleStateChanged"
        @videoUrl="handleVideoMessage"
      ></EasyPlayer>
    </div>
  </el-dialog>
</template>

<script>
import EasyPlayer from '@easydarwin/easyplayer'

export default {
  name: "HdVideoPlayer",
  provide() {
    return {
      hdVideoPlayer: this
    };
  },
  components: {
    EasyPlayer
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 视频标识
    session: {
      type: String,
      default: ''
    },
    // 封面图片
    poster: {
      type: String,
      default: ''
    },
    // 视频URL
    sourcesSrc: {
      type: String,
      default: ''
    },
    // 会话窗口标题
    dialogTitle: {
      type: String,
      default: ''
    },
    //
    showCustomButton:{
      type: Boolean,
      default: true
    },
    // 视频标题
    videoTitle:{
      type: String,
      default: ''
    },
    // 视频流地址没有指定情况下, 视频所在区域显示的文字
    alt:{
      type: String,
      default: '无信号'
    },
    // 是否在播放 m3u8 时显示多清晰度选择
    isresolution:{
      type: Boolean,
      default: true
    },
    closeAllow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentSourcesSrc: this.sourcesSrc,
      closed: this.visible,
      snapUrl:'', // 封面
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.closed = val;
        if(val) {
          if(this.sourcesSrc && this.currentSourcesSrc !== this.sourcesSrc) {
            this.currentSourcesSrc = this.sourcesSrc;
          }
        }
      },
      immediate: true
    },
    poster: {
      handler(val) {
        if(val) {
          this.snapUrl = val;
        }
      },
      immediate: false
    },
    sourcesSrc: {
      handler(val) {
        this.currentSourcesSrc = val;
      },
      immediate: false
    },
  },
  computed: {
  },
  created() {
  },
  methods: {
    handlePlay(e) {
      console.log('handlePlay')
      this.$emit('play', this.session, e);
    },
    handlePause(e) {
      console.log('暂停')
      this.$emit('pause', this.session, e);
    },
    handleEnded(e) {
      console.log('播放结束')
      this.$emit('stop', this.session, e);
    },
    handleStateChanged(e) {
      this.$emit('change',this.session,e);
    },
    handleDialogBeforeClose(done) {
      this.$emit('beforeClose')
      // 允许直接关闭
      if(this.closeAllow){
        this.close();
      }
    },
    close(){
      this.$emit('update:visible', false);
    },
    handleClose() {
      this.$emit('update:visible', this.closed);
    },
    handleVideoMessage(e){
      console.log('handleVideoMessage',e)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .vjs-custom-skin {
  > .video-js {
    .vjs-poster {
      background-size: 100% 100%;
    }
    .vjs-big-play-button {
      border-radius: 50% !important;
      width: 2.5em !important;
      height: 2.5em !important;
      line-height: 2.5em !important;
      margin-left: -1.25em;
      margin-top: -1.25em !important;
    }
    &.vjs-waiting {
      .vjs-error-display {
        display: none !important;
      }
    }
    &.vjs-error {
      .vjs-big-play-button {
        .vjs-icon-placeholder {
          display: none;
        }
      }
    }
  }
}
</style>
