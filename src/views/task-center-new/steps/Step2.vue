<template>
  <div class="con-single-step">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
      <hd-component :model="extendData" ref="componentRef">
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-document"></i>
              指派对象
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div slot="header" class="clearfix">
                <div class="base">
                  <i class="el-icon-date"></i>
                  任务时间
                </div>
              </div>
              <div class="body">
                <div class="form">
                  <!--任务时间类型-->
                  <div class="form-row form-row-radio-button">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务时间类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleState">
                            <el-radio-group
                              v-model="formData.cycleState"
                              size="small"
                            >
                              <el-radio-button label="1" key="1"
                                >单次任务</el-radio-button
                              >
                              <el-radio-button label="2" key="2"
                                >周期任务</el-radio-button
                              >
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务开始时间、任务结束时间-->
                  <div class="form-row">
                    <div class="form-item-12 form-item">
                      <label class="label">
                        <span class="required">任务开始时间</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="startTime">
                            <hd-date-picker
                              type="datetime"
                              v-model="formData.startTime"
                              value-format="yyyyMMddHHmmss"
                              placeholder="请选择任务开始时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-12 form-item">
                      <label class="label">
                        <span class="required">任务结束时间</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="endTime">
                            <hd-date-picker
                              type="datetime"
                              default-time="23:59:59"
                              v-model="formData.endTime"
                              value-format="yyyyMMddHHmmss"
                              placeholder="请选择任务结束时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务周期类型-->
                  <div class="form-row" v-if="formData.cycleState === '2'">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务周期类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleType">
                            <hd-dict-radio
                              v-model="formData.cycleType"
                              :dict-code="$global.dictType.rwTimeType"
                              type="button"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--自定义周期-->
                  <div
                    class="form-row form-row-checkbox-button"
                    v-if="
                      formData.cycleState === '2' && formData.cycleType === '5'
                    "
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span
                          :class="formData.cycleType === '5' ? 'required' : ''"
                          >自定义周期</span
                        >
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleCustom">
                            <el-checkbox-group
                              v-model="formData.cycleCustom"
                              size="small"
                            >
                              <el-checkbox-button label="星期一" key="1"
                                >星期一</el-checkbox-button
                              >
                              <el-checkbox-button label="星期二" key="2"
                                >星期二</el-checkbox-button
                              >
                              <el-checkbox-button label="星期三" key="3"
                                >星期三</el-checkbox-button
                              >
                              <el-checkbox-button label="星期四" key="4"
                                >星期四</el-checkbox-button
                              >
                              <el-checkbox-button label="星期五" key="5"
                                >星期五</el-checkbox-button
                              >
                              <el-checkbox-button label="星期六" key="6"
                                >星期六</el-checkbox-button
                              >
                              <el-checkbox-button label="星期日" key="7"
                                >星期日</el-checkbox-button
                              >
                            </el-checkbox-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="con-card box-card">
              <div slot="header" class="clearfix">
                <div class="base">
                  <i class="el-icon-user-solid"></i>
                  指派对象
                </div>
              </div>
              <div class="body" v-if="showZpdx()">
                <div class="form">
                  <!--任务办理类型-->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="isMultipleAssignmentsFormId"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务办理类型</span>
                      </label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <div
                            class="hdty-danger-color"
                            style="font-size: 15px"
                          >
                            提示：
                            任务指派后，同一单位中任何一人办理完成，该单位任务办结。所有人全部办理：任务指派后，所有人全部办理完成，任务办结。
                          </div>
                        </div>
                        <div class="text-div" style="margin-top: 40px">
                          <el-form-item prop="taskBllx">
                            <hd-dict-radio
                              v-model="formData.taskBllx"
                              :dict-code="$global.dictType.taskHandleType"
                              type="button"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--指派类型-->
                  <div class="form-row form-row-radio-button">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">指派类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="assignType">
                            <el-radio-group
                              v-model="formData.assignType"
                              size="small"
                            >
                              <el-radio-button label="1"
                                >指派人员</el-radio-button
                              >
                              <el-radio-button label="2"
                                >指派机构</el-radio-button
                              >
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--是否允许任意级别办理-->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="false && activeFormIdAllowAllDel === '1'"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          是否允许
                          <br />任意级别办理
                        </span>
                      </label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <div
                            class="hdty-danger-color"
                            style="font-size: 15px"
                          >
                            提示：
                            选择“是”任务允许各级别机构的民警处理，选择“否”仅允许派出所民警处理。
                          </div>
                        </div>
                        <div class="text-div" style="margin-top: 40px">
                          <el-form-item prop="allowAllMjDel">
                            <el-radio-group
                              v-model="formData.allowAllMjDel"
                              size="small"
                            >
                              <el-radio-button label="1">是</el-radio-button>
                              <el-radio-button label="0">否</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--指派人员-->
                  <div class="form-row" v-if="formData.assignType === '1'">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span
                          :class="formData.assignType === '1' ? 'required' : ''"
                          >指派人员</span
                        >
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="gmsfhmList">
                            <hd-mj-select
                              ref="mjRef"
                              prop="gmsfhmList"
                              valueField="vo.gmsfhm"
                              v-model="formData.gmsfhmList"
                              :model-text.sync="extendData.gmsfhmList"
                              :orgId="
                                $utilPublic.getUserInfo().orgId.substr(0, 8) +
                                '0000'
                              "
                              :isQueryAll="activeFormIdAllowAllDel"
                              multiple
                              title="指派人员"
                              placeholder="请选择指派人员"
                            ></hd-mj-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--指派机构-->
                  <div class="form-row" v-if="formData.assignType === '2'">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span
                          :class="formData.assignType === '2' ? 'required' : ''"
                          >指派机构</span
                        >
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="orgIdList">
                            <hd-organ
                              prop="orgIdList"
                              v-model="formData.orgIdList"
                              :model-text.sync="extendData.orgIdList"
                              multiple
                              :checkLevel="rwBaseConfig.checkLevel"
                              :showLevel="rwBaseConfig.orgLevel"
                              title="指派机构"
                              placeholder="请选择指派机构"
                            ></hd-organ>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 可办理任务的用户机构级别 -->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="
                      formData.assignType === '2' &&
                      activeFormIdAllowAllDel === '1'
                    "
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          可办理任务的
                          <br />用户机构级别
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="allowAllMjDel">
                            <el-radio-group
                              v-model="formData.allowAllMjDel"
                              size="small"
                            >
                              <el-radio-button label="0"
                                >只有{{
                                  rwBaseConfig.orgLevelText
                                }}级别</el-radio-button
                              >
                              <el-radio-button label="1"
                                >任意机构级别</el-radio-button
                              >
                              <el-radio-button label="2"
                                >只有选中机构对应的级别</el-radio-button
                              >
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body" v-else>
                <div class="con-empty-ppdx text-color-2">
                  <i class="el-icon-warning"></i>
                  <span style="margin-left: 8px">已自动匹配指派对象</span>
                </div>
                <div class="form">
                  <!--任务办理类型-->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="isMultipleAssignmentsFormId"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务办理类型</span>
                      </label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <div
                            class="hdty-danger-color"
                            style="font-size: 15px"
                          >
                            提示：
                            任务指派后，同一单位中任何一人办理完成，该单位任务办结。所有人全部办理：任务指派后，所有人全部办理完成，任务办结。
                          </div>
                        </div>
                        <div class="text-div" style="margin-top: 40px">
                          <el-form-item prop="taskBllx">
                            <hd-dict-radio
                              v-model="formData.taskBllx"
                              :dict-code="$global.dictType.taskHandleType"
                              type="button"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--是否允许任意级别办理-->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="false && activeFormIdAllowAllDel === '1'"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          是否允许
                          <br />任意级别办理
                        </span>
                      </label>
                      <div class="p-div" style="height: auto">
                        <div class="text-div">
                          <el-form-item prop="allowAllMjDel">
                            <el-radio-group
                              v-model="formData.allowAllMjDel"
                              size="small"
                            >
                              <el-radio-button label="1">是</el-radio-button>
                              <el-radio-button label="0">否</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 可办理任务的用户机构级别 -->
                  <div
                    class="form-row form-row-radio-button"
                    v-if="activeFormIdAllowAllDel === '1'"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          可办理任务的
                          <br />用户机构级别
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="allowAllMjDel">
                            <el-radio-group
                              v-model="formData.allowAllMjDel"
                              size="small"
                            >
                              <el-radio-button label="0"
                                >只有{{
                                  rwBaseConfig.orgLevelText
                                }}级别</el-radio-button
                              >
                              <el-radio-button label="1"
                                >任意机构级别</el-radio-button
                              >
                              <el-radio-button label="2"
                                >只有选中机构对应的级别</el-radio-button
                              >
                            </el-radio-group>
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
  </div>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import HdMjSelect from "./../../usergrid/plugs/hd-mj-select/index.vue";

