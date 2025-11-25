<template>
  <el-dialog
    title="回退"
    :visible.sync="visible"
    custom-class="hdty-dialog new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                回退对象
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <!-- <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-user-solid"></i>
                    回退对象
                  </div>
                </div>-->
                <div class="body">
                  <div class="form">
                    <!--移交类型-->
                    <div v-if="false" class="form-row form-row-radio-button">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">对象类型</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="assignType">
                              <el-radio-group
                                v-model="formData.assignType"
                                size="small"
                              >
                                <el-radio-button label="1"
                                  >人员</el-radio-button
                                >
                                <el-radio-button label="2"
                                  >机构</el-radio-button
                                >
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--回退人员-->
                    <div
                      class="form-row"
                      v-if="false && formData.assignType === '1'"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span
                            :class="
                              formData.assignType === '1' ? 'required' : ''
                            "
                            >回退人员</span
                          >
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="userid">
                              <hd-mj-select
                                ref="mjRef"
                                prop="userid"
                                v-model="formData.userid"
                                :model-text.sync="extendData.userid"
                                title="回退人员"
                                placeholder="请选择回退人员"
                              ></hd-mj-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--回退机构-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">回退机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="orgType">
                              <el-radio-group
                                v-model="formData.orgType"
                                size="small"
                              >
                                <el-radio-button
                                  label="1"
                                  v-if="$utilPublic.getUserOrgLevel() > 4"
                                  >当前派出所</el-radio-button
                                >
                                <el-radio-button label="2"
                                  >当前分局</el-radio-button
                                >
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--任务要求-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">回退原因</span>
                        </label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="yjyy">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.yjyy"
                                placeholder="请输入回退原因"
                                maxlength="2000"
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
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm" v-preventReClick
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import HdMjSelect from "../../usergrid/plugs/hd-mj-select/index.vue";
import { handOver } from "../api";

export default {
  name: "NewTaskCenterDelEdit",
  provide() {
    return {
      NewTaskCenterDelEdit: this,
      ParentPage: this
    };
  },
  inject: ["NewTaskCenterDelList"],
  mixins: [hdList, hdForm],
  components: { HdMjSelect },
  data() {
    return {
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,

      // 表单
      formData: {
        assignType: "",
        orgType: "",
        userid: "",
        yjyy: ""
      },
      // 表单扩展
      extendData: {
        userid: ""
      },
      // 验证
      rules: {
        assignType: [
          { required: true, message: "请选择回退对象类型", trigger: "change" }
        ],
        userid: [
          { required: true, message: "请选择回退人员", trigger: "change" }
        ],
        orgType: [
          { required: true, message: "请选择回退机构", trigger: "change" }
        ],
        yjyy: [{ required: true, message: "请输入回退原因", trigger: "blur" }]
      },

      // 行
      row: {
        vo: {},
        vox: {}
      }
    };
  },
  mounted() {},
  updated() {},
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置表单
        this.resetForm();
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            id: _this.row.vo.taskUserRecodeId,
            yjyy: _this.formData.yjyy
          };
          // // 人员
          // if (_this.formData.assignType === '1') {
          //   dataParams.userid = _this.formData.userid;
          // } else if (_this.formData.assignType === '2') {
          // 机构：当前派出所、当前分局
          dataParams.orgid =
            _this.formData.orgType === "1"
              ? this.$utilPublic.getUserInfo().orgId.substr(0, 8) + "0000"
              : this.$utilPublic.getUserInfo().orgId.substr(0, 6) + "000000";
          // }
          console.log("dataParams", dataParams);
          // Lambda写法
          handOver(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.cancelForm();
                _this.NewTaskCenterDelList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.userid = "";
      this.extendData.userid = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  .label {
    width: 150px !important;
  }
}

.con-display-body {
  color: #878d99;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    margin-left: 6px;
  }
}

.no-form-item {
  color: #878d99;
  text-align: center;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>
