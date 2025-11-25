<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-tickets"></i>
                人员信息
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div class="body">
                  <div class="form">
                    <!--管控单位类型-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">管控单位类型</span>
                        </label>
                        <div class="p-div">
                          <div
                            class="text-div"
                            style="display: flex; align-items: center"
                          >
                            <el-form-item prop="gkdwlx">
                              <el-radio-group
                                v-model="formData.gkdwlx"
                                @input="gkdwlxChange"
                              >
                                <el-radio label="1">户籍地</el-radio>
                                <el-radio label="2">现住地</el-radio>
                                <el-radio label="4">事发地</el-radio>
                              </el-radio-group>
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
                                disabled
                                placeholder="请输入身份证号"
                                maxlength="18"
                              ></el-input>
                            </el-form-item>
                            <el-button
                              style="position: absolute; top: 5px; right: 0"
                              type="primary"
                              icon="el-icon-search"
                              @click="handleBaseInfo"
                              :loading="cardIdQueryLoading"
                              >关注人员信息获取</el-button
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--人员姓名-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">姓 名</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="name">
                              <el-input
                                v-model="formData.name"
                                placeholder="请输入人员姓名"
                                maxlength="15"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--人员标签-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">人员标签</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="zdrylx">
                              <hd-dict-cascader
                                v-model="formData.zdrylx"
                                :model-text.sync="formData.zdrylxText"
                                multiple
                                :dict-code="$global.dictType.zdrylxNew"
                                placeholder="请选择人员标签"
                                :removeOption="[
                                  $global.zdryLxType.qtgdyr,
                                  $global.zdryLxType.skry
                                ]"
                                bigCascaderPane7
                              ></hd-dict-cascader>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--地区-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">地 区</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="regionId">
                              <hd-region
                                v-model="formData.regionId"
                                selectLastLevel
                                :model-text.sync="formData.regionIdText"
                                ref="region"
                                placeholder="请选择地区"
                                @currentChanged="updateRegion"
                              ></hd-region>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--地址-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">地 址</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="regionAddress">
                              <el-input
                                v-model="formData.regionAddress"
                                placeholder="请输入地址"
                                maxlength="500"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--机构-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">机 构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="orgId">
                              <biz-organ
                                v-model="formData.orgId"
                                :model-text.sync="formData.orgIdText"
                                placeholder="请选择机构"
                                showLevel="5"
                              ></biz-organ>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--是否必须签收为关注人员-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>是否必须签收为关注人员</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <el-form-item prop="isNecessary">
                              <el-radio-group
                                v-model="formData.isNecessary"
                                size="mini"
                              >
                                <el-radio-button label
                                  >按下发批次</el-radio-button
                                >
                                <el-radio-button label="1">是</el-radio-button>
                                <el-radio-button label="0">否</el-radio-button>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--不列管关注人员是否走审批流程-->
                    <div
                      v-if="
                        formData.isNecessary === '0' ||
                        (batchIsNecessary !== '1' && !formData.isNecessary)
                      "
                      class="form-row"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>不列管关注人员是否走审批流程</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <el-form-item prop="isSp">
                              <el-radio-group
                                v-model="formData.isSp"
                                size="mini"
                              >
                                <el-radio-button label
                                  >按下发批次</el-radio-button
                                >
                                <el-radio-button label="1">是</el-radio-button>
                                <el-radio-button label="0">否</el-radio-button>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--是否按下发批次标签-->
                    <div
                      v-if="['01', '03'].includes(batchIssueType)"
                      class="form-row"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>是否按下发批次标签</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <el-form-item prop="isTunnelBq">
                              <el-radio-group
                                v-model="formData.isTunnelBq"
                                size="mini"
                              >
                                <el-radio-button label="1">是</el-radio-button>
                                <el-radio-button label="0">否</el-radio-button>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--通用标签-->
                    <div
                      v-if="
                        ['01', '03'].includes(batchIssueType) &&
                        formData.isTunnelBq === '0'
                      "
                      class="form-row"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">待核实通用标签</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <el-form-item prop="tybqList">
                              <hd-dict-checkbox
                                v-model="formData.tybqList"
                                :model-text.sync="formData.tybqListText"
                                multiple
                                type="button"
                                :dictCode="$global.dictType.zdryCgbq"
                              ></hd-dict-checkbox>
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
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import { getPersonBaseInfo, zdryTunnelPersonSearch } from "@/api/common";