export default {
  name: "Step2",
  provide() {
    return {
      Step2: this
    };
  },
  inject: ["NewTaskCenterDisAdd"],
  mixins: [hdForm],
  components: {
    HdMjSelect
  },
  data() {
    return {
      // 表单
      formData: {
        startTime: "",
        endTime: "",
        cycleState: "",
        cycleType: "",
        cycleCustom: [],
        assignType: "",
        gmsfhmList: [],
        orgIdList: [],
        allowAllMjDel: "",
        taskBllx: "1"
      },
      // 表单扩展
      extendData: {
        gmsfhmList: [],
        orgIdList: []
      },
      // 验证
      rules: {
        startTime: [
          { required: true, message: "请选择任务开始时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择任务结束时间", trigger: "change" }
        ],
        cycleState: [
          { required: true, message: "请选择任务时间类型", trigger: "change" }
        ],
        cycleType: [
          { required: true, message: "请选择任务周期类型", trigger: "change" }
        ],
        cycleCustom: [
          { required: true, message: "请选择自定义周期", trigger: "change" }
        ],
        assignType: [
          { required: true, message: "请选择指派类型", trigger: "change" }
        ],
        gmsfhmList: [
          { required: true, message: "请选择指派人员", trigger: "change" }
        ],
        orgIdList: [
          { required: true, message: "请选择指派机构", trigger: "change" }
        ],
        allowAllMjDel: [
          {
            required: true,
            message: "请选择可办理任务的用户机构级别",
            trigger: "change"
          }
        ]
      },
      // 人员信息列表
      gmsfhmList: [],
      // 机构信息列表
      orgIdList: [],
      // 当前选择的标准件-是否允许所有民警处理
      activeFormIdAllowAllDel: "",
      // 当前选择的标准件-是否是支持多指派的任务表单
      isMultipleAssignmentsFormId: false,

      rwBaseConfig: {
        orgLevel: 4,
        orgLevelText: "分局",
        checkLevel: []
      }
    };
  },
  watch: {
    "formData.cycleState": function (val) {
      // 如果是单次任务，则开始时间默认为今天
      if (val === "1") {
        this.formData.startTime = this.$utilDate.dateFtt(
          new Date(),
          "yyyyMMddHHmmss"
        );
      }
    },
    "formData.startTime": function (val) {
      // 开始时间必须小于结束时间
      if (
        this.formData.endTime &&
        this.formData.startTime >= this.formData.endTime
      ) {
        this.formData.startTime = "";
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "开始时间必须小于结束时间",
          type: "warning"
        });
      }
    },
    "formData.endTime": function (val) {
      // 开始时间必须小于结束时间
      if (
        this.formData.startTime &&
        this.formData.endTime <= this.formData.startTime
      ) {
        this.formData.endTime = "";
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "结束时间必须大于开始时间",
          type: "warning"
        });
      }
    },

    "formData.assignType": function (val) {
      // 如果是指派人员，判断是否已经选择了标准件
      this.formData.allowAllMjDel = "";

      if (val === "1") {
        if (
          this.NewTaskCenterDisAdd.$refs.Step1Ref.formTableData.length === 0
        ) {
          this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请先选择表单",
            type: "warning"
          });
          this.NewTaskCenterDisAdd.activeStep = 1;
        }

        if (this.activeFormIdAllowAllDel === "1") {
          this.formData.allowAllMjDel = "1";
        } else {
          this.formData.allowAllMjDel = "0";
        }
      }
    }
  },
  created() {
    this.initOrgLevel();
  },
  methods: {
    initOrgLevel() {
      let _this = this;
      let configValue = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "rwBaseConfig");

      if (configValue && configValue.value) {
        let baseConfig = JSON.parse(configValue.value);
        this.rwBaseConfig = baseConfig;
      }
    },
    // 获取当前选择的标准件-是否是支持多指派的任务表单
    getIsMultipleAssignmentsFormId(formTableData) {
      // 获取移交需要填写已核实地址的配置
      let configValue = this.$storage.session
        .get("configData")
        .find(
          (e) => e.key === "RW" && e.keyItem === "multipleAssignmentsFormId"
        );
      if (configValue && configValue.value && formTableData.length > 0) {
        let arry = configValue.value.split(",");
        this.isMultipleAssignmentsFormId = arry.find(
          (e) => e === formTableData[0].vo.formId
        )
          ? true
          : false;
      } else {
        this.isMultipleAssignmentsFormId = false;
      }
    },
    // 是否显示指派对象
    showZpdx() {
      let res = true;
      if (this.NewTaskCenterDisAdd.$refs.Step1Ref.isautoBoolean) {
        res = false;
      }
      return res;
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 是否显示上级民警
    showSjMj(formTableData) {
      if (formTableData.length > 0) {
        this.activeFormId = formTableData[0].vo.formId;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.con-single-step {
  width: 100%;
  height: 100%;
  .form-row-checkbox-button {
    ::v-deep .el-checkbox-group {
      .el-checkbox-button {
        .el-checkbox-button__inner {
          border-color: #e8e8e8;
          background-color: #fff;
        }
        &.is-checked {
          .el-checkbox-button__inner {
            border-color: #1194fb;
            background-color: #1194fb;
          }
        }
      }
    }
  }
  .form-row-radio-button {
    ::v-deep .el-radio-group {
      .el-radio-button {
        .el-radio-button__inner {
          border-color: #e8e8e8;
          background-color: #fff;
        }
        &.is-checked {
          .el-radio-button__inner {
            border-color: #1194fb;
            background-color: #1194fb;
          }
        }
      }
    }
  }
  .con-empty-ppdx {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    i {
      font-size: 17px;
      margin-top: -2px;
    }
  }
}
</style>
