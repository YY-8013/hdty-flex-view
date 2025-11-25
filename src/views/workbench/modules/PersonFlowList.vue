<template>
  <div class="work-section">
    <div class="work-section-title">
      <span>关注人员流动明细</span>
    </div>
    <div class="work-section-btn">
      <img
        v-popover:queryPopover
        class="header-query"
        src="../images/query-more.png"
        alt
        title="更多筛选条件"
      />
    </div>

    <div class="work-section-body">
      <div class="stat-box">
        <!-- 固定列头 -->
        <div class="table-header">
          <span class="name">姓名</span>
          <span class="id">流出地</span>
          <span class="region">流入地</span>
          <span class="ldNum">流动时间</span>
        </div>
        <!-- 滚动数据 -->
        <div
          class="scroll-container"
          ref="scrollContainer"
          @mouseenter="pauseScroll"
          @mouseleave="resumeScroll"
        >
          <ul class="scroll-list" ref="scrollList">
            <li v-for="(item, index) in tableData" :key="'data-' + index">
              <span class="name" :title="item.vo.gzryXm">{{
                item.vo.gzryXm || "-"
              }}</span>
              <span class="id" :title="item.vox.lcdOrgId">{{
                item.vox.lcdOrgId || "-"
              }}</span>
              <span class="region" :title="item.vox.lrdOrgId">
                {{ item.vo.sflcbs === "1" ? "非本市" : item.vox.lrdOrgId }}
              </span>
              <span class="ldNum" :title="item.vox.ldsj">{{
                item.vox.ldsj || "-"
              }}</span>
            </li>
            <!-- 克隆一份实现无缝滚动 -->
            <li v-for="(item, index) in tableData" :key="'clone-' + index">
              <span class="name" :title="item.vo.gzryXm">{{
                item.vo.gzryXm || "-"
              }}</span>
              <span class="id" :title="item.vox.lcdOrgId">{{
                item.vox.lcdOrgId || "-"
              }}</span>
              <span class="region" :title="item.vox.lrdOrgId">
                {{ item.vo.sflcbs === "1" ? "非本市" : item.vox.lrdOrgId }}
              </span>
              <span class="ldNum" :title="item.vox.ldsj">{{
                item.vox.ldsj || "-"
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <el-popover
      v-model="queryPopoverVisible"
      ref="queryPopover"
      placement="bottom-end"
      popper-class="dp-query-popover"
      title="筛选条件"
      width="420"
      trigger="click"
    >
      <div class="query-popover-form dp-container">
        <el-form :model="queryData" ref="queryRef" :rules="queryRules" inline>
          <el-form-item label="流动时间" prop="ldsj">
            <hd-date-picker
              style="width: 310px; height: 30px"
              ref="startYearRef"
              type="datetimerange"
              v-model="queryData.ldsj"
              placeholder="请选择流动时间"
              size="mini"
            ></hd-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div class="queery-popover-footer">
        <el-button type="primary" size="mini" @click="handleQuery"
          >查询</el-button
        >
      </div>
    </el-popover>
  </div>
</template>

<script>
import { ryldData } from "./data";
import { gzryLdgjPage } from "./api";

export default {
  name: "PfldryBox",
  inject: ["WorkBenchPage"],

  data() {
    return {
      tableData: [],
      scrollTimer: null,
      step: 1,
      speed: 80,

      queryPopoverVisible: false,
      // 查询条件
      queryData: {
        ldsj: []
      },
      extendData: {},
      queryRules: {}
    };
  },
  mounted() {},
  beforeDestroy() {
    this.clearScroll();
  },
  methods: {
    initData() {
      this.loadForm();
    },
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.queryPopoverVisible = false;
          _this.WorkBenchPage.gzryLdQueryData = _this.$utilStr.deepClone(
            _this.queryData
          );
          _this.WorkBenchPage.updateGzryld();
        }
      });
    },
    async loadForm() {
      let _this = this;
      try {
        let defaultQuery = _this.WorkBenchPage.gzryLdQueryData;
        let dataParams = {
          current: 1,
          size: 30,
          ...defaultQuery
        };

        const response = await gzryLdgjPage(dataParams);
        const { success, data } = response.data;
        if (success) {
          this.tableData = data.records || [];
          this.$nextTick(() => this.startScroll());
        }
      } catch (error) {
        console.error(error);
      }
    },
    startScroll() {
      const container = this.$refs.scrollContainer;
      const list = this.$refs.scrollList;
      if (!container || !list) return;

      this.clearScroll();
      this.scrollTimer = setInterval(() => {
        container.scrollTop += this.step;
        if (container.scrollTop >= list.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }, this.speed);
    },
    pauseScroll() {
      this.clearScroll();
    },
    resumeScroll() {
      this.startScroll();
    },
    clearScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/common.scss";

.stat-box {
  height: 100%;
  width: 100%;
  background: rgba(7, 29, 74, 0.2);
  overflow: hidden;
  box-sizing: border-box;
  padding: 2px 10px 10px 10px;

  .table-header {
    display: block;
    padding: 4px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-weight: bold;
    line-height: 1;

    span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 10px;
    }

    .name {
      width: 20%;
    }
    .id {
      width: 25%;
    }
    .region {
      width: 25%;
    }
    .ldNum {
      width: 30%;
    }
  }

  .scroll-container {
    height: calc(100% - 40px);
    overflow: hidden;
    position: relative;
    margin-top: 5px;

    .scroll-list {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: block;
        padding: 10px 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 14px;
        line-height: 1;

        &:hover {
          background: rgba(52, 142, 233, 0.2);
        }

        span {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 10px;
        }

        .name {
          width: 20%;
        }
        .id {
          width: 25%;
        }
        .region {
          width: 25%;
          cursor: default;
        }
        .ldNum {
          width: 30%;
        }
      }
    }
  }
}
</style>
