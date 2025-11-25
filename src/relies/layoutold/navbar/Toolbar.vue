<template>
  <div>
    <ul class="hdty-nav">
      <li class="hdty-nav-item">
        <a href="javascript:;" title="切换全屏" @click="toggleFullscreen">
          <i class="hdty-fullscreen-icon icon-fullscreen" :class="{ 'is-reverse': fullscreen }"></i>
        </a>
      </li>
      <li class="hdty-nav-item">
        <a href="javascript:;" title="主题风格" @click="$parent.handleMyTheme">
          <i class="icon-color"></i>
        </a>
      </li>
      <li class="hdty-nav-item">
        <a href="javascript:;" title="系统设置" @click="$parent.handleMySet">
          <i class="icon-setting"></i>
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
      <li class="hdty-nav-item">
        <a href="javascript:;">
          <el-dropdown size="default" @command="handleMyCommand">
            <div>
              <hd-avatar :avatar="$utilLogin.getUserAvatar()"></hd-avatar>
              <span>{{ user.xm ? user.xm : user.username }}</span>
              <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="center">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </a>
      </li>
      <li class="hdty-nav-item">
        <a href="javascript:;" title="退出登录" @click="$parent.handleLogout">
          <i class="icon-switch"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getUnreadAllCount } from '@/api/msg';
  import Fullscreen from 'screenfull';

  export default {
    name: "ToolBar",
    props: {
      badge: String
    },
    data() {
      return {
        // 登录用户
        user: this.$utilLogin.getUserInfo(),
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
      },
      // 下拉菜单
      handleMyCommand(command) {
        if (command === 'center') {
          this.$parent.handleMyCenter();
        } else if (command === 'password') {
          this.$parent.handleChangePwd();
        } else if (command === 'logout') {
          this.$parent.handleLogout();
        }
      }
    }
  }
</script>

<style scoped>

</style>