export default {
  name: "BizPersonEdit",
  provide() {
    return {
      PersonEdit: this
    };
  },
  inject: ["bizTunnelPerson", "ZdryTnnnelManage"],
  mixins: [hdList, hdForm],
  data() {
    return {
      // 表单
      formData: {
        name: "",
        cardId: "",
        zdrylx: "",
        gkdwlx: "",
        regionId: "",
        regionAddress: "",
        orgId: "",

        isTunnelBq: "",

        // tdbqList: [],

        tybqList: [],
        tybqListText: [],

        isSp: ""
      },
      // 扩展表单
      extendData: {},
      // 验证
      rules: {
        name: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: "blur"
          },
          { min: 2, max: 30, message: "请正确输入真实姓名", trigger: "blur" }
        ],
        cardId: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: this.$utilValidate.validateIdcard, trigger: "blur" }
        ],
        zdrylx: [
          { required: true, message: "请选择人员类型", trigger: "change" }
        ],
        gkdwlx: [
          { required: true, message: "请选择管控单位类型", trigger: "change" }
        ],
        regionId: [
          { required: true, message: "请选择地区", trigger: "change" }
        ],
        regionAddress: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ],
        orgId: [{ required: true, message: "请选择机构", trigger: "change" }],

        tybqList: [
          { required: true, message: "请选择待核实通用标签", trigger: "change" }
        ]
      },
      // 显示
      visible: false,
      // 行
      row: {},
      cardIdQueryLoading: false
    };
  },
  computed: {
    // 批次通道下发类型
    batchIssueType() {
      return this.ZdryTnnnelManage.formData.issueType || "00";
    },
    // 批次通道下发  是否必须签收为关注人员
    batchIsNecessary() {
      return this.ZdryTnnnelManage.formData.isNecessary;
    }
  },
  watch: {
    // // 户籍地区
    // 'formData.regionId': function () {
    //   // 监听户籍地区变化，户籍地址也相应赋值
    //   if (this.$refs.region.input) {
    //     this.formData.regionAddress = this.$refs.region.input;
    //   }
    // }
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
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 身份证号转大写
          if (_this.formData.gmsfhm) {
            _this.formData.gmsfhm = _this.formData.gmsfhm.toUpperCase();
          }
          // 先验证身份证号+管控单位类型是否唯一
          let hasRepeatCardId = false;
          if (
            _this.bizTunnelPerson.tableData &&
            _this.bizTunnelPerson.tableData.length > 0
          ) {
            if (
              _this.bizTunnelPerson.tableData.find(
                (item) =>
                  item.cardId === _this.formData.cardId &&
                  item.gkdwlx === _this.formData.gkdwlx &&
                  item.id !== _this.formData.id
              )
            ) {
              hasRepeatCardId = true;
            }
          }
          if (hasRepeatCardId) {
            // 导入成功提示
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              message:
                "该【身份证号】已存在相同的【管控单位类型】，不能重复添加",
              type: "warning"
            });
            return;
          }
          _this.handleLoading = true;
          // 姓名内容中的“·”替换
          _this.formData.name = _this.$utilAll.getNameForDot(
            _this.formData.name
          );
          // 翻译管控单位类型
          _this.formData.gkdwlxText =
            _this.formData.gkdwlx === "1"
              ? "户籍地"
              : _this.formData.gkdwlx === "2"
              ? "现住地"
              : "事发地";
          let newData = {
            ..._this.formData,
            ..._this.extendData
          };
          let person = JSON.parse(JSON.stringify(newData));
          _this.bizTunnelPerson.tableData.forEach((item, index) => {
            if (item.id === person.id) {
              // 如果有该人员信息的话，直接替换该位置上的人员信息内容
              _this.bizTunnelPerson.tableData[index] = person;
            }
          });
          //将数据给父对象
          _this.bizTunnelPerson.tableData = JSON.parse(
            JSON.stringify(_this.bizTunnelPerson.tableData)
          );
          _this.visible = false;
          _this.handleLoading = false;
        }
      });
    },
    // 更新地区
    updateRegion(data) {
      this.$set(this.formData, "regionAddress", data.nameAll);
    },
    // 从关注人员信息获取人员信息
    handleBaseInfo() {
      // 创建校验cardId的Promise
      const validateCardId = new Promise((resolve, reject) => {
        this.$refs.formRef.validateField("cardId", (errMsg) => {
          if (!errMsg) {
            resolve();
          } else {
            reject(errMsg);
          }
        });
      });

      // 创建校验gkdwlx的Promise
      const validateGkdwlx = new Promise((resolve, reject) => {
        this.$refs.formRef.validateField("gkdwlx", (errMsg) => {
          if (!errMsg) {
            resolve();
          } else {
            reject(errMsg);
          }
        });
      });

      Promise.all([validateCardId, validateGkdwlx])
        .then(() => {
          // 如果errMsg无值，则代表是正确的情况
          let _this = this;
          _this.cardIdQueryLoading = true;
          // 参数
          let dataParams = {
            cardId: _this.formData.cardId,
            gkdwlx: _this.formData.gkdwlx
          };
          // Lambda写法
          zdryTunnelPersonSearch(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, data } = response.data;
              if (success) {
                // 提示
                if (!data.vo.xm) {
                  _this.$message({
                    showClose: true,
                    customClass: "is-fixed",
                    message: "暂未获取到关注人员信息",
                    type: "warning"
                  });
                  return;
                }
                // // 人员信息
                _this.formData.name = data.vo.xm || "";

                _this.formData.orgId = data.vo.orgId;
                _this.formData.orgIdText = data.vox.orgId;
                // 现住地 和 事发地

                // 户籍地和默认的用户籍地
                _this.formData.regionId = data.vo.regionId;
                _this.formData.regionIdText = data.vox.regionId;
                _this.formData.regionAddress = data.vo.regionAddress;
              }
            })
            .catch((error) => {
              // 响应错误回调
            })
            .finally(() => {
              _this.cardIdQueryLoading = false;
            });
        })
        .catch((error) => {
          // 如果任意一个字段校验失败，处理错误
        });
    },
    gkdwlxChange() {
      this.formData.regionId = "";
      this.formData.regionIdText = "";
      this.formData.regionAddress = "";
      this.formData.orgId = "";
      this.formData.orgIdText = "";
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
