<template>
  <el-dialog
    title="追加指派人员"
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
                指派
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div class="body">
                  <!-- 逐级指派 并且任务不允许任意级别处理-->
                  <div
                    v-if="zpType === '1' && row.vo.allowAllMjDel !== '1'"
                    class="form"
                  >
                    <!-- 可办理任务的用户机构级别 -->
                    <div class="form-row form-row-radio-button">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>
                            可办理任务的
                            <br />用户机构级别
                          </span>
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
                    <!--已指派人员-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">已指派人员</label>
                        <div class="p-div p-div3">
                          <div class="text-div" style="overflow: auto">
                            <el-form-item prop="userIdList">
                              <el-tag
                                v-for="(item, index) in userList"
                                :key="index"
                                type="success"
                                size="mini"
                                closable
                                @close="removeUser(item)"
                                style="margin-right: 5px"
                              >
                                {{ item.username }}
                              </el-tag>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--追加指派人员-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">追加指派人员</label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="userIdList">
                              <hd-mj-select
                                v-if="visible"
                                ref="mjRef"
                                prop="userIdList"
                                :orgId="row.vo.sjgsdwdm.substr(0, 8) + '0000'"
                                :orgName="row.vox.sjgsdwdm"
                                v-model="formData.userIdList"
                                :model-text.sync="extendData.userIdList"
                                :isQueryAll="row.vo.allowAllMjDel"
                                multiple
                                title="追加指派人员"
                                placeholder="请选择追加指派人员"
                              ></hd-mj-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--备注-->
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
                  <!-- 可跨级指派 或任务允许任意级别处理-->
                  <div v-else class="form">
                    <!-- 可办理任务的用户机构级别 -->
                    <div class="form-row form-row-radio-button">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>
                            可办理任务的
                            <br />用户机构级别
                          </span>
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
                    <!--已指派人员-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">已指派人员</label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="userIdList">
                              <el-tag
                                v-for="(item, index) in userList"
                                :key="index"
                                type="success"
                                size="mini"
                                closable
                                @close="removeUser(item)"
                                style="margin-right: 5px"
                              >
                                {{ item.username }}
                              </el-tag>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--指派人员-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label"> 追加指派人员 </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="userIdList">
                              <hd-mj-select
                                ref="mjRef"
                                prop="userIdList"
                                multiple
                                :orgId="row.vo.sjgsdwdm.substr(0, 8) + '0000'"
                                :orgName="row.vox.sjgsdwdm"
                                v-model="formData.userIdList"
                                :model-text.sync="extendData.userIdList"
                                :isQueryAll="row.vo.allowAllMjDel"
                                title="追加指派人员"
                                placeholder="请选择追加指派人员"
                              ></hd-mj-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--备注-->
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
import { apendAssign, getOrgDetail } from "./../api";
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
        orgRecodeId: "",
        userIdList: [],
        deleteIds: [],
        addIds: [],
        memo: ""
      },
      // 表单扩展
      extendData: {
        userIdList: [],
        sjgsdwdm: ""
      },
      // 验证
      rules: {
        // userIdList: [
        //   { required: true, message: '请选择指派人员', trigger: 'change' }
        // ],
        memo: [
          {
            validator: this.$utilValidate.validateSpecialCharacters,
            trigger: "blur"
          }
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
      // 已指派人员
      userList: [],

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
      _this.$nextTick(() => {
        _this.formData.orgRecodeId = _this.row.vo.taskorgrecodeid;
        // 重置表单
        _this.resetForm();
        // 获取已指派人员
        _this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        id: _this.row.vo.taskorgrecodeid
      };
      // Lambda写法
      getOrgDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.userList = data.taskUserList;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.$refs.formRef.clearValidate();
        });
    },
    // 删除的指派人员
    removeUser(item) {
      this.formData.deleteIds.push(item.userid);
      this.userList.splice(
        this.userList.findIndex((u) => u.userid === item.userid),
        1
      );
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          // _this.submitting = true;
          // 设置追加指派人
          _this.formData.addIds = _this.formData.userIdList.filter(
            (item) => _this.userList.findIndex((u) => u.userid === item) < 0
          );
          if (_this.formData.addIds.length + _this.userList.length <= 0) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              message: "请至少指派一个民警",
              type: "warning"
            });
            return;
          }
          // 参数
          let dataParams = {
            ..._this.formData
          };
          // Lambda写法
          apendAssign(dataParams)
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
