<template>
  <el-dialog title="视频播放" class="con-play" :visible.sync="visible" append-to-body>
    <div>
      <div class="player-head">
        <span>正在播放：{{ fileTitle }}</span>
        <span>
          <a href="javascript:;" @click="handleClose">
            <i class="el-icon-close"></i>
          </a>
        </span>
      </div>
      <div class="player-body">
        <hd-pane v-loading="videoLoading" element-loading-text="视频加载中..." fit>
          <video ref="videoPlayer" :src="videoSrc" autoplay controls style="width: 100%"></video>
        </hd-pane>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaspPlayVideo',
  props: {
    visible: Boolean,
    videoSrc: String,
    fileTitle: {
      type: String,
      default: '未命名视频'
    }
  },
  data() {
    return {
      videoLoading: false
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$nextTick(() => {
          this.resetVideo();
        });
      }
    }
  },
  methods: {
    resetVideo() {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
        this.$refs.videoPlayer.load();
      }
    },
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.con-play {
  ::v-deep .el-dialog {
    width: 1200px;
    background: transparent;
    border: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      background-color: #1e1e1e;
      border: solid 1px #101010;
      border-radius: 6px;
      .player-head {
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        color: #ffffff;
        border-bottom: solid 1px #101010;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        i {
          font-size: 20px;
          margin-top: 6px;
          color: #b7b8b9;
          &:hover {
            color: #ffffff;
          }
        }
      }
      .player-body {
        padding: 0 2px;
        box-sizing: border-box;
        position: relative;
      }
    }
  }
}
</style>

<style lang="scss">
.player-body {
  .el-loading-mask {
    background-color: #000 !important;
  }
}
</style>
