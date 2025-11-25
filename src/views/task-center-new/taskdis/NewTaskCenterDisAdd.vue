<template>
  <el-dialog
    title="创建任务"
    :visible.sync="visible"
    custom-class="hdty-dialog-large new-form new-form-step"
    append-to-body
  >
    <hd-pane style="background-color: #ffffff" fit v-loading="loading">
      <div class="con-all-pane">
        <div class="con-all-step">
          <el-steps :active="activeStep" finish-status="success">
            <el-step title="任务要求"></el-step>
            <el-step title="选择表单"></el-step>
            <el-step title="指派对象"></el-step>
          </el-steps>
        </div>
        <div class="con-all-page">
          <step0 ref="Step0Ref" v-show="activeStep === 0"></step0>
          <step1 ref="Step1Ref" v-show="activeStep === 1"></step1>
          <step2 ref="Step2Ref" v-show="activeStep === 2"></step2>
        </div>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button
        type="warning"
        @click="handlePresStep"
        v-if="activeStep > 0"
        icon="el-icon-arrow-left"
        >上一步</el-button
      >
      <el-button
        type="success"
        @click="handleNextStep"
        v-if="activeStep < 2"
        icon="el-icon-arrow-right"
        >下一步</el-button
      >
      <el-button type="primary" @click="submitForm" v-preventReClick
        >提 交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import utilValidate from "./../utils/util-validate";
import { addTask, addTaskSp } from "./../api";
import Step0 from "./../steps/Step0";
import Step1 from "./../steps/Step1";
import Step2 from "./../steps/Step2";

