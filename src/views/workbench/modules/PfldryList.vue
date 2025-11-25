<template>
  <div class="work-section">
    <div class="work-section-title">频繁流动人员</div>
    <div class="work-section-body">
      <div class="stat-box">
        <!-- 固定列头 -->
        <div class="table-header">
          <span class="name">姓名</span>
          <span class="id">身份证号</span>
          <span class="region">所在辖区</span>
          <span class="ldNum">流动次数</span>
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
              <span class="name" :title="item.name">{{
                item.name || "-"
              }}</span>
              <span class="id" :title="item.gmsfhm">{{
                item.gmsfhm || "-"
              }}</span>
              <span class="region" :title="item.orgName">{{
                item.orgName || "-"
              }}</span>
              <span
                :class="[
                  'ldNum',
                  {
                    'ldNum-1': item.rank === 1,
                    'ldNum-2': item.rank === 2,
                    'ldNum-3': item.rank === 3
                  }
                ]"
                :title="item.ldNum"
                >{{ item.ldNum || "-" }}</span
              >
            </li>
            <!-- 克隆一份实现无缝滚动 -->
            <li v-for="(item, index) in tableData" :key="'clone-' + index">
              <span class="name" :title="item.name">{{
                item.name || "-"
              }}</span>
              <span class="id" :title="item.gmsfhm">{{
                item.gmsfhm || "-"
              }}</span>
              <span class="region" :title="item.orgName">{{
                item.orgName || "-"
              }}</span>
              <span
                :class="[
                  'ldNum',
                  { 'ldNum-1': item.rank === 1, 'ldNum-2': item.rank === 2 }
                ]"
                :title="item.ldNum"
                >{{ item.ldNum || "-" }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gzryListPfldry } from "./api";

export default {
  name: "PfldryBox",
  inject: ["WorkBenchPage"],

  data() {
    return {
      tableData: [],
      scrollTimer: null,
      step: 1,
      speed: 80
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
    async loadForm() {
      let _this = this;
      try {
        let defaultQuery = _this.WorkBenchPage.gzryLdQueryData;

        const dataParams = {
          size: 1000,
          pfldLimit: 1,
          ...defaultQuery,
          ldsjList: defaultQuery.ldsj || []
        };
        const response = await gzryListPfldry(dataParams);
        const { success, data } = response.data;
        if (success) {
          let num = [];
          this.tableData = data.records || [];

          // 首先按 ldNum 从大到小排序
          this.tableData.sort((a, b) => b.ldNum - a.ldNum);

          // 添加排名
          let rank = 1;
          this.tableData.forEach((item, index) => {
            // 如果是第一个元素，直接赋值为1
            if (index === 0) {
              item.rank = rank;
              return;
            }

            // 如果当前项与上一项的值不同，排名+1
            if (item.ldNum !== this.tableData[index - 1].ldNum) {
              rank++;
            }

            item.rank = rank;
          });

          console.log("tableData", this.tableData);

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
      width: 15%;
    }
    .id {
      width: 30%;
    }
    .region {
      width: 40%;
    }
    .ldNum {
      width: 15%;
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
          width: 15%;
        }
        .id {
          width: 30%;
        }
        .region {
          width: 40%;
          cursor: default;
        }
        .ldNum {
          width: 15%;
          font-weight: bold;

          &-1 {
            color: #ff6666;
          }

          &-2 {
            color: #ff6f18;
          }

          &-3 {
            color: #ffcc66;
          }
        }
      }
    }
  }
}
</style>
