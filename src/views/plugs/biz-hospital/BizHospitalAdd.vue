<template>
  <el-dialog
    title="新增"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0">
        <!--人员信息-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-user-solid"></i>
              住院信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span class="required">医院名称</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="hospitalName">
                            <el-input
                              v-model="formData.hospitalName"
                              placeholder="请输入医院名称"
                              maxlength="50">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div class="form-row">
                    <div class="form-item-12 form-item">
                      <label class="label"><span class="required">入院日期</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="rysj">
                            <hd-date-picker
                              type="date"
                              v-model="formData.rysj"
                              value-format="yyyyMMdd"
                              placeholder="请选择入院日期">
                            </hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-12 form-item">
                      <label class="label"><span>出院日期</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cysj">
                            <hd-date-picker
                              type="date"
                              v-model="formData.cysj"
                              value-format="yyyyMMdd"
                              placeholder="请选择出院日期">
                            </hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>


                  <!--备  注-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>备  注</span></label>
                      <div class="p-div  p-div3">
                        <div class="text-div">
                          <el-form-item prop="bz">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.bz"
                              placeholder="请输入备注"
                              maxlength="100">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </el-card>
          </div>
        </div>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {hdList, hdForm} from "@/utils/util-framework";

export default {
  name: 'BizHospitalAdd',
  provide() {
    return {
      BizHospitalAdd: this
    };
  },
  inject: ['bizHospital'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    let validateRysj = (rule, value, callback) => {
      let matchedValue = this.formData.cysj;
      if (!this.$utilStr.isEmpty(value) && !this.$utilStr.isEmpty(matchedValue)) {
        if (Number(value) > Number(matchedValue)) {
          callback(new Error('入院时间不能大于出院时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateCysj = (rule, value, callback) => {
      let matchedValue = this.formData.rysj;
      if (!this.$utilStr.isEmpty(value) && !this.$utilStr.isEmpty(matchedValue)) {
        if (Number(value) < Number(matchedValue)) {
          callback(new Error('入院时间不能大于出院时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        hospitalName: '',
        rysj: '',
        cysj: '',
        bz: '',
      },
      // 验证
      rules: {
        hospitalName: [
          {required: true, message: '请输入医院名称', trigger: 'blur'}
        ],
        rysj: [
          {required: true, message: '请选择入院时间', trigger: 'change'},
          {validator: validateRysj, trigger: 'change'}
        ],
        cysj: [
          {required: false, message: '请选择出院时间', trigger: 'change'},
          {validator: validateCysj, trigger: 'change'}
        ],
      },
    }
  },
  methods: {
    // 加载之前
    beforeLoadForm() {

    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.$emit('currentChange', _this.formData);
          _this.cancelForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.hospitalName = '';
      this.formData.bz = '';
      this.formData.rysj = '';
      this.formData.cysj = '';
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
