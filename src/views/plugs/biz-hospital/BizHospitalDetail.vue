<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit
      v-loading="handleLoading">

      <!--住院信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            住院信息
          </div>
        </div>
        <div class="area-body">
          <!--人员信息-->
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--人员关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">医院名称</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{ formData.hospitalName }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">入院时间</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{ $utilDate.dateFtt(formData.rysj, 'yyyy-MM-dd') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">出院时间</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{
                         formData.cysj != null && formData.cysj != '' ? $utilDate.dateFtt(formData.cysj, 'yyyy-MM-dd') : "无"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--备  注-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label"><span>备  注</span></label>
                    <div class="p-div p-div3">
                      <div class="text-div">
                        {{ formData.bz }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {hdList, hdForm} from '@/utils/util-framework';

export default {
  name: 'BizHospitalDetail',
  provide() {
    return {
      BizHospitalDetail: this
    };
  },
  inject: ['bizHospital'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      // 行
      row: {},
    }
  },
  methods: {
    // 初始化执行的方法
    beforeLoadForm() {
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单

    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      _this.formData = _this.row;
      _this.handleLoading = false;
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {};
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
