<template>
  <el-dialog title="视频播放" class="con-play" :visible.sync="visible" append-to-body>
    <div>
      <div class="player-head">
        <span>正在播放</span>
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
  name: 'VideoPlayer',
  props: {
    videoSrc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      videoLoading: false
    };
  },
  methods: {
    openVideo() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.con-play {
  ::v-deep .el-dialog {
    width: 800px;
    background: transparent;
    border: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      background-color: #1e1e1e;
      border-radius: 6px;
      .player-head {
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        color: #ffffff;
        border-bottom: solid 1px #101010;
        i {
          font-size: 20px;
          color: #b7b8b9;
          &:hover {
            color: #ffffff;
          }
        }
      }
      .player-body {
        padding: 10px;
        position: relative;
      }
    }
  }
}
</style>
