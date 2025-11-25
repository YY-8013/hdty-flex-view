<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="closed"
    append-to-body
    lenon
    :before-close="handleDialogBeforeClose"
    @closed="handleClose">
    <video-player
      ref="videoPlayerRef"
      class="video-player vjs-custom-skin"
      :playsinline="playsinline"
      :options="playerOptions"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @waiting="handleWaiting"
      @playing="handlePlaying"
      @statechanged="handleStateChanged"
      @ready="handleReady">
    </video-player>
  </el-dialog>
</template>

<script>
  import { videojs, videoPlayer } from 'vue-video-player';
  import 'videojs-contrib-hls';
  import 'video.js/dist/video-js.css';
  import 'vue-video-player/src/custom-theme.css';
  window.videojs = videojs;
  require('video.js/dist/lang/zh-CN.js');
  export default {
    name: "HdVideoPlayer",
    provide() {
      return {
        hdVideoPlayer: this
      };
    },
    components: {
      videoPlayer
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
      // 视频类型（m3u8 / mp4）
      sourcesType: {
        type: String,
        default: 'm3u8'
      },
      // 会话窗口标题
      dialogTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放倍速
          autoplay: true, // 是否自动播放，默认false，如果true，浏览器准备好时开始回放
          controls: true, // 是否拥有控制条，默认true
          preload: 'auto', // 视频预加载
          muted: false, // 是否静音，默认false，将会消除任何音频
          loop: false, // 是否循环播放，视频播放结束后就重新开始
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器
          sources: [{
            type: '', // 视频类型
            src: '' //视频URL（必填）
          }],
          poster: this.poster, // 封面地址，播放前显示的视频画面
          // width: document.documentElement.clientWidth, // 视频容器的宽度, 字符串或数字，单位像素
          // height: document.documentElement.clientHeight, // 视频容器的高度，字符串或数字，单位像素，比如： height:300 or height:'300px'
          notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息
        },
        currentSourcesSrc: this.sourcesSrc,
        acceptSourcesType: {
          'm3u8': 'application/x-mpegURL',
          'mp4': 'video/mp4'
        },
        defaultSourcesSrc: {
          'm3u8': process.env.NODE_PATH + '/static/public/media/video/video.m3u8',
          'mp4': process.env.NODE_PATH + '/static/public/media/video/video.webm'
        },
        defaultControlBar: {
          'm3u8': {
            currentTimeDisplay: true, // 显示当前时间
            durationDisplay: false, // 显示持续时间
            timeDivider: true, // 显示当前时间和持续时间的分隔符
            fullscreenToggle: true, // 显示全屏按钮
            liveDisplay: true, // 显示直播
            playbackRateMenuButton: false, // 显示播放倍速按钮
            remainingTimeDisplay: false, // 显示剩余时间
            progressControl: true, // 显示进度条
            playToggle: true // 显示暂停和播放键
          },
          'mp4': {
            currentTimeDisplay: true, // 显示当前时间
            durationDisplay: true, // 显示持续时间
            timeDivider: true, // 显示当前时间和持续时间的分隔符
            fullscreenToggle: true, // 显示全屏按钮
            liveDisplay: false, // 显示直播图标
            playbackRateMenuButton: true, // 显示播放倍速按钮
            remainingTimeDisplay: false, // 显示剩余时间
            progressControl: true, // 显示进度条
            playToggle: true // 显示暂停和播放键
          }
        },
        closed: this.visible
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
        immediate: false
      },
      poster: {
        handler(val) {
          if(val) {
            this.$set(this.playerOptions, 'poster', val);
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
      currentSourcesSrc: {
        handler(val) {
          this.playerOptions.sources[0].src = val;
        },
        immediate: false
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayerRef.player;
      },
      playsinline() {
        let ua = navigator.userAgent.toLocaleLowerCase();
        return !(ua.match(/tencenttraveler/) !== null || ua.match(/qqbrowse/) !== null);
      },
      activeSourcesType() {
        return this.acceptSourcesType[this.sourcesType];
      },
      activeSourcesSrc() {
        return this.defaultSourcesSrc[this.sourcesType];
      },
      activeControlBar() {
        return this.defaultControlBar[this.sourcesType];
      }
    },
    created() {
      this.playerOptions.sources[0].type = this.activeSourcesType;
      this.playerOptions.sources[0].src = this.activeSourcesSrc;
      this.playerOptions.controlBar = this.activeControlBar;
    },
    methods: {
      handlePlay(e) {
        this.$emit('play', this.session, e);
      },
      handlePause(e) {
        this.$emit('pause', this.session, e);
      },
      handleEnded(e) {
        this.$emit('stop', this.session, e);
      },
      handleWaiting(e) {
        this.$emit('waiting', this.session, e);
      },
      handlePlaying(e) {
        this.$emit('playing', this.session, e);
      },
      handleStateChanged(e) {
        if(this.playerOptions.sources[0].src !== this.activeSourcesSrc) {
          this.$emit('change', this.session, e);
        } else {
          this.player.el_.classList.remove('vjs-paused', 'vjs-error', 'vjs-controls-disabled');
          this.player.el_.classList.add('vjs-controls-enabled', 'vjs-playing', 'vjs-has-started', 'vjs-waiting');
        }
      },
      handleReady(e) {
        if(this.playerOptions.sources[0].src !== this.activeSourcesSrc) {
          this.$emit('ready', this.session, e);
        }
      },
      handleDialogBeforeClose(done) {
        if(this.playerOptions.sources[0].src !== this.activeSourcesSrc) {
          this.$emit('stop', this.session);
          this.currentSourcesSrc = this.activeSourcesSrc;
          done();
        } else {
          this.$confirm('视频正在拼命加载，确定不再稍候一会了吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '稍候',
            type: 'warning',
          }).then(() => {
            this.$emit('stop', this.session);
            this.currentSourcesSrc = this.activeSourcesSrc;
            done();
          }).catch(() => {});
        }
      },
      handleClose() {
        this.$emit('update:visible', this.closed);
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
