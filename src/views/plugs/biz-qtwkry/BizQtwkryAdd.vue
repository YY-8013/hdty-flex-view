<template>
  <el-dialog title="新增" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <!--人员信息-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-user-solid"></i>
              人员信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--人员类型-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">人员类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="refType">
                            <hd-dict-select
                              v-model="formData.refType"
                              :model-text.sync="formData.refTypeText"
                              :dict-code="$global.dictType.qtwkRylx"
                              filterable
                              placeholder="请选择人员类型"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--人员姓名-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">人员姓名</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="name">
                            <el-input v-model="formData.name" placeholder="请输入人员姓名" maxlength="15"></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--身份证号-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">身份证号</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cardId">
                            <el-input
                              v-model="formData.cardId"
                              placeholder="请输入身份证号"
                              maxlength="18"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--联系电话-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">联系电话</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="phoneNum">
                            <el-input
                              v-model="formData.phoneNum"
                              placeholder="请输入联系电话"
                              maxlength="12"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--人员职务-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">人员职务</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="duty">
                            <el-input
                              type="input"
                              v-model="formData.duty"
                              placeholder="请输入人员职务"
                              maxlength="100"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--备  注-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>备&emsp;&emsp;注</span>
                      </label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="memo">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.memo"
                              placeholder="请输入备注"
                              maxlength="100"
                            ></el-input>
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
import { hdList, hdForm } from '@/utils/util-framework';

export default {
  name: 'BizQtwkryAdd',
  provide() {
    return {
      BizQtwkryAdd: this
    };
  },
  inject: ['bizQtwkry'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        refType: '',
        refTypeText: '',
        name: '',
        cardId: '',
        phoneNum: '',
        duty: '',
        memo: ''
      },
      // 验证
      rules: {
        refType: [
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入人员姓名', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: 'blur'
          },
          { min: 2, max: 30, message: '请正确输入真实姓名', trigger: 'blur' }
        ],
        cardId: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: this.$utilValidate.validateIdcard, trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: 'blur'
          }
        ],
        duty: [{ required: true, message: '请输入人员职务', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {},
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.cardId) {
            _this.formData.cardId = _this.formData.cardId.toUpperCase();
          }
          _this.formData.name = _this.$utilAll.getNameForDot(
            _this.formData.name
          );
          _this.$emit('currentChange', _this.formData);
          _this.cancelForm();
        }
      });
    },
    // 手动改变现住地区
    changeXjzdzSsxqdm() {
      this.formData.xjzdzQhnxxdz = this.$refs.xzdq.input;
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.refTypeText = '';
      this.formData.xjzdzSsxqdmText = '';
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
