<template>
  <el-dialog
    title="数据抽取"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit v-loading="loading">
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
                <i class="el-icon-document"></i>
                抽取条件
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div class="body">
                  <div
                    style="
                      margin-bottom: 16px;
                      font-size: 14px;
                      padding: 0 3px;
                      color: #ff7000;
                    "
                  >
                    <i
                      class="el-icon-warning-outline"
                      style="font-size: 15px"
                    ></i>
                    注意：必须选择抽取条件！
                  </div>
                  <div class="form">
                    <!--管辖机构（所有情况都显示）-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>管辖机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="sjgsdwdm">
                              <hd-organ
                                prop="sjgsdwdm"
                                v-model="formData.sjgsdwdm"
                                :model-text.sync="extendData.sjgsdwdm"
                                placeholder="请选择管辖机构"
                              ></hd-organ>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--社区/行政村（机构）过滤条件-->
                    <div v-if="row.etlType === '6'" class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>社区/行政村/警格名称</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div" style="width: 100%">
                            <el-form-item prop="sjgsdwmc">
                              <el-input
                                v-model="formData.sjgsdwmc"
                                placeholder="请输入社区/行政村/警格名称"
                                maxlength="18"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--人员姓名（关注人员、实有人口显示）-->
                    <div
                      class="form-row"
                      v-if="
                        row.etlType === '1' ||
                        row.etlType === '2' ||
                        row.etlType === '4'
                      "
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>人员姓名</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="xm">
                              <el-input
                                v-model="formData.xm"
                                placeholder="请输入人员姓名"
                                maxlength="15"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--身份证号（关注人员、实有人口显示）-->
                    <div
                      class="form-row"
                      v-if="
                        row.etlType === '1' ||
                        row.etlType === '2' ||
                        row.etlType === '4'
                      "
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>身份证号</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="gmsfhm">
                              <el-input
                                v-model="formData.gmsfhm"
                                placeholder="请输入身份证号"
                                maxlength="18"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--人员类型（关注人员显示）-->
                    <div
                      class="form-row"
                      v-if="row.etlType === '1' && !row.etlYwlb"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>人员类型</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="zdrylx">
                              <hd-dict-cascader
                                prop="zdrylx"
                                v-model="formData.zdrylx"
                                :model-text.sync="extendData.zdrylx"
                                :dict-code="$global.dictType.zdrylxNew"
                                multiple
                                placeholder="请选择人员类型"
                                :removeOption="['999900000000']"
                                bigCascaderPane7
                              ></hd-dict-cascader>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--人员类型（实有人口显示）-->
                    <div class="form-row" v-if="row.etlType === '2'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>人员类型</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="rylx">
                              <hd-dict-select
                                prop="rylx"
                                v-model="formData.rylx"
                                :model-text.sync="extendData.rylx"
                                :dictCode="$global.dictType.personType"
                                multiple
                                filterable
                                placeholder="请选择人员类型"
                                :visibleOption="['1', '2', '6']"
                              ></hd-dict-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--民  族（实有人口显示）-->
                    <div class="form-row" v-if="row.etlType === '2'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>民 族</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="rylx">
                              <hd-dict-select
                                prop="mzdm"
                                v-model="formData.mzdm"
                                :model-text.sync="extendData.mzdm"
                                :dictCode="$global.dictType.nation"
                                multiple
                                filterable
                                placeholder="请选择民族"
                              ></hd-dict-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--户籍地区（实有人口显示）-->
                    <div class="form-row" v-if="row.etlType === '2'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>户籍地区</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="hjdzSsxqdm">
                              <hd-region
                                prop="hjdzSsxqdm"
                                v-model="formData.hjdzSsxqdm"
                                :model-text.sync="extendData.hjdzSsxqdm"
                                placeholder="请选择户籍地区"
                                :filterCity="false"
                              ></hd-region>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--单位类别（实有单位显示）-->
                    <div class="form-row">
                      <div
                        class="form-item-24 form-item"
                        v-if="row.etlType === '3' && !row.etlYwlb"
                      >
                        <label class="label">
                          <span>单位类别</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="ywlb">
                              <hd-dict-cascader
                                prop="ywlb"
                                v-model="formData.ywlb"
                                :model-text.sync="extendData.ywlb"
                                :dict-code="$global.dictType.unitcategory"
                                multiple
                                :check-strictly="false"
                                placeholder="请选择单位类别"
                                bigCascaderPane7
                                @currentChanged="handleChangedYwlb"
                              ></hd-dict-cascader>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--单位类别  细类 -->
                    <div class="form-row">
                      <div
                        class="form-item-24 form-item"
                        v-if="showYwlbDwlx && !row.etlYwlb"
                      >
                        <label class="label">
                          <span>单位细类</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item label prop="ywlbDwlx">
                              <el-select
                                v-model="formData.ywlbDwlx"
                                clearable
                                placeholder="请选择细类"
                                multiple
                              >
                                <el-option
                                  v-for="item in subclass"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--单位名称（实有单位显示）-->
                    <div class="form-row" v-if="row.etlType === '3'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>单位名称</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="dwmc">
                              <el-input
                                v-model="formData.dwmc"
                                placeholder="请输入单位名称"
                                maxlength="200"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--矛盾 抽取（实有单位显示）-->
                    <div class="form-row" v-if="row.etlType === '5'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>事件名称</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="conflictName">
                              <el-input
                                v-model="formData.conflictName"
                                placeholder="请输入事件名称"
                                maxlength="200"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--矛盾 抽取（实有单位显示）-->
                    <div class="form-row" v-if="row.etlType === '5'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>事件类别</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="thingsType">
                              <hd-dict-cascader
                                prop="thingsType"
                                v-model="formData.thingsType"
                                :model-text.sync="extendData.thingsType"
                                :dict-code="$global.dictType.sjlb"
                                multiple
                                placeholder="请选择事件类别"
                                bigCascaderPane7
                              ></hd-dict-cascader>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--比对预警完成时间后(人员预警显示)-->
                    <div
                      class="form-row"
                      v-if="row.etlType === '4' && row.formId === '114'"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>起始时间</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="time">
                              <hd-date-picker
                                type="datetime"
                                v-model="formData.time"
                                placeholder="请选择起始时间"
                              ></hd-date-picker>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 矛盾纠纷排查化解、回访：117、551-->
                    <div class="form-row" v-if="row.formId === '551'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>化解日期</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="eventDatetime">
                              <hd-date-picker
                                type="daterange"
                                v-model="formData.eventDatetime"
                                placeholder="请选择化解日期"
                                underline
                              ></hd-date-picker>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 矛盾纠纷排查化解、回访：117、551-->
                    <div
                      class="form-row"
                      v-if="row.formId === '117' || row.formId === '551'"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>采集时间</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="createTime">
                              <hd-date-picker
                                type="datetimerange"
                                v-model="formData.createTime"
                                placeholder="请选择采集时间"
                                underline
                              ></hd-date-picker>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--鄂尔多斯警情 抽取-->
                    <div class="form-row" v-if="row.etlType === '7'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>报警内容</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="bjnr">
                              <el-input
                                v-model="formData.bjnr"
                                placeholder="请输入报警内容"
                                maxlength="200"
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
      <el-button type="primary" @click="submitForm">抽取并导入</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import { getExtractPage } from "./../api";

