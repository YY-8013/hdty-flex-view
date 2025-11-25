<template>
  <!-- <el-dialog
    title="审批"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  > -->
  <hd-pane fit v-loading="loading">
    <!--督办信息-->
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="0"
      @keyup.enter.native="submitForm"
    >
      <hd-component :model="extendData" ref="componentRef">
        <!--审批信息-->
        <div class="con-area">
          <!-- <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                审批信息
              </div>
            </div> -->
          <div class="area-body">
            <el-card class="con-card box-card" style="padding-bottom: 0">
              <div class="body">
                <div class="form">
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">审批状态</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="spzt">
                            <hd-dict-radio
                              v-model="formData.spzt"
                              :dict-code="$global.dictType.rwspStatus"
                              :removeOption="['0', '1']"
                              @currentChanged="currentChanged"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">审批意见</span></label
                      >
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="spyj">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.spyj"
                              placeholder="请输入审批意见"
                              maxlength="1000"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="submit-btn-box" style="text-align: center">
                  <el-button
                    type="primary"
                    style="margin: 5px auto; width: 150px"
                    @click="submitForm"
                    >提交</el-button
                  >
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </hd-component>
    </el-form>
  </hd-pane>
  <!-- <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span> -->
  <!-- </el-dialog> -->
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import { examineTask } from "./../api";

export default {
  name: "NewTaskCenterDisLogout",
  props: {
    // 行
    row: {
      type: Object,
      default: () => {
        return {
          vo: {},
          vox: {},
        };
      },
    },
  },
  provide() {
    return {
      NewTaskCenterDisLogout: this,
    };
  },
  inject: ["hdList", "NewTaskCenterDisListCreate"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {
        spzt: "2",
        spyj: "同意！",
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        spzt: [
          { required: true, message: "请选择审批状态", trigger: "change" },
        ],
        spyj: [{ required: true, message: "请输入审批意见", trigger: "blur" }],
      },
      // 行
      // row: {
      //   vo: {},
      //   vox: {},
      // },
    };
  },
  mounted() {},
  methods: {
    // 当前选中项改变
    currentChanged() {
      if (this.formData.spzt == "2") {
        this.formData.spyj = "同意！";
      } else {
        this.formData.spyj = "";
      }
    },
    // 加载表单之前
    beforeLoadForm() {},
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.formData,
            id: _this.row.vo.id,
          };
          // Lambda写法
          examineTask(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success",
                });
                _this.visible = false;
                _this.resetForm();
                _this.NewTaskCenterDisListCreate.loadList();
                _this.NewTaskCenterDisListCreate.getDspNum();
                _this.$emit("submit")
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
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
      this.$refs.componentRef.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped></style>
