<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        size="small"
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="factorData" ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item prop="sjgsdwdm" label="管辖机构">
                <hd-organ v-model="queryData.sjgsdwdm" placeholder="请选择管辖机构"></hd-organ>
              </el-form-item>
            </hd-expand-header>
          </hd-expand>
        </hd-component>
      </el-form>
      <!-- 新写法-->
      <hd-button-container>
        <hd-button type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-scroll" v-loading="loading" style="width:100%;min-height: 500px;">
      <!--内容-->
      <el-row style="padding: 20px 0;">
        <el-col
          :span="4"
          v-for="(item,index) in tableData"
          :key="item.vo.dzbm"
          :style="(index+1)%6 === 0?'':'padding-right:10px'"
        >
          <div class="hdty-card3">
            <div
              class="hdty-card3-tag"
              :class="getJlxlxBackColor(item.vo.dzyslxdm)"
            >{{item.vox.dzyslxdm}}</div>
            <div
              class="hdty-card3-header"
              :title="item.vo.jlxxqmc"
              :style="item.vo.jlxxqmc.length <=10 ?'line-height:55px;':''"
            >{{item.vo.jlxxqmc}}</div>
            <div class="hdty-card3-body">{{item.vo.jlxxqmcQc}}</div>
            <div class="hdty-opeBtn">
              <el-button type="primary" icon="icon-building" circle plain title="查看建筑物"></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="hdty-zwsj" v-if="tableData.length === 0">暂无数据</div>
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
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { exampleData3 } from './data/responseData';

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
        zxbs: '0',
        jlxxqmc: '',
        dzlx: '',
        ssxzjdDzbm: '',
        sssqjcwhDzbm: '',
        dzyslxdm: '',
        isExistsRelateEquipment: '',
        andor: this.$app.factorOptions.logicOpe.and
      },
      // 查询条件
      factorData: {
        jlxxqmcFilterFactor: this.$app.factorOptions.matchOpe.between,
        ssxzjdDzbmText: '',
        sssqjcwhDzbmText: ''
      },
      pageOptions: {
        size: 24,
        sizes: [24]
      },
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
      this.tableData = exampleData3;
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

    // 根据街路巷类型获取背景颜色
    getJlxlxBackColor(type) {
      if (type === '41') {
        return 'hdty-card3-tag-primary';
      } else if (type === '42') {
        return 'hdty-card3-tag-danger';
      } else if (type === '43') {
        return 'hdty-card3-tag-success';
      } else if (type === '44') {
        return 'hdty-card3-tag-warning';
      } else if (type === '45') {
        return 'hdty-card3-tag-info';
      }
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

<style lang="scss" scoped>
.hdty-fit {
  background-color: #fff;
}

.hdty-opeBtn {
  position: absolute;
  bottom: 2px;
  right: 5px;
}
.el-button + .el-button {
  margin-left: 1px;
}
.hdty-zwsj {
  width: 100%;
  text-align: center;
  padding: 50px;
  color: #909399;
}
.hdty-stat-sublist {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  height: 140px;
  background-color: #3193de;
}
</style>