export default {
  name: "NewTaskCenterDisAdd",
  provide() {
    return {
      NewTaskCenterDisAdd: this
    };
  },
  inject: ["NewTaskCenterDisListCreate"],
  mixins: [hdList],
  components: {
    Step0,
    Step1,
    Step2
  },
  data() {
    return {
      // 显示
      visible: false,
      // 当前步骤条
      activeStep: 0
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {},
    // 提交
    submitForm() {
      let _this = this;
      _this.submitFormValidateStep0();
    },
    // 验证第0步
    submitFormValidateStep0() {
      let _this = this;
      _this.$refs.Step0Ref.$refs.formRef.validate((valid0) => {
        if (valid0) {
          // 通过，下一步
          _this.submitFormValidateStep1();
        } else {
          _this.activeStep = 0;
        }
      });
    },
    // 验证第1步
    submitFormValidateStep1() {
      let _this = this;
      // 选择有表单时，则必须存在一条表单记录
      if (_this.$refs.Step1Ref.ishaveItem === "1") {
        if (
          !_this.$refs.Step1Ref.formTableData ||
          _this.$refs.Step1Ref.formTableData.length === 0
        ) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一个表单",
            type: "warning"
          });
          _this.activeStep = 1;
          return;
        }
      }
      // 选择有表单时且有任务对象时，则必须存在一条任务对象记录
      if (
        _this.$refs.Step1Ref.ishaveItem === "1" &&
        _this.$refs.Step1Ref.ishaveObject === "1"
      ) {
        // 验证条数
        if (
          !_this.$refs.Step1Ref.objTableData ||
          _this.$refs.Step1Ref.objTableData.length === 0
        ) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少添加一条任务对象",
            type: "warning"
          });
          _this.activeStep = 1;
          return;
        }
      }
      // 验证表格数据
      let isContinue = true; // 是否继续往下进行
      let isBreakLoop = false; // 是否跳出外层循环
      // 判断是否需要验证数据
      if (
        _this.$refs.Step1Ref.ishaveItem === "1" &&
        _this.$refs.Step1Ref.ishaveObject === "1"
      ) {
        if (
          _this.$refs.Step1Ref.objTableData &&
          _this.$refs.Step1Ref.objTableData.length > 0
        ) {
          // 外层循环
          for (
            let columnIndex = 0;
            columnIndex < _this.$refs.Step1Ref.rwNformObjectList.length;
            columnIndex++
          ) {
            // 要显示的字段才进行验证
            if (
              _this.$refs.Step1Ref.rwNformObjectList[columnIndex].isShow === "1"
            ) {
              let fieldConfig = JSON.parse(
                _this.$refs.Step1Ref.rwNformObjectList[columnIndex].config
              ); // 字段配置内容
              let required = fieldConfig.rules
                ? fieldConfig.rules.required
                : false; // 是否必填
              let validator = fieldConfig.rules
                ? fieldConfig.rules.validator
                : false;
              // 内层循环
              _this.$refs.Step1Ref.objTableData.forEach(
                (dataItem, dataIndex) => {
                  // 非空判断
                  if (required) {
                    if (!dataItem[fieldConfig.prop]) {
                      let current =
                        Math.floor(
                          dataIndex / _this.$refs.Step1Ref.pageOptions.size
                        ) + 1;
                      _this.$refs.Step1Ref.pageOptions.current = current;
                      _this.$refs.Step1Ref.tableData =
                        _this.$refs.Step1Ref.paginateArray();
                      let num =
                        dataIndex +
                        1 -
                        _this.$refs.Step1Ref.pageOptions.size *
                          Math.floor(
                            dataIndex / _this.$refs.Step1Ref.pageOptions.size
                          );
                      _this.$message({
                        showClose: true,
                        customClass: "is-fixed",
                        message:
                          "当前页，第" +
                          num +
                          "条数据，" +
                          (fieldConfig.rules.message ||
                            fieldConfig.rules.requiredMsg),
                        type: "warning"
                      });
                      _this.activeStep = 1;
                      // 不再往下进行
                      isContinue = false;
                      // 跳出外层循环
                      isBreakLoop = true;
                      // 跳出当前内层循环
                      return false;
                    }
                  }
                  // 格式判断（可能有多种格式）
                  if (validator) {
                    // 验证中文姓名
                    if (validator === "checkChineseName") {
                      let res = utilValidate.checkChineseName(
                        dataItem[fieldConfig.prop]
                      );
                      if (res[0] === "0") {
                        let current =
                          Math.floor(
                            dataIndex / _this.$refs.Step1Ref.pageOptions.size
                          ) + 1;
                        _this.$refs.Step1Ref.pageOptions.current = current;
                        _this.$refs.Step1Ref.tableData =
                          _this.$refs.Step1Ref.paginateArray();
                        let num =
                          dataIndex +
                          1 -
                          _this.$refs.Step1Ref.pageOptions.size *
                            Math.floor(
                              dataIndex / _this.$refs.Step1Ref.pageOptions.size
                            );
                        _this.$message({
                          showClose: true,
                          customClass: "is-fixed",
                          message: "当前页，第" + num + "条数据，" + res[1],
                          type: "warning"
                        });
                        _this.activeStep = 1;
                        // 不再往下进行
                        isContinue = false;
                        // 跳出外层循环
                        isBreakLoop = true;
                        // 跳出当前内层循环
                        return false;
                      }
                    }
                    // 验证身份证号
                    if (validator === "validateIdcard") {
                      let res = utilValidate.validateIdcard(
                        dataItem[fieldConfig.prop]
                      );
                      if (res[0] === "0") {
                        let current =
                          Math.floor(
                            dataIndex / _this.$refs.Step1Ref.pageOptions.size
                          ) + 1;
                        _this.$refs.Step1Ref.pageOptions.current = current;
                        _this.$refs.Step1Ref.tableData =
                          _this.$refs.Step1Ref.paginateArray();
                        let num =
                          dataIndex +
                          1 -
                          _this.$refs.Step1Ref.pageOptions.size *
                            Math.floor(
                              dataIndex / _this.$refs.Step1Ref.pageOptions.size
                            );
                        _this.$message({
                          showClose: true,
                          customClass: "is-fixed",
                          message: "当前页，第" + num + "条数据，" + res[1],
                          type: "warning"
                        });
                        _this.activeStep = 1;
                        // 不再往下进行
                        isContinue = false;
                        // 跳出外层循环
                        isBreakLoop = true;
                        // 跳出当前内层循环
                        return false;
                      }
                    }
                    // 验证联系电话
                    if (validator === "validateMobileAndTel") {
                      let res = utilValidate.validateMobileAndTel(
                        dataItem[fieldConfig.prop]
                      );
                      if (res[0] === "0") {
                        let current =
                          Math.floor(
                            dataIndex / _this.$refs.Step1Ref.pageOptions.size
                          ) + 1;
                        _this.$refs.Step1Ref.pageOptions.current = current;
                        _this.$refs.Step1Ref.tableData =
                          _this.$refs.Step1Ref.paginateArray();
                        let num =
                          dataIndex +
                          1 -
                          _this.$refs.Step1Ref.pageOptions.size *
                            Math.floor(
                              dataIndex / _this.$refs.Step1Ref.pageOptions.size
                            );
                        _this.$message({
                          showClose: true,
                          customClass: "is-fixed",
                          message: "当前页，第" + num + "条数据，" + res[1],
                          type: "warning"
                        });
                        _this.activeStep = 1;
                        // 不再往下进行
                        isContinue = false;
                        // 跳出外层循环
                        isBreakLoop = true;
                        // 跳出当前内层循环
                        return false;
                      }
                    }
                  }
                }
              );
              // 跳出当前外层循环
              if (isBreakLoop) {
                break;
              }
            }
          }
        }
      }
      // 验证表格数据通过，接着往下进行
      if (isContinue) {
        // 验证自动匹配
        let zrrOrZrjgIsAllRight = true; // 责任人和责任机构数据是否全部正确
        if (
          _this.$refs.Step1Ref.ishaveItem === "1" &&
          _this.$refs.Step1Ref.ishaveObject === "1"
        ) {
          if (_this.$refs.Step1Ref.isautoBoolean) {
            // 自动匹配时数据对象列表不能为空
            if (
              !_this.$refs.Step1Ref.objTableData ||
              _this.$refs.Step1Ref.objTableData.length === 0
            ) {
              _this.$message({
                showClose: true,
                customClass: "is-fixed",
                message: "自动匹配时数据对象列表不能为空！",
                type: "warning"
              });
              _this.activeStep = 1;
              return;
            }
            // 自动匹配时每个数据对象，责任人或责任机构不能同时为空
            if (
              _this.$refs.Step1Ref.objTableData &&
              _this.$refs.Step1Ref.objTableData.length > 0
            ) {
              _this.$refs.Step1Ref.objTableData.forEach((item) => {
                if (!item.ssyhsfzhm && !item.sjgsdwdm) {
                  _this.$message({
                    showClose: true,
                    customClass: "is-fixed",
                    message: "自动匹配时责任人或责任机构不能同时为空！",
                    type: "warning"
                  });
                  _this.activeStep = 1;
                  zrrOrZrjgIsAllRight = false;
                  return false;
                }
              });
            }
          }
        }
        // 下一步（自动匹配时每个数据对象，责任人或责任机构不全是空时，才可以向下提交）
        if (zrrOrZrjgIsAllRight) {
          _this.submitFormValidateStep2();
        }
      }
    },
    // 验证第2步
    submitFormValidateStep2() {
      let _this = this;
      _this.$refs.Step2Ref.$refs.formRef.validate((valid2) => {
        if (valid2) {
          // 通过，下一步
          _this.submitFormReally();
        } else {
          _this.activeStep = 2;
        }
      });
    },
    // 真正的提交
    submitFormReally() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        // step0
        taskContent: _this.$refs.Step0Ref.formData.taskContent,
        taskMode: _this.$refs.Step0Ref.formData.taskMode,
        taskLevel: _this.$refs.Step0Ref.formData.taskLevel,
        taskRwyq: _this.$refs.Step0Ref.formData.taskRwyq,
        fjxxs: _this.$refs.Step0Ref.$refs.fileListRef.idList,
        // step1
        ishaveItem: _this.$refs.Step1Ref.ishaveItem,
        ishaveObject: _this.$refs.Step1Ref.ishaveObject,
        isauto: _this.$refs.Step1Ref.isautoBoolean ? "1" : "0",
        items: [],
        rwObjects: [],
        // step2
        cycleState: _this.$refs.Step2Ref.formData.cycleState,
        startTime: _this.$refs.Step2Ref.formData.startTime,
        endTime: _this.$refs.Step2Ref.formData.endTime,
        cycleType: _this.$refs.Step2Ref.formData.cycleType,
        taskBllx: _this.$refs.Step2Ref.formData.taskBllx,
        cycleCustom: _this.$utilStr.splitArray(
          _this.$refs.Step2Ref.formData.cycleCustom,
          ","
        ),
        assignType: _this.$refs.Step2Ref.formData.assignType,
        assignValue: _this.$utilStr.splitArray(
          _this.$refs.Step2Ref.formData.orgIdList,
          ","
        ),
        allowAllMjDel: _this.$refs.Step2Ref.formData.allowAllMjDel
      };
      // 设置表单主键集合
      if (
        _this.$refs.Step1Ref.formTableData &&
        _this.$refs.Step1Ref.formTableData.length > 0
      ) {
        _this.$refs.Step1Ref.formTableData.forEach((item) => {
          dataParams.items.push(item.vo.formId);
        });
      }
      // 设置动态数据集合
      if (
        _this.$refs.Step1Ref.objTableData &&
        _this.$refs.Step1Ref.objTableData.length > 0
      ) {
        _this.$refs.Step1Ref.objTableData.forEach((item) => {
          dataParams.rwObjects.push(JSON.stringify(item));
        });
      }
      // 设置指派对象集合
      if (_this.$refs.Step2Ref.formData.assignType === "1") {
        dataParams.assignValue = _this.$utilStr.splitArray(
          _this.$refs.Step2Ref.formData.gmsfhmList,
          ","
        );
      } else if (_this.$refs.Step2Ref.formData.assignType === "2") {
        dataParams.assignValue = _this.$utilStr.splitArray(
          _this.$refs.Step2Ref.formData.orgIdList,
          ","
        );
      }
      // 如果是治安警种创建任务不需要审批，否则都需要审批
      let fn = addTask;
      // if (_this.$utilPublic.getUserInfo().jz != '01') {
      //   fn = addTaskSp;
      // }
      // Lambda写法
      fn(dataParams)
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
            _this.NewTaskCenterDisListCreate.handleQuery();
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.Step0Ref.resetForm();
      this.$refs.Step1Ref.resetForm();
      this.$refs.Step2Ref.resetForm();
      this.activeStep = 0;
    },
    // 上一步
    handlePresStep() {
      this.activeStep = this.activeStep - 1;
    },
    // 下一步
    handleNextStep() {
      this.activeStep = this.activeStep + 1;
      if (this.activeStep === 2) {
        if (this.$refs.Step1Ref.formTableData.length > 0) {
          this.$refs.Step2Ref.activeFormIdAllowAllDel =
            this.$refs.Step1Ref.formTableData[0].vo.allowAllMjDel;
          this.$refs.Step2Ref.getIsMultipleAssignmentsFormId(
            this.$refs.Step1Ref.formTableData
          );
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.con-all-pane {
  .con-all-step {
    padding: 16px 16px;
    .el-steps {
      margin-left: 18px;
      margin-bottom: 0;
      ::v-deep .el-step__head {
        &.is-success {
          color: #107cff;
          border-color: #107cff;
        }
        &.is-process {
          .el-step__icon {
            background-color: #107cff;
            border-color: #107cff;
            color: #ffffff;
          }
        }
        &.is-wait {
          color: #a3a3a3;
          border-color: #a3a3a3;
        }
      }
      ::v-deep .el-step__main {
        .el-step__title {
          margin-left: -19px;
          &.is-success {
            color: #107cff;
          }
          &.is-process {
            font-weight: inherit;
          }
          &.is-wait {
            color: #a3a3a3;
          }
        }
      }
    }
  }
  .con-all-page {
    padding: 12px;
  }
}
</style>

<style lang="scss">
.new-form-step {
  .el-dialog__body {
    padding: 12px !important;
  }
}
</style>
