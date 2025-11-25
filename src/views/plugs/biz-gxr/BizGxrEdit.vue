<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
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
                  <!--人员关系-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">人员关系</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="rygxlx">
                            <hd-dict-select
                              v-model="formData.rygxlx"
                              :model-text.sync="formData.rygxlxText"
                              :dict-code="$global.dictType.rygxlx"
                              filterable
                              placeholder="请选择人员关系"
                            >
                            </hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--人员姓名-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">人员姓名</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="xm">
                            <el-input
                              v-model="formData.xm"
                              placeholder="请输入人员姓名"
                              maxlength="15"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--身份证号-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">身份证号</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="gmsfhm">
                            <el-input
                              disabled
                              v-model="formData.gmsfhm"
                              placeholder="请输入身份证号"
                              maxlength="18"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--联系电话-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">联系电话</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="lxdh">
                            <el-input
                              v-model="formData.lxdh"
                              placeholder="请输入联系电话"
                              maxlength="12"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--现住地区-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>现住地区</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="xjzdzSsxqdm">
                            <hd-region
                              v-if="visible"
                              v-model="formData.xjzdzSsxqdm"
                              :model-text.sync="formData.xjzdzSsxqdmText"
                              selectLastLevel
                              ref="xzdq"
                              placeholder="请选择现住地区"
                              @currentChanged="changeXjzdzSsxqdm"
                            >
                            </hd-region>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--现住地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>现住地址</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="xjzdzQhnxxdz">
                            <el-input
                              v-model="formData.xjzdzQhnxxdz"
                              placeholder="请输入现住地址"
                              maxlength="100"
                            >
                            </el-input>
                          </el-form-item>
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
                          <el-form-item prop="bz">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.bz"
                              placeholder="请输入备注"
                              maxlength="100"
                            >
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
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizGxrEdit",
  provide() {
    return {
      BizGxrEdit: this
    };
  },
  inject: ["bizGxr"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        rygxlx: "",
        rygxlxText: "",
        xm: "",
        gmsfhm: "",
        lxdh: "",
        xjzdzSsxqdm: "",
        xjzdzSsxqdmText: "",
        xjzdzQhnxxdz: "",
        bz: ""
      },
      // 验证
      rules: {
        rygxlx: [
          { required: true, message: "请选择人员关系", trigger: "change" }
        ],
        xm: [
          { required: true, message: "请输入人员姓名", trigger: "blur" },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: "blur"
          },
          { min: 2, max: 30, message: "请正确输入真实姓名", trigger: "blur" }
        ],
        gmsfhm: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: this.$utilValidate.validateIdcard, trigger: "blur" }
        ],
        lxdh: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: "blur"
          }
        ]
      },
      // 行
      row: {}
    };
  },
  methods: {
    // 加载之前
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
      this.formData = JSON.parse(JSON.stringify(this.row));
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.gmsfhm) {
            _this.formData.gmsfhm = _this.formData.gmsfhm.toUpperCase();
          }
          _this.formData.xm = _this.$utilAll.getNameForDot(_this.formData.xm);
          _this.$set(_this.formData, "needEdit", false);

          _this.$emit("currentChange", _this.formData);
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
      this.formData.rygxlxText = "";
      this.formData.xjzdzSsxqdmText = "";
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped></style>
