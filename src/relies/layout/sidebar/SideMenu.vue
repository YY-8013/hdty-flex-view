<template>
  <el-menu
    :default-active="activeMenuKey"
    :default-openeds="currentOpeneds"
    :collapse="collapse"
    @select="handleSelect"
  >
    <side-menu-item :navigations="navigations"></side-menu-item>
  </el-menu>
</template>

<script>
import SideMenuItem from "./SideMenuItem";
export default {
  name: "SideMenu",
  props: {
    navigations: [Array, Object],
    collapse: Boolean
  },
  components: {
    SideMenuItem
  },
  data() {
    return {
      currentOpeneds: []
    };
  },
  computed: {
    activeMenuDefaultExpandFirst() {
      return this.$app.sideMenuDefaultExpandFirst;
    },
    activeMenuKey() {
      let activeMenuKey = "";
      let keyPath = [];
      (function fn(key, value, items, resultPath) {
        let checkResult = false;
        for (let index = 0; index < items.length; index++) {
          const e = items[index];
          checkResult =
            e[key] === value ||
            (e.children && fn(key, value, e.children, resultPath));
          if (checkResult) {
            resultPath.push(e.code + "");
            break;
          }
        }
        return checkResult;
      })("code", this.$route.name, this.navigations, keyPath);
      if (keyPath && keyPath.length > 0) {
        activeMenuKey = keyPath[0];
      }
      return activeMenuKey;
    }
  },
  watch: {
    navigations: {
      handler(val) {
        if (this.activeMenuDefaultExpandFirst && !this.activeMenuKey) {
          if (
            this.activeMenuDefaultExpandFirst === "*" ||
            this.navigations.length <= this.activeMenuDefaultExpandFirst
          ) {
            if (val && val.length > 0) {
              let menuFirstItem = val[0];
              if (menuFirstItem.children) {
                let menuFirstKey = menuFirstItem.code + "";
                if (!this.currentOpeneds.find((e) => e === menuFirstKey)) {
                  this.currentOpeneds.push(menuFirstKey);
                }
              }
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSelect(key) {
      let routeTo = {
        name: key
      };
      let routeResolveData = this.$router.resolve(routeTo);
      let routeMetaData =
        routeResolveData &&
        routeResolveData.route &&
        routeResolveData.route.meta;
      if (
        routeMetaData &&
        routeMetaData.viewType === this.$global.dictItem.routerViewType.App
      ) {
        window.open(routeResolveData.href, "_blank");
      } else {
        this.$router.push(routeTo);
      }
    }
  }
};
</script>

<style scoped></style>
