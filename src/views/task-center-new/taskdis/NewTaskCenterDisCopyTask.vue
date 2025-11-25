<template>
  <el-dialog
    title="复制任务"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        v-loading="submitting"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-time"></i>
                复制任务
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div class="body">
                  <div class="form">
                    <!--指派机构-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">指派机构</label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="sjgsdwdm">
                              <hd-organ
                                v-model="formData.sjgsdwdm"
                                placeholder="请选择指派机构"
                                :showLevel="rwBaseConfig.orgLevel"
                                multiple
                              ></hd-organ>
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
      <el-button size="medium" @click="cancelForm">取 消</el-button>
      <el-button type="primary" v-preventReClick @click="submitForm"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { copyTask } from "./../api";
import HdMjSelect from "./../../usergrid/plugs/hd-mj-select/index.vue";

export default {
  name: "NewTaskCenterDisCopyTask",
  provide() {
    return {
      NewTaskAssign: this
    };
  },
  components: { HdMjSelect },
  data() {
    return {
      // 显示
      visible: false,
      // 加载
      submitting: false,
      // 表单
      formData: {
        sjgsdwdm: []
      },
      // 表单扩展
      extendData: {
        sjgsdwdm: []
      },
      // 验证
      rules: {
        sjgsdwdm: [
          { required: true, message: "请选择指派机构", trigger: "change" }
        ]
      },
      // 指派类型
      zpType: "1",
      row: {
        vo: {},
        vox: {}
      },
      rwBaseConfig: {
        orgLevel: 4,
        orgLevelText: "分局",
        checkLevel: []
      }
    };
  },
  created() {
    this.initOrgLevel();
  },
  methods: {
    initOrgLevel() {
      let _this = this;
      let configValue = _this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "rwBaseConfig");

      if (configValue && configValue.value) {
        let baseConfig = JSON.parse(configValue.value);
        _this.rwBaseConfig = { ..._this.rwBaseConfig, ...baseConfig };
      }
    },
    // 加载表单之前
    beforeLoadForm() {
      let _this = this;
      _this.getShowLevel();
      _this.$nextTick(() => {
        // 重置表单
        _this.resetForm();
      });
    },

    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.submitting = true;
          // 参数
          let dataParams = {
            taskId: _this.row.vo.id,
            objectId: _this.row.vo.objectId,
            ..._this.formData
          };
          // Lambda写法
          copyTask(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.$emit("todoAssign", "");
                _this.cancelForm();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.submitting = false;
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
