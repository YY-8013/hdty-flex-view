<template>
  <div class="work-section">
    <div class="work-section-title">常用功能</div>
    <div class="work-section-btn">
      <el-button type="text" @click="toSetMenu">
        <i class="el-icon-s-tools"></i>
      </el-button>
    </div>
    <div class="work-section-body">
      <el-row :gutter="10">
        <el-col
          v-for="(item, index) in menuList"
          :key="index"
          :xs="12"
          :sm="6"
          class="func-item"
        >
          <div @click="handleSelect(item)">
            <div class="func-icon">
              <i :class="['el-icon', item.vo.icon]"></i>
            </div>
            <div class="func-title">{{ item.vox.menuId || item.vo.url }}</div>
          </div>
        </el-col>
      </el-row>
      <menu-select ref="menuSelectRef" @update-list="loadCommonList" />
    </div>
  </div>
</template>

<script>
import { menuUserUseList, getCommonMenu } from "./api";
import MenuSelect from "./MenuSelect.vue";
export default {
  name: "CommonFunc",
  components: { MenuSelect },
  data() {
    return {
      maxSelect: 8,
      favList: [],
      commonMenuList: [],
      menuList: []
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList() {
      this.loadCommonList();
      this.fetchCyList();
    },
    // 设置常用应用
    toSetMenu() {
      this.$refs.menuSelectRef.visible = true;
      this.$refs.menuSelectRef.beforeLoadForm();
    },
    updateMenuList() {
      // 合并数组并根据 vo.url  去重，然后取前8个
      const combinedArray = this.commonMenuList.concat(this.favList);
      const uniqueMap = new Map();

      this.menuList = combinedArray
        .filter((item) => {
          if (!item || !item.vo || !item.vo.url) return false;

          if (!uniqueMap.has(item.vo.url)) {
            uniqueMap.set(item.vo.url, true);
            return true;
          }
          return false;
        })
        .slice(0, 8);
    },
    // 获取已配置常用菜单
    loadCommonList() {
      const dataParams = {
        ...this.queryData,
        current: 1,
        size: this.maxSelect
      };
      getCommonMenu(dataParams)
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            this.commonMenuList = data.records || [];
          }
        })
        .catch(console.error)
        .finally(() => {
          this.updateMenuList();
        });
    },
    fetchCyList() {
      let dataParams = {
        current: 1,
        size: this.maxSelect
      };
      menuUserUseList(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            this.favList = data.records || [];
          }
        })
        .finally(() => {
          this.updateMenuList();
        });
    },
    handleSelect(item) {
      console.log("item", item);

      let routeTo = {
        name: item.vo.url
      };
      let routeResolveData = this.$router.resolve(routeTo);
      console.log("routeResolveData", routeResolveData);

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

<style lang="scss" scoped>
@import "../css/common.scss";

.func-item {
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    // transform: translateY(-3px);

    .func-icon {
      background: rgba(64, 158, 255, 0.8);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
      transform: scale(1.1);
    }

    .func-title {
      color: #18c1ff;
    }
  }
}

.func-icon {
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 0 auto 6px;
  background: rgba(115, 181, 238, 0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
}

.func-title {
  font-size: 12px;
  color: #fff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
