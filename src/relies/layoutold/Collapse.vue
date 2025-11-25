<template>
  <div
    class="hdty-nav hdty-collapse"
    :expanded="expanded">
    <li v-if="direction==='left'" class="hdty-nav-item hdty-collapse-caret">
      <a href="javascript:;" title="展开更多" @click="handleOpen">
        <i class="hdty-collapse-icon el-icon-caret-left"></i>
      </a>
    </li>
    <li class="hdty-nav-item">
      <a href="javascript:;" title="消息中心" @click="$parent.handleMyMessage">
        <div
          v-if="badge === 'dot'"
          class="hdty-notify"
          :class="unread>0?'':'is-hide'">
          <i class="icon-chat-square"></i>
          <span class="hdty-heartbit"></span>
          <span class="hdty-point"></span>
        </div>
        <el-badge
          v-else-if="badge === 'number'"
          :value="unread"
          :max="99"
          :class="unread>0?'':'is-hide'">
          <i class="icon-chat-square"></i>
        </el-badge>
      </a>
    </li>
    <li v-if="direction==='right'" class="hdty-nav-item hdty-collapse-caret">
      <a href="javascript:;" title="展开更多" @click="handleOpen">
        <i class="hdty-collapse-icon el-icon-caret-left"></i>
      </a>
    </li>
    <li class="hdty-nav-item">
      <a href="javascript:;" title="系统设置" @click="$parent.handleMySet">
        <i class="icon-setting"></i>
      </a>
    </li>
    <li class="hdty-nav-item">
      <a href="javascript:;" title="主题风格" @click="$parent.handleMyTheme">
        <i class="icon-color"></i>
      </a>
    </li>
    <li class="hdty-nav-item">
      <a href="javascript:;" title="切换全屏" @click="toggleFullscreen">
        <i class="hdty-fullscreen-icon icon-fullscreen" :class="{ 'is-reverse': fullscreen }"></i>
      </a>
    </li>
  </div>
</template>

<script>
  import { getUnreadAllCount } from '@/api/msg';
  import Fullscreen from 'screenfull';

  export default {
    name: "Collapse",
    props: {
      // 通知标记
      badge: String,
      // 展开方向(left / right)
      direction: {
        type: String,
        default: 'left'
      }
    },
    data() {
      return {
        // 展开状态
        expanded: false,
        // 未读消息
        unread: 0,
        // 全屏状态
        fullscreen: false
      }
    },
    components: {
      Fullscreen
    },
    created() {
      // 设置未读消息
      this.setMsgUnread();
      Fullscreen.on('change', () => {
        this.fullscreen = Fullscreen.isFullscreen;
      });
    },
    methods: {
      // 设置未读消息
      setMsgUnread() {
        let _this = this;
        // Lambda写法
        getUnreadAllCount().then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.unread = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      handleOpen() {
        this.expanded = !this.expanded;
      },
      // 切换全屏
      toggleFullscreen() {
        if(Fullscreen.enabled) {
          Fullscreen.toggle();
        }else {
          this.$message({
            showClose: true,
            message: '您的浏览器暂不支持全屏',
            type: 'warning',
            offset: 76
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
