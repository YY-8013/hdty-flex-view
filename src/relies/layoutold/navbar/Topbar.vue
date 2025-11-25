<template>
  <div class="hdty-topbar hdty-flex">
    <!-- 导航条 -->
    <div
      v-if="$parent.topnavEnabled"
      class="hdty-topnav hdty-flex-fill">
      <ul class="hdty-nav hdty-flex">
        <li
          v-for="(item, index) in navigations"
          v-if="activeLeftNavLimit(index)"
          class="hdty-nav-item"
          :class="{ 'is-active':activeNavIndex === index, 'hdty-disabled': !item.hasAuthority }"
          :title="!item.hasAuthority ? '无访问权限' : ''">
          <a
            href="javascript:;"
            class="hdty-content-middle"
            @click="handleNavItem(item, index)">
            <span>
              <i :class="item.icon"></i>
              <h6>{{ item.name }}</h6>
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div class="hdty-logo-wrapper hdty-flex-fit">
      <div class="hdty-logo">
        <a href="javascript:;">
          <img :src="projectLogo">
          <span>{{ projectName }}</span>
          <h6 class="hdty-center">
            {{ currentTime.year }}年{{ currentTime.month }}月{{ currentTime.day }}日
            &ensp;{{ currentTime._hour }}:{{ currentTime._minute }}:{{ currentTime._second }}
            &ensp;{{ currentTime._weekday }}
          </h6>
        </a>
      </div>
    </div>
    <!-- 导航条 -->
    <div
      v-if="$parent.topnavEnabled"
      class="hdty-topnav hdty-flex-fill">
      <ul class="hdty-nav hdty-flex">
        <li
          v-for="(item, index) in navigations"
          v-if="activeRightNavLimit(index)"
          class="hdty-nav-item"
          :class="{ 'is-active': activeNavIndex === index, 'hdty-disabled': !item.hasAuthority }">
          <a
            href="javascript:;"
            class="hdty-content-middle"
            @click="handleNavItem(item, index)">
            <span>
              <i :class="item.icon"></i>
              <h6>{{ item.name }}</h6>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Topbar",
    props: {
      value: {
        type: [Number, String],
        default: ''
      },
      navigations: [Array, Object]
    },
    data() {
      return {
        // 项目名称
        projectName: this.$app.projectName,
        // 项目标志
        projectLogo: this.$app.projectLogo.medium,
        // 限制数量
        limit: this.$app.topnavLimit,
        // 当前时间
        currentTime: {
          year: '0000',
          month: '00',
          day: '00',
          _hour: '00',
          _minute: '00',
          _second: '00',
          _weekday: '',
        },
        // 计时器
        timer: null
      }
    },
    computed: {
      activeNavIndex: {
        get() {
          if (!this.$utilStr.isEmpty(this.value)) {
            return Number(this.value);
          }
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      activeLeftNavLimit() {
        let navLen = this.navigations.length;
        return function(index) {
          if(this.limit) {
            if(this.limit <= navLen) {
              return index < this.limit / 2;
            }else {
              return index < navLen / 2;
            }
          }else {
            return index < navLen / 2;
          }
        }
      },
      activeRightNavLimit() {
        let navLen = this.navigations.length;
        return function(index) {
          if(this.limit) {
            if(this.limit <= navLen) {
              return index >= this.limit / 2;
            }else {
              return index >= navLen / 2;
            }
          }else {
            return index >= navLen / 2;
          }
        }
      }
    },
    created() {
      this.setSysTime();
    },
    destroyed() {
      if(this.timer) clearTimeout(this.timer);
    },
    methods: {
      setSysTime() {
        if(this.timer) clearTimeout(this.timer);
        this.currentTime = this.$utilDate.currentTime();
        this.timer = setTimeout(this.setSysTime, 1000);
      },
      handleNavItem(val, index) {
        this.activeNavIndex = index;
        this.$emit('currentChanged', val);
        if(!val.children) {
          let routeData = this.$router.resolve({ name: val.code });
          if(routeData.route.meta.viewType === this.$global.dictItem.routerViewType.App) {
            window.open(routeData.href, '_blank');
          }else {
            this.$router.push({ name: val.code });
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
