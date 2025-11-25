<template>
  <div class="hdty-container hdty-flex new-list">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="factorData" ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="添加时间" prop="addTime">
                <el-date-picker
                  v-model="queryData.addTime"
                  type="datetimerange"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="请输入开始时间"
                  end-placeholder="请输入结束时间"
                  value-format="yyyyMMddHHmmss"
                  align="right"
                ></el-date-picker>
              </el-form-item>
            </hd-expand-header>
          </hd-expand>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <div class="con-table" v-loading="triggerLoading">
        <div
          class="con-list hdty-scroll"
          v-if="tableData && tableData.length > 0"
          style="padding: 6px 0;"
        >
          <div
            v-for="(item, index) in tableData"
            :key="index"
            class="con-list-item con-list-item-num"
          >
            <div
              class="list-item"
              :class="item.vo.status === '1' ? 'border-color-4' : 'border-color-1'"
            >
              <div
                class="con-pre-text"
                :class="item.vo.status === '1' ? 'back-color-4' : 'back-color-1'"
              >{{item.vox.status}}</div>
              <div class="con-info">
                <div class="row">
                  <div class="flex">
                    <span>总数量：</span>
                    <div class="width-60 text-bold text-color-4">
                      <a class="text-clickable" href="javascript:;">{{item.vo.num || 0}}</a>
                    </div>
                  </div>
                  <div class="flex">
                    <span>已签收：</span>
                    <div class="width-60 text-bold text-color-4">
                      <a class="text-clickable" href="javascript:;">{{item.vo.signedNum || 0}}</a>
                    </div>
                  </div>
                  <div class="flex">
                    <span>未签收：</span>
                    <div class="width-60 text-bold text-color-4">
                      <a class="text-clickable" href="javascript:;">{{item.vo.unSignedNum || 0}}</a>
                    </div>
                  </div>
                  <div class="flex">
                    <span>添加机构：</span>
                    <div
                      class="text-color-2 text-bold text-size-16"
                    >{{item.vox.addOrgId ? item.vox.addOrgId : '暂无机构'}}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="text-right-20 flex">
                    <span>添加时间：</span>
                    <div
                      class="width-150 text-color-4"
                    >{{item.vo.addTime ? $utilDate.dateFtt(item.vo.addTime, 'yyyy-MM-dd HH:mm:ss') : '暂无添加时间'}}</div>
                  </div>
                  <div class="text-right-20 flex">
                    <span>下发时间：</span>
                    <div
                      class="width-150 text-color-4"
                    >{{item.vo.issueTime ? $utilDate.dateFtt(item.vo.issueTime, 'yyyy-MM-dd HH:mm:ss') : '暂无下发时间'}}</div>
                  </div>
                  <div class="flex">
                    <span>最晚签收日期：</span>
                    <div
                      class="width-150 text-color-4"
                    >{{item.vo.zhhqrq ? $utilDate.dateFtt(item.vo.zhhqrq, 'yyyy-MM-dd') : '暂无最晚签收日期'}}</div>
                  </div>
                </div>
                <div class="row row2">
                  <div class="row-item row-item-24">
                    <label>下发备注：</label>
                    <div class="p-div">
                      <div
                        class="text-div"
                        :title="item.vo.issueMemo"
                        line-clamp="2"
                      >{{item.vo.issueMemo}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="con-operate" style="width: 190px;min-width: inherit;">
                <hd-button-container>
                  <hd-button type="success" size="mini">详情</hd-button>
                  <hd-button type="primary" size="mini">编辑</hd-button>
                  <hd-button type="danger" size="mini">删除</hd-button>
                </hd-button-container>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-list" v-else>暂无数据</div>
      </div>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageOptions.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { exampleData2 } from './data/responseData';

export default {
  name: 'PersonList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {},
  data() {
    return {
      // 查询
      queryData: {
        status: '',
        addTime: [],
        addOrgId: '',
        andor: this.$app.factorOptions.logicOpe.and
      },
      extendData: {
        addOrgId: ''
      },
      // 查询条件
      factorData: {},
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 导出加载
      toggleLoading1: false,
      toggleLoading2: false,
      // 上传加载
      uploadLoading: false,
      // 上传文件
      file: [],
      showRcgkBaseOpe: false
    };
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      this.tableData = exampleData2;
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style lang="scss">
.person-import-message {
  .el-message__icon {
    display: none;
  }
}
</style>