import { getTree } from "@/api/dict-item";

export default {
  name: "NewTaskObjectExtract",
  provide() {
    return {
      NewTaskObjectExtract: this
    };
  },
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {
        sjgsdwdm: "",
        xm: "",
        gmsfhm: "",
        zdrylx: [],
        rylx: [],
        mzdm: [],
        thingsType: [],
        hjdzSsxqdm: "",
        ywlb: [],
        dwmc: "",
        conflictName: "",
        time: "", // 比对预警完成时间后
        ywlbDwlx: [],
        sjgsdwmc: "", // 社区/行政村（机构）过滤条件

        createTime: [],
        eventDatetime: [],

        bjnr: "" // 报警内容
      },
      factorData: {
        xmFilterFactor: this.$app.factorOptions.matchOpe.between,
        gmsfhmFilterFactor: this.$app.factorOptions.matchOpe.between,
        dwmcFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表单扩展
      extendData: {
        sjgsdwdm: "",
        zdrylx: [],
        rylx: [],
        mzdm: [],
        hjdzSsxqdm: "",
        ywlb: [],
        thingsType: []
      },
      // 验证
      rules: {},
      // 行
      row: {
        formId: "", // 表单主键
        etlType: "", // 抽取类型（1：关注人员，2：实有人口，3：实有单位）
        etlYwlb: ""
      },

      // 细类
      subclassList: [],
      subclass: [],
      showYwlbDwlx: false
    };
  },
  mounted() {},
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 获取智慧内保单位明细
      this.getSubclassList();
    },
    // 提交
    submitForm() {
      let _this = this;
      // 先验证
      if (_this.row.etlType === "1") {
        if (
          !_this.formData.sjgsdwdm &&
          !_this.formData.xm &&
          !_this.formData.gmsfhm &&
          (!_this.formData.zdrylx || _this.formData.zdrylx.length === 0)
        ) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }
      if (_this.row.etlType === "2") {
        if (
          !_this.formData.sjgsdwdm &&
          !_this.formData.xm &&
          !_this.formData.gmsfhm &&
          (!_this.formData.rylx || _this.formData.rylx.length === 0) &&
          (!_this.formData.mzdm || _this.formData.mzdm.length === 0) &&
          !_this.formData.hjdzSsxqdm
        ) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }
      if (_this.row.etlType === "3") {
        if (
          !_this.formData.sjgsdwdm &&
          (!_this.formData.ywlb || _this.formData.mzdm.ywlb === 0) &&
          !_this.formData.dwmc
        ) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }
      if (_this.row.etlType === "4") {
        if (
          !_this.formData.sjgsdwdm &&
          !_this.formData.xm &&
          !_this.formData.gmsfhm
        ) {
          if (!_this.row.formId === "114" || !_this.formData.time) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              message: "请至少选择一项查询条件",
              type: "warning"
            });
            return;
          }
        }
      }
      if (_this.row.etlType === "5") {
        if (
          !_this.formData.sjgsdwdm &&
          !_this.formData.conflictName &&
          (!_this.formData.thingsType || _this.formData.thingsType.length === 0)
        ) {
          if (["117"].includes(_this.row.formId)) {
            if (
              !_this.formData.createTime ||
              _this.formData.createTime.length === 0
            ) {
              _this.$message({
                showClose: true,
                customClass: "is-fixed",
                message: "请至少选择一项查询条件",
                type: "warning"
              });
              return;
            }
          } else {
            if (["551"].includes(_this.row.formId)) {
              if (
                (!_this.formData.createTime ||
                  _this.formData.createTime.length === 0) &&
                (!_this.formData.eventDatetime ||
                  _this.formData.eventDatetime.length === 0)
              ) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: "请至少选择一项查询条件",
                  type: "warning"
                });
                return;
              }
            }
          }
        }
      }
      if (_this.row.etlType === "6") {
        if (!_this.formData.sjgsdwdm && !_this.formData.sjgsdwmc) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }
      if (_this.row.etlType === "3" && !!_this.row.etlYwlb) {
        if (!_this.formData.sjgsdwdm && !_this.formData.dwmc) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }

      if (_this.row.etlType === "7") {
        if (!_this.formData.sjgsdwdm && !_this.formData.bjnr) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "请至少选择一项查询条件",
            type: "warning"
          });
          return;
        }
      }

      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            formId: _this.row.formId,
            ..._this.formData,
            ..._this.factorData
          };
          // if (_this.row.formId === '116') {
          //   dataParams.zdrylx = ['070000000000'];
          // }
          // if (_this.row.formId === '119') {
          //   dataParams.zdrylx = ['060000000000'];
          // }
          // 默认查旅馆页
          if (["111", "118"].includes(_this.row.formId)) {
            // dataParams.ywlb = ['50'];
          }
          // 洗浴按摩等场所日常检查
          if (["120"].includes(_this.row.formId)) {
            // dataParams.ywlb = ['6'];
            // dataParams.ywlbDwlx = ['6-01'];
          }
          // 歌舞游戏
          if (["121"].includes(_this.row.formId)) {
            // dataParams.ywlb = ['6'];
            // dataParams.ywlbDwlx = ['6-02', '6-03'];
          }
          // 矛盾纠纷定期回访
          if (["551"].includes(_this.row.formId)) {
            dataParams.isYhj = "1";
          }
          // 矛盾纠纷排查
          if (["117"].includes(_this.row.formId)) {
            dataParams.isYhj = "0";
          }
          // Lambda写法
          getExtractPage(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, data } = response.data;
              if (success) {
                if (data.length > 0) {
                  // if (data.length <= 100) {
                  // 提示信息放外层、去重之后进行相关提示
                  // _this.$message({
                  //   showClose: true,
                  //   customClass: 'is-fixed',
                  //   message: '数据抽取成功！共计【' + data.length + '】条。',
                  //   type: 'success'
                  // });
                  _this.$emit("currentChange", data);
                  _this.cancelForm();
                  // } else {
                  //   _this.errorMsg('只能抽取小于100条数据！');
                  // }
                } else {
                  _this.errorMsg("暂无满足条件的数据！");
                }
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
    // 获取智慧内单位明细
    getSubclassList() {
      let _this = this;
      // 参数
      let dataParams = {
        lazy: "0",
        typeId: this.$global.dictType.subclass
      };
      getTree(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            _this.subclassList = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 单位类别改变清空单位信息-除地址外
    handleChangedYwlb() {
      console.log("当前已选单位类别", this.formData.ywlb);
      // 只选一个的情况下判断当前类型是否有细类
      if (this.formData.ywlb && this.formData.ywlb.length === 1) {
        // 获取细类
        let subclassfind = this.subclassList.find(
          (e) => e.key === this.formData.ywlb[0]
        );
        this.formData.ywlbDwlx = [];
        this.subclass = [];
        if (subclassfind) {
          this.subclass = subclassfind.children;
          this.showYwlbDwlx = true;
        }
      } else {
        // 清空细类的可选项以及当前细类的选中值
        this.formData.ywlbDwlx = [];
        this.subclass = [];
        this.showYwlbDwlx = false;
      }
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      console.log("重置了");
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
      if (this.$refs.componentRe) {
        this.$refs.componentRef.resetFields();
      }
      this.showYwlbDwlx = false;
    },

    // 错误提示
    errorMsg(msg) {
      this.$message({
        showClose: true,
        customClass: "is-fixed",
        message: msg,
        type: "warning"
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
