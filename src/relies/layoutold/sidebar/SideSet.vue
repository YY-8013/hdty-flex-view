<template>
  <div class="hdty-side hdty-side-set" :visible="visible">
    <div class="hdty-card-header">
      <div class="hdty-card-title">
        系统设置
      </div>
    </div>
    <div class="hdty-card-body hdty-scroll">
      <div class="hdty-fluid">
        <div class="hdty-row hdty-col-space16">
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">布局大小</div>
            <el-radio-group
              v-model="activeSize"
              @change="toggleSize">
              <el-radio-button label="medium">大</el-radio-button>
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="small">小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">布局方式</div>
            <el-radio-group
              v-model="activeScheme"
              @change="toggleScheme">
              <el-radio-button label="leftandright">左右布局</el-radio-button>
              <el-radio-button label="upanddown">上下布局</el-radio-button>
            </el-radio-group>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">顶部导航</div>
            <el-switch
              v-model="enabledTopnav"
              :width="50"
              @change="toggleEnableTopnav">
            </el-switch>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">页面选项卡</div>
            <el-switch
              v-model="enabledPagetab"
              :width="50"
              @change="toggleEnablePagetab">
            </el-switch>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">消息提示</div>
            <el-switch
              v-model="enabledNotify"
              :width="50"
              @change="toggleEnableNotify">
            </el-switch>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">消息提示音</div>
            <el-switch
              v-model="enabledBeep"
              :width="50"
              @change="toggleEnableBeep">
            </el-switch>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">消息提示位置</div>
            <el-radio-group
              v-model="activePosition"
              tight
              @change="togglePosition">
              <el-radio-button label="bottomRight">右下</el-radio-button>
              <el-radio-button label="bottomLeft">左下</el-radio-button>
              <el-radio-button label="topRight">右上</el-radio-button>
              <el-radio-button label="topLeft">左上</el-radio-button>
              <el-radio-button label="topCenter">顶部</el-radio-button>
              <el-radio-button label="bottomCenter">底部</el-radio-button>
            </el-radio-group>
          </div>
          <div class="hdty-col-md12">
            <div class="hdty-title hdty-title-plain">消息未读标记</div>
            <el-radio-group
              v-model="activeBadge"
              @change="toggleBadge">
              <el-radio-button label="dot">圆点</el-radio-button>
              <el-radio-button label="number">数字</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SideSet",
    data() {
      return {
        // 显示side
        visible: false,
        activeSize: this.$store.state.app.size || this.$app.sizeDefault,
        activeScheme: this.$store.state.app.scheme || this.$app.schemeDefault,
        enabledTopnav: !this.$utilStr.isEmpty(this.$store.state.app.topnav)
                        ? this.$store.state.app.topnav
                        : this.$app.topnavEnabled,
        enabledPagetab: !this.$utilStr.isEmpty(this.$store.state.app.pagetab)
          ? this.$store.state.app.pagetab
          : this.$app.pagetabEnabled,
        enabledNotify: !this.$utilStr.isEmpty(this.$store.state.app.notify)
                        ? this.$store.state.app.notify
                        : this.$app.notifyEnabled,
        enabledBeep: !this.$utilStr.isEmpty(this.$store.state.app.beep)
          ? this.$store.state.app.beep
          : this.$app.notifyBeepEnabled,
        activePosition: this.$store.state.app.position || this.$app.notifyPosition,
        activeBadge: this.$store.state.app.badge || this.$app.notifyUnreadBadge
      }
    },
    watch: {
      visible: {
        handler(val) {
          if(val) {
            this.createMask();
          }else {
            this.removeMask();
          }
        },
        immediate: false
      }
    },
    methods: {
      // 切换布局大小
      toggleSize(val){
        this.$ELEMENT.size = val;
        document.body.setAttribute('layout-size', val);
        this.$storage.local.set('hdty-admin-size', val);
        this.$store.dispatch('editSize', val);
        this.$store.dispatch('delAllCachedComponents');
        this.$store.dispatch('delAllCachedViews');
        this.$nextTick(() => {
          this.$router.replace({ path: '/redirect' + this.$route.fullPath });
        });
      },
      // 切换布局方式
      toggleScheme(val) {
        document.body.setAttribute('layout-scheme', val);
        this.$storage.local.set('hdty-admin-scheme', val);
        this.$store.dispatch('editScheme', val);
      },
      // 切换顶部导航开启状态
      toggleEnableTopnav(val) {
        this.$storage.local.set('hdty-admin-topnav', val);
        this.$store.dispatch('editTopnav', val);
        this.$nextTick(() => {
          if(val) {
            if (!this.$utilStr.isEmpty(this.$parent.currentTopnavIndex)) {
              this.$parent.currentRootnav = this.$parent.realNavigations[this.$parent.currentTopnavIndex];
              this.$parent.currentSubnavs = this.$parent.realNavigations[this.$parent.currentTopnavIndex].children || [];
            } else {
              this.$parent.currentSubnavs = [];
            }
          }else {
            this.$parent.currentSubnavs = this.$parent.realNavigations;
          }
        });
      },
      // 切换页面选项卡开启状态
      toggleEnablePagetab(val) {
        this.$storage.local.set('hdty-admin-pagetab', val);
        this.$store.dispatch('editPagetab', val);
      },
      // 切换消息通知提示开启状态
      toggleEnableNotify(val) {
        this.$storage.local.set('hdty-admin-notify', val);
        this.$store.dispatch('editNotify', val);
      },
      // 切换消息通知提示音开启状态
      toggleEnableBeep(val) {
        this.$storage.local.set('hdty-admin-beep', val);
        this.$store.dispatch('editBeep', val);
      },
      // 切换消息通知提示位置
      togglePosition(val) {
        this.$storage.local.set('hdty-admin-position', val);
        this.$store.dispatch('editPosition', val);
      },
      // 切换未读标记效果
      toggleBadge(val) {
        this.$storage.local.set('hdty-admin-badge', val);
        this.$store.dispatch('editBadge', val);
      },
      // 点击遮罩
      handleMask() {
        this.visible = false;
        this.$parent.openset = false;
      },
      // 移除遮罩
      removeMask() {
        let element = document.querySelector('#hd-mask');
        element.remove();
      },
      // 创建遮罩
      createMask() {
        let element = document.createElement('div');
        element.setAttribute('id', 'hd-mask');
        element.setAttribute('class', 'hdty-mask');
        element.onclick = this.handleMask;
        document.body.appendChild(element);
      }
    }
  }
</script>

<style scoped>

</style>
