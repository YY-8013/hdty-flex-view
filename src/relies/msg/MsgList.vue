<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item label="消息标题" prop="title">
                <hd-factor-input prop="titleFilterFactor" v-model="queryData.title" :model-control.sync="extendData.titleFilterFactor" placeholder="请输入消息标题"></hd-factor-input>
              </el-form-item>
              <el-form-item label="读取状态" prop="readType">
                <hd-dict-radio v-model="queryData.readType" :dict-code="$global.dictType.msgReadStatus" show-all-button></hd-dict-radio>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="消息内容" prop="description">
                  <hd-factor-input prop="descriptionFilterFactor" v-model="queryData.description" :model-control.sync="extendData.descriptionFilterFactor" placeholder="请输入消息内容"></hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="消息主题" prop="msgType">
                  <hd-dict-cascader v-model="queryData.msgType" :dict-code="$global.dictType.msgTopic" multiple placeholder="请选择消息主题"></hd-dict-cascader>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="添加时间" prop="createTime">
                  <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="msgId"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="145">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                v-if="scope.row.vo.handleType === $global.dictItem.msgType.handle"
                name="deal"
                type="primary"
                @click="handleDeal(scope.$index, scope.row)">
                处理
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.msgType"
          label="消息主题"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.title"
          label="消息标题"
          sortable="custom"
          header-align="center"
          width="300">
          <template slot-scope="scope">
            <i
              v-if="scope.row.vo.readType === $global.dictItem.msgReadStatus.unRead"
              class="hdty-icon-xs hdty-danger-color icon-circle">
            </i>
            <span>{{ scope.row.vo.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.description"
          label="消息内容"
          sortable="custom"
          header-align="center"
          min-width="500">
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          label="发送时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        :total="pageOptions.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <msg-detail ref="detailRef"></msg-detail>
  </div>
</template>

<script>
  import { hdList } from "@/utils/util-framework";
  import { page, readOne, getMsgDealUrl } from '@/api/msg';
  import MsgDetail from './MsgDetail';
  export default {
    name: "MsgList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      MsgDetail
    },
    data() {
      return {
        // 查询
        queryData: {
          title: '',
          readType: '',
          description: '',
          msgType: [],
          createTime: [],
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询条件
        extendData: {
          titleFilterFactor: this.$app.factorOptions.matchOpe.between,
          descriptionFilterFactor: this.$app.factorOptions.matchOpe.between
        },
        // 表格
        tableData: [],
        // 验证
        rules: {},
        // 跳转新页签
        newPagetab: this.$app.newpagetabEnabled
      }
    },
    mounted() {
      // 初始化数据表格
      this.loadList();
    },
    methods: {
      // 获取数据表格
      loadList() {
        let _this = this;
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          page(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.$refs.tableRef.doLayout();
            _this.loading = false;
          });
        }
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
      },
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 处理
      handleDeal(index, row) {
        let _this = this;
        if(row.vo.readType === _this.$global.dictItem.msgReadStatus.unRead) {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          readOne(dataParams).then(response => {
            // 响应成功回调
            let { success } = response.data;
            if (success) {
              row.vo.readType = _this.$global.dictItem.msgReadStatus.haveRead;
              row.vox.readType = '已读';
              appMessage.$emit('mqtt-message', {
                type: 'count',
                data: -1
              });
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }
        let newPageTab = {
          enabled: _this.newPagetab,
        };
        if(row.vo.appId === _this.$utilLogin.getAppId()) {
          _this.$nextTick(() => {
            _this.$router.push({
              path: row.vo.targetPath,
              query: {
                newpagetab: encodeURIComponent(JSON.stringify(newPageTab)),
                ..._this.$utilStr.parameterToObj(row.vo.targetParam)
              }
            });
          });
        }else {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          getMsgDealUrl(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              /*
              // 重命名要打开的页面选项卡
              newPageTab.name = ''; // 选项卡的标识符
              newPageTab.label = ''; // 选项卡的标题
               */
              _this.$nextTick(() => {
                _this.$router.push({
                  name: data.name,
                  query: {
                    newpagetab: encodeURIComponent(JSON.stringify(newPageTab)),
                    ..._this.$utilStr.parameterToObj(row.vo.targetParam)
                  }
                });
              });
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }
      }
    }
  }
</script>
