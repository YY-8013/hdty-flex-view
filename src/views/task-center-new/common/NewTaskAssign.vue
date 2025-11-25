<template>
  <el-dialog
    title="指派"
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
              <div class="head"><i class="el-icon-time"></i> 指派</div>
            </div>

            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div class="body form">
                  <!-- 可办理任务的用户机构级别 -->
                  <div class="form-row form-row-radio-button">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>可办理任务的<br />用户机构级别</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="allowAllMjDel">
                            <el-radio-group
                              disabled
                              :value="row.vo.allowAllMjDel"
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

                  <!-- 指派类型（通用显示） -->
                  <div
                    v-if="showAssignType"
                    class="form-row form-row-radio-button"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">指派类型</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="assignType">
                            <el-radio-group
                              v-model="formData.assignType"
                              size="small"
                            >
                              <el-radio-button label="1">人员</el-radio-button>
                              <el-radio-button label="2">机构</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 指派机构 -->
                  <div
                    v-if="
                      visible &&
                      (showAssignType ? formData.assignType === '2' : showZpOrg)
                    "
                    class="form-row"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label required">
                        <span class="required">指派机构</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="sjgsdwdmList">
                            <hd-organ
                              v-model="formData.sjgsdwdmList"
                              multiple
                              :checkLevel="orgCheckLevel"
                              :showLevel="orgShowLevel"
                              placeholder="请选择指派机构"
                            ></hd-organ>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 指派人员 -->
                  <div
                    v-if="
                      visible &&
                      (showAssignType
                        ? formData.assignType === '1'
                        : showZpUser)
                    "
                    class="form-row"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label"
                        ><span class="required">指派人员</span></label
                      >
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="userIdList">
                            <hd-mj-select
                              ref="mjRef"
                              prop="userIdList"
                              multiple
                              :orgId="
                                $utilPublic.getUserInfo().orgId.substr(0, 8) +
                                '0000'
                              "
                              :orgName="$utilPublic.getUserOrgName()"
                              v-model="formData.userIdList"
                              :model-text.sync="extendData.userIdList"
                              :isQueryAll="row.vo.allowAllMjDel"
                              placeholder="请选择指派人员"
                            ></hd-mj-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 任务办理类型（仅多指派表单显示） -->
                  <div
                    v-if="isMultipleAssignmentsFormId"
                    class="form-row form-row-radio-button"
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务办理类型</span>
                      </label>
                      <div class="p-div p-div4">
                        <div class="text-div">
                          <div
                            class="hdty-danger-color"
                            style="font-size: 15px"
                          >
                            提示：任务指派后，同一单位中任何一人办理完成，该单位任务办结。
                          </div>
                          <div
                            class="hdty-danger-color"
                            style="
                              font-size: 15px;
                              margin-left: 48px;
                              margin-top: -8px;
                            "
                          >
                            所有人全部办理：任务指派后，所有人全部办理完成，任务办结。
                          </div>
                        </div>
                        <div class="text-div" style="margin-top: 65px">
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

                  <!-- 备注 -->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">指派原因</label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="memo">
                            <el-input
                              type="textarea"
                              :rows="3"
                              placeholder="请输入指派原因"
                              v-model="formData.memo"
                            />
                          </el-form-item>
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
import { doZpOrRlTask } from "./../api";
import HdMjSelect from "./../../usergrid/plugs/hd-mj-select/index.vue";

