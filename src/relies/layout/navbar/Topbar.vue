<template>
  <div class="hdty-topbar hdty-flex">
    <!-- 导航条 -->
    <div v-if="$parent.topnavEnabled" class="hdty-topnav hdty-flex-fill">
      <ul class="hdty-nav hdty-flex">
        <li
          v-for="(item, index) in navigations"
          v-if="activeLeftNavLimit(index)"
          class="hdty-nav-item"
          :class="{
            'is-active': activeNavIndex === index,
            'hdty-disabled': !item.hasAuthority
          }"
          :title="!item.hasAuthority ? '无访问权限' : ''"
        >
          <a
            href="javascript:;"
            class="hdty-content-middle"
            @click="handleNavItem(item, index)"
          >
            <span>
              <i :class="item.icon"></i>
              <h6>{{ item.name }}</h6>
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div class="hdty-dp-header">
      <div class="header-bg">
        <img src="../images/top.png" alt="" />
      </div>
      <div class="project-container">
        <span class="project-icon">
          <img src="../images/jh.png" alt="" />
        </span>
        <span class="project-name">{{ projectName }}</span>
      </div>

      <div class="hdty-dp-toolbar">
        <div class="hdty-toolbar hdty-flex-fit">
          <toolbar ref="toolRef"></toolbar>
        </div>
      </div>
    </div>

    <!-- 导航条 -->
    <div v-if="$parent.topnavEnabled" class="hdty-topnav hdty-flex-fill">
      <ul class="hdty-nav hdty-flex">
        <li
          v-for="(item, index) in navigations"
          v-if="activeRightNavLimit(index)"
          class="hdty-nav-item"
          :class="{
            'is-active': activeNavIndex === index,
            'hdty-disabled': !item.hasAuthority
          }"
        >
          <a
            href="javascript:;"
            class="hdty-content-middle"
            @click="handleNavItem(item, index)"
          >
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
import Toolbar from "./Toolbar.vue";
export default {
  name: "Topbar",
  components: { Toolbar },
  props: {
    value: {
      type: [Number, String],
      default: ""
    },
    navigations: [Array, Object]
  },
  data() {
    return {
      searchKey: "",
      // 项目名称
      projectName: this.$app.projectName,
      // 项目标志
      projectLogo: this.$app.projectLogo.medium,
      // 限制数量
      limit: this.$app.topnavLimit,
      // 当前时间
      currentTime: {
        year: "0000",
        month: "00",
        day: "00",
        _hour: "00",
        _minute: "00",
        _second: "00",
        _weekday: ""
      },
      // 计时器
      timer: null,

      showInput: false,
      keyword: ""
    };
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
        this.$emit("input", val);
      }
    },
    activeLeftNavLimit() {
      let navLen = this.navigations.length;
      return function (index) {
        if (this.limit) {
          if (this.limit <= navLen) {
            return index < this.limit / 2;
          } else {
            return index < navLen / 2;
          }
        } else {
          return index < navLen / 2;
        }
      };
    },
    activeRightNavLimit() {
      let navLen = this.navigations.length;
      return function (index) {
        if (this.limit) {
          if (this.limit <= navLen) {
            return index >= this.limit / 2;
          } else {
            return index >= navLen / 2;
          }
        } else {
          return index >= navLen / 2;
        }
      };
    }
  },
  created() {
    this.setSysTime();
  },
  destroyed() {
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    toggleSearch() {
      this.showInput = !this.showInput;
      if (this.showInput) {
        this.$nextTick(() => {
          // 自动聚焦
          this.$el.querySelector(".search-input").focus();
        });
      }
    },
    gotoJsc(item) {
      let routeTo = {
        name: "DpDashboard"
      };

      // 直接在当前页面跳转
      this.$router.push(routeTo);
    },
    setSysTime() {
      if (this.timer) clearTimeout(this.timer);
      this.currentTime = this.$utilDate.currentTime();
      this.timer = setTimeout(this.setSysTime, 1000);
    },
    handleNavItem(val, index) {
      this.activeNavIndex = index;
      this.$emit("currentChanged", val);
      if (!val.children) {
        let routeData = this.$router.resolve({ name: val.code });
        if (
          routeData.route.meta.viewType ===
          this.$global.dictItem.routerViewType.App
        ) {
          window.open(routeData.href, "_blank");
        } else {
          this.$router.push({ name: val.code });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-dp-header {
  width: 100%;
  height: 100%;
  .header-bg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    img {
      height: 100%;
    }
  }

  .project-container {
    position: absolute;
    padding-left: 16px;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;

    .project-icon {
      height: 54px;
      img {
        height: 100%;
        object-fit: contain;
        vertical-align: center;
      }
      margin-right: 12px;
    }

    .project-name {
      font-size: 42px;
      color: #fff;
      letter-spacing: 4px;
      font-family: "迷你简综艺";
      margin-top: 4px;
    }
  }

  .hdty-dp-toolbar {
    position: absolute;
    padding-right: 16px;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.header-search {
  position: absolute;
  right: 320px;
  top: 50%;
  transform: translateY(-50%);

  height: 34px;
  width: 388px;
  background: url("./images/search-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 9;
  ::v-deep .check-search {
    .el-input__inner {
      background-color: transparent !important;
      border: none;
      color: #fff;
    }
    .el-input-group__append {
      background-color: transparent !important;
      border: none !important;
    }
  }

  .el-input-group__append {
    background-color: transparent !important;
    border: none !important;
    color: #fff;
    .el-button {
      background-color: transparent !important;
      border: none !important;
      color: #fefefe !important;
      .icon-search {
        font-size: 14px;
        font-weight: 700;
      }
    }
    &:focus,
    &:hover {
      background-color: #2e77e5;
    }
  }
}

.header-btn-link {
  position: absolute;
  right: 210px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("./images/header-btn-bg.png");
  background-size: 100% 100%;
  color: #fff;
  cursor: pointer;
  letter-spacing: 2px;
  opacity: 0.9;
}
</style>
