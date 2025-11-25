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
        <!--扬言报复社会他人的人员扩展信息-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-user-solid"></i>
              扬言报复社会他人的人员扩展信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <div class="form-row">
                    <!--扬言途径-->
                    <div class="form-item-12 form-item">
                      <label class="label"><span>扬言途径</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="yytj">
                            <hd-dict-select
                              v-model="formData.yytj"
                              :model-text.sync="formData.yytjText"
                              :dict-code="$global.dictType.yytj"
                              filterable
                              placeholder="请选择扬言途径">
                            </hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <!--管控措施-->
                    <div class="form-item-12 form-item">
                      <label class="label"><span>管控措施</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="zygkcsdm">
                            <hd-dict-select
                              v-model="formData.zygkcsdm"
                              :model-text.sync="formData.zygkcsdmText"
                              :dict-code="$global.dictType.zygkcsdm"
                              filterable
                              placeholder="请选择管控措施">
                            </hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--扬言报复社会原因-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>扬言报复社会原因</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="yybfshyy">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.yybfshyy"
                              placeholder="请输入扬言报复社会原因"
                              maxlength="100">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--具体言行表现-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span  class="required">具体言行表现</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="yxnr">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.yxnr"
                              placeholder="请输入具体言行表现"
                              maxlength="100">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--是否涉访-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>是否涉访</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="sfsf">
                            <hd-dict-radio
                              v-model="formData.sfsf"
                              :model-text.sync="formData.sfsfText"
                              :dict-code="$global.dictType.sfsf"
                              type="button"
                              filterable>
                            </hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--涉访详细情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>涉访详细情况</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="sfxxqk">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.sfxxqk"
                              placeholder="请输入涉访详细情况"
                              maxlength="100">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--诉求或矛盾纠纷化解情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>诉求或矛盾纠纷化解情况</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="sqhmdjfhjqk">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.sqhmdjfhjqk"
                              placeholder="请输入诉求或矛盾纠纷化解情况"
                              maxlength="100">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--管控措施详细情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>管控措施详细情况</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="gkcsXxqk">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.gkcsXxqk"
                              placeholder="请输入管控措施详细情况"
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
    name: 'BizYybfshtrAdd',
    provide() {
      return {
        BizYybfshtrAdd: this
      };
    },
    inject: ['bizYybfshtr'],
    mixins: [hdList, hdForm],
    components: {},
    data() {
      return {
        // 显示与隐藏
        visible: false,
        // 表单信息
        formData: {
          yytj: '',
          yytjText: '',
          yybfshyy: '',
          yxnr: '',
          zygkcsdm: '',
          zygkcsdmText: '',
          sfsf: '',
          sfsfText: '',
          sfxxqk: '',
          sqhmdjfhjqk: '',
          gkcsXxqk: '',
          sjczlxdm: '1',
        },
        // 验证
        rules: {
          yxnr: [
            { required: true, message: '请输入具体言行表现', trigger: 'blur' },
            {validator: this.$utilValidate.validateBlank, trigger: 'blur'},
          ],
        },
        // 常口库查询加载
        cardIdQueryLoading: false,
      }
    },
    methods: {
      // 加载之前
      beforeLoadForm() {

      },
      // 确定
      submitForm() {
        let _this = this;
        if (_this.formData.sfsf === "1") {
          _this.formData.sfsfText = "是";
        } else if (_this.formData.sfsf === "0") {
          _this.formData.sfsfText = "否";
        } else {
          _this.formData.sfsfText = "";
        }
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
        this.formData.yytjText = '';
        this.formData.zygkcsdmText = '';
        this.formData.sfsfText = '';
        // 重置常口库查询加载
        this.cardIdQueryLoading = false;
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
  .form-row {
    .label {
      width: 150px !important;
    }
  }
</style>