export default {
  name: "NewTaskAssign",
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
        assignType: "",
        userIdList: [],
        sjgsdwdm: "",
        sjgsdwdmList: [],
        flag: "3", // 3指派 4认领,
        // 任务办理类型
        taskBllx: "",
        memo: ""
      },
      // 表单扩展
      extendData: {
        userIdList: [],
        sjgsdwdm: ""
      },
      // 验证
      rules: {
        assignType: [
          { required: true, message: "请选择指派类型", trigger: "change" }
        ],
        sjgsdwdm: [
          { required: true, message: "请选择指派机构", trigger: "change" }
        ],
        sjgsdwdmList: [
          { required: true, message: "请选择指派机构", trigger: "change" }
        ],
        userIdList: [
          { required: true, message: "请选择指派人员", trigger: "change" }
        ],
        memo: [
          {
            validator: this.$utilValidate.validateSpecialCharacters,
            trigger: "blur"
          }
        ],
        taskBllx: [
          { required: true, message: "请选择任务办理类型", trigger: "change" }
        ]
      },
      // 任务主键
      taskId: [],
      // 指派类型
      zpType: "1",
      row: {
        vo: {},
        vox: {}
      },
      // 当前选择的标准件-是否是支持多指派的任务表单
      isMultipleAssignmentsFormId: false,
      // 是否批量
      isPl: false,
      rwBaseConfig: {
        orgLevel: 4,
        orgLevelText: "分局",
        checkLevel: []
      },

      showZpUser: false, // 能否指派到人
      showZpOrg: false, // 能否指派机构
      orgShowLevel: 4, // 能展示到什么机构级别
      orgCheckLevel: [] // 能选择什么机构级别
    };
  },
  computed: {
    // 是否显示“指派类型”选择
    showAssignType() {
      // 多指派、跨级任务都显示
      return this.showZpOrg && this.showZpUser;
    }
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
        _this.formData.taskBllx = _this.row.vo.taskBllx || "";
        _this.getIsMultipleAssignmentsFormId();
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.submitting = true;
          let sjgsdwdmList = [];
          if (
            _this.formData.sjgsdwdmList &&
            _this.formData.sjgsdwdmList.length > 0
          ) {
            sjgsdwdmList = _this.formData.sjgsdwdmList;
          } else {
            sjgsdwdmList = _this.formData.sjgsdwdm
              ? [_this.formData.sjgsdwdm]
              : [];
          }
          // 参数
          let dataParams = {
            id: _this.taskId,
            ..._this.formData,
            sjgsdwdmList: sjgsdwdmList
          };
          // Lambda写法
          doZpOrRlTask(dataParams)
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
      this.formData.userIdList = [];
      this.formData.sjgsdwdm = "";
      this.extendData.userIdList = [];
      this.extendData.sjgsdwdm = "";
    },
    // 获取当前选择的标准件-是否是支持多指派的任务表单
    getIsMultipleAssignmentsFormId() {
      if (this.isPl) {
        // this.row = {
        //   vo: {},
        //   vox: {}
        // };
      }
      // 获取移交需要填写已核实地址的配置
      let configValue = this.$storage.session
        .get("configData")
        .find(
          (e) => e.key === "RW" && e.keyItem === "multipleAssignmentsFormId"
        );
      if (configValue && configValue.value) {
        let arry = configValue.value.split(",");
        this.isMultipleAssignmentsFormId = arry.find(
          (e) => e === this.row.vo.formId
        )
          ? true
          : false;
      } else {
        this.isMultipleAssignmentsFormId = false;
      }
    },
    getCheckLevel() {
      if (this.$utilPublic.getUserOrgLevel() < 4) {
        return ["4"];
      } else if (this.$utilPublic.getUserOrgLevel() < 5) {
        return ["5"];
      } else {
        return ["6", "7"];
      }
    },
    // 能展示哪些机构
    getShowLevel() {
      let _this = this;
      // 当前用户机构级别
      let currentUserOrgLevel = Number(_this.$utilPublic.getUserOrgLevel());
      // 系统最小用户机构级别
      let minUserOrgLevel = Number(_this.rwBaseConfig.orgLevel);
      // 当前用户指派类型，逐级指派 1  跨级指派 2
      let zpType = _this.zpType;
      // 当前任务可办理机构任务级别 0:只有【系统最小用户机构级别】可办理，【1】任意机构可办理  【2】指定用户机构可办理
      let allowAllMjDel = _this.row.vo.allowAllMjDel;

      // 能否指派到人
      let showZpUser = true;
      // 能否指派机构
      let showZpOrg = true;
      // 指派机构 能展示到什么机构级别
      let orgShowLevel = minUserOrgLevel;
      // 指派机构 能选择什么机构级别
      let orgCheckLevel = [];

      // 0 只有【系统最小用户机构级别】可办理
      if (["0", "1"].includes(allowAllMjDel)) {
        showZpOrg = currentUserOrgLevel < minUserOrgLevel;
        if (showZpOrg) {
          orgShowLevel = minUserOrgLevel;
          if (zpType === "1") {
            orgCheckLevel = [currentUserOrgLevel + 1];
            showZpUser = false;
          } else {
            const levels = [];
            for (let i = currentUserOrgLevel + 1; i <= minUserOrgLevel; i++) {
              levels.push(i);
            }
            orgCheckLevel = levels;
          }
        }
      }

      // 【2】指定机构办理
      if (allowAllMjDel === "2") {
        showZpOrg = false;
        showZpUser = true;
      }

      console.log("能否指派机构", showZpOrg);
      console.log("能否指派人员", showZpOrg);
      console.log("指派机构 能展示到什么机构级别", orgShowLevel);
      console.log("指派机构 能选择什么机构级别", orgCheckLevel);

      _this.showZpOrg = showZpOrg;
      _this.showZpUser = showZpUser;
      _this.orgShowLevel = orgShowLevel;
      _this.orgCheckLevel = orgCheckLevel;
    }
  }
};
</script>

<style lang="scss" scoped></style>
