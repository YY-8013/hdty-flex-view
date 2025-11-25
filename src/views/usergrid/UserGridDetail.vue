<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="formData"
        ref="formRef"
        label-width="120px"
        border
        stripe
        v-loading="submitting"
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              基础信息
            </div>
          </div>
          <div class="hdty-card-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="身份证号" prop="vo.gmsfhm">
                  <biz-big-data class="text-color-4" :cardId="formData.vo.gmsfhm"></biz-big-data>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态" prop="vox.enable" :style="{'color': formData.vo.enable === '1' ? '#1cc9b5' : '#ff5959'}">
                  {{ formData.vox.enable }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="真实姓名" prop="vo.xm">
                  {{ formData.vo.xm }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="vo.telephone">
                  <biz-big-data :phone="formData.vo.telephone"></biz-big-data>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属民警" prop="vox.mjId">
                  {{ formData.vox.mjId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社区/行政村" prop="vox.communityId">
                  {{ formData.vox.communityId }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="管辖机构" prop="vox.orgId">
                  {{ formData.vox.orgId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行政区划" prop="vox.regionId">
                  {{ formData.vox.regionId }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="有效期限" prop="vo.expiredTime">
              {{ $utilDate.dateFtt(formData.vo.expiredTime, 'yyyy-MM-dd') }}
            </el-form-item>
            <el-form-item label="备  注" prop="vo.expiredTime">
              {{ formData.vo.memo}}
            </el-form-item>
          </div>
        </div>
        <div class="hdty-card" v-if="formData.vo.jlxList && formData.vo.jlxList.length > 0">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              管辖街路巷(小区/村庄)信息
            </div>
          </div>
          <div class="hdty-card-body">
            <!--管辖小区-->
            <div style="max-height: 180px;" class="hdty-scrolls">
              <el-table
                :data="formData.vo.jlxList"
                row-key="bzdz"
                ref="tableRef"
                style="max-height: 180px;overflow: auto"
                v-loading="loading"
                border
                fit>
                <el-table-column
                  sortable="custom"
                  type="index"
                  label="序号"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="小区名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="hdty-card" v-if="formData.vo.jzwList && formData.vo.jzwList.length > 0">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              管辖建筑物信息
            </div>
          </div>
          <div class="hdty-card-body">
            <!--管辖建筑物-->
            <div style="max-height: 180px;" class="hdty-scrolls">
              <el-table
                :data="formData.vo.jzwList"
                row-key="bzdz"
                ref="tableRef"
                style="max-height: 180px;overflow: auto"
                v-loading="loading"
                border
                fit>
                <el-table-column
                  sortable="custom"
                  type="index"
                  label="序号"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="建筑物名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              采集信息
            </div>
          </div>
          <div class="hdty-card-body">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vo.createUserId" label="添 加 人">
                  {{ formData.vox.createUserId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vo.createTime" label="添加时间">
                  {{ $utilDate.dateFtt(formData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vo.updateUserId" label="更 新 人">
                  {{ formData.vox.updateUserId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vo.updateTime" label="更新时间">
                  {{ $utilDate.dateFtt(formData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}
                </el-form-item>
              </el-col>
            </el-row>
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
  import {hdForm} from "@/utils/util-framework";
  import {detail} from './api';

  export default {
    name: "UserGridDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        formData: {
          vo: {},
          vox: {}
        },
        // 行
        row: {
          vo: {},
          vox: {},
        },
        // 显示
        visible: false,
      }
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
        _this.submitting = true;
        // 参数
        let dataParams = {
          id: _this.row.vo.id
        };
        // Lambda写法
        detail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.submitting = false;
        });
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.formData = {
          vo: {},
          vox: {}
        };
      }
    }
  }
</script>

<style scoped>
  .hdty-card-body{
    padding: 0 24px;
  }
</style>
