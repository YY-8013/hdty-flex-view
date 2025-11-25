<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="handleLoading">
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @keyup.enter.native="cancelForm">

        <!--机构信息-->
        <div class="hdty-card">
          <div class="hdty-card-header">
            机构信息
          </div>
          <div class="hdty-card-body">
            <el-row>
              <el-form-item label="管辖机构">
                {{ detailData.vox.orgid }}
              </el-form-item>
            </el-row>
          </div>
        </div>

        <!--分数配置-->
        <div class="hdty-card" v-if="detailData.vo.scoreList">
          <div class="hdty-card-header">分数配置</div>
          <div class="hdty-card-body">
            <div v-for="(item, index) in detailData.vo.scoreList" :key="index" class="container-item">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="分数分值">
                    {{ item.vo.score }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分数等级">
                    {{ item.vox.levelCode }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="分数频率">
                    {{ item.vox.gkplKey }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分数颜色" :style="{ color: '#' + (item.vo.colorKey ? item.vo.colorKey : '606266') }">
                    {{ item.vox.colorKey }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <!--附件配置-->
        <div class="hdty-card" v-if="detailData.vo.docList">
          <div class="hdty-card-header">附件配置</div>
          <div class="hdty-card-body">
            <div v-for="(item, index) in detailData.vo.docList" :key="index" class="container-item">
              <el-form-item label="业务类型" :class="{'middle-form-item': item.vox.ywlx}">
                {{ item.vox.ywlx }}
              </el-form-item>
              <el-form-item label="人员类型" :class="{'middle-form-item': item.vox.zdrylx && item.vox.zdrylx.length > 0}">
                {{ formatArray(item.vox.zdrylx) }}
              </el-form-item>
              <el-form-item label="附件类型" :class="{'middle-form-item': item.vox.allDocs && item.vox.allDocs.length > 0}">
                {{ formatArray(item.vox.allDocs) }}
              </el-form-item>
              <el-form-item label="必选附件" :class="{'middle-form-item': item.vox.requiredDocs && item.vox.requiredDocs.length > 0}">
                {{ formatArray(item.vox.requiredDocs) }}
              </el-form-item>
            </div>
          </div>
        </div>

        <!--审批配置-->
        <div class="hdty-card" v-if="detailData.vo.spList">
          <div class="hdty-card-header">审批配置</div>
          <div class="hdty-card-body">
            <div v-for="(item, index) in detailData.vo.spList" :key="index" class="container-item">
              <el-form-item label="业务类型" :class="{'middle-form-item': item.vox.ywlx}">
                {{ item.vox.ywlx }}
              </el-form-item>
              <el-form-item label="人员类型" :class="{'middle-form-item': item.vox.zdrylx && item.vox.zdrylx.length > 0}">
                {{ formatArray(item.vox.zdrylx) }}
              </el-form-item>
              <el-form-item label="审批级别" :class="{'middle-form-item': item.vox.spLevel && item.vox.spLevel.length > 0}">
                {{ formatArray(item.vox.spLevel) }}
              </el-form-item>
              <el-form-item label="是否启用" :class="{'middle-form-item': item.vox.enabled}">
                {{ item.vox.enabled }}
              </el-form-item>
            </div>
          </div>
        </div>

      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdForm} from '@/utils/util-framework';
  import {detail} from './api';

  export default {
    name: 'DeployDetail',
    provide() {
      return {
        hdDetail: this
      };
    },
    mixins: [hdForm],
    data() {
      return {
        // 表单
        detailData: {
          vo: {},
          vox: {}
        },
        // 行
        row: {},
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.$nextTick(() => {
          // 重置
          this.resetForm();
          // 加载表单
          this.loadForm();
        });
      },
      // 加载表单
      loadForm() {
        let _this = this;
        _this.handleLoading = true;
        // 参数
        let dataParams = {
          orgid: _this.row.vo.orgid
        };
        // Lambda写法
        detail(dataParams).then(response => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.detailData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.log(error);
        }).finally(() => {
          _this.handleLoading = false;
        });
      },
      // 将集合拼接为字符串
      formatArray(array) {
        let str = '';
        if (array.length && array.length > 0) {
          array.forEach((item, index) => {
            if (index !== array.length - 1) {
              str += item + '，';
            } else {
              str += item;
            }
          });
        }
        return str;
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.$refs.formRef.resetFields();
      },
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .el-form[border] {
    box-shadow: none !important;
  }

  .container-item {
    margin-bottom: 10px;
  }

  ::v-deep.middle-form-item {
    ::v-deep .el-form-item__label {
      position: absolute;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    ::v-deep .el-form-item__content {
      margin-left: 100px !important;
    }
  }

</style>
