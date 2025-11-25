<template>
  <el-dialog
    title="添加"
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
                            <el-form-item prop="gkdwlxList">
                              <el-checkbox-group v-model="formData.gkdwlxList">
                                <el-checkbox label="1">户籍地</el-checkbox>
                                <el-checkbox label="2">现住地</el-checkbox>
                                <el-checkbox label="4">事发地</el-checkbox>
                              </el-checkbox-group>
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
                          <span class="required">人员姓名</span>
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
                                prop="zdrylx"
                                v-model="formData.zdrylx"
                                :model-text.sync="extendData.zdrylx"
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

                    <!--户籍地区-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('1')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">户籍地区</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="hjRegionId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('1'),
                                  message: '请选择户籍地区',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <hd-region
                                prop="hjRegionId"
                                v-model="formData.hjRegionId"
                                selectLastLevel
                                :model-text.sync="extendData.hjRegionId"
                                ref="hjdq"
                                placeholder="请选择户籍地区"
                                :filterCity="false"
                                @currentChanged="updateHjRegionId"
                              ></hd-region>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--户籍地址-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('1')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">户籍地址</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="hjRegionAddress"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('1'),
                                  message: '请输入户籍地址',
                                  trigger: 'blur'
                                },
                                {
                                  validator: this.$utilValidate.validateBlank,
                                  trigger: 'blur'
                                }
                              ]"
                            >
                              <el-input
                                v-model="formData.hjRegionAddress"
                                placeholder="请输入户籍地址"
                                maxlength="500"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--户籍地机构-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('1')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">户籍地机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="hjOrgId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('1'),
                                  message: '请选择户籍地机构',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <biz-organ
                                prop="hjOrgId"
                                v-model="formData.hjOrgId"
                                :model-text.sync="extendData.hjOrgId"
                                placeholder="请选择户籍地机构"
                                showLevel="5"
                              ></biz-organ>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--现住地区-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('2')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">现住地区</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="xzRegionId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('2'),
                                  message: '请选择现住地区',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <hd-region
                                prop="xzRegionId"
                                v-model="formData.xzRegionId"
                                selectLastLevel
                                :model-text.sync="extendData.xzRegionId"
                                ref="xzdq"
                                placeholder="请选择现住地区"
                                @currentChanged="updateXzRegionId"
                              ></hd-region>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--现住地址-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('2')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">现住地址</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="xzRegionAddress"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('2'),
                                  message: '请输入现住地址',
                                  trigger: 'blur'
                                },
                                {
                                  validator: this.$utilValidate.validateBlank,
                                  trigger: 'blur'
                                }
                              ]"
                            >
                              <el-input
                                v-model="formData.xzRegionAddress"
                                placeholder="请输入现住地址"
                                maxlength="500"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--现住地机构-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('2')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">现住地机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="xzOrgId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('2'),
                                  message: '请选择现住地机构',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <biz-organ
                                prop="xzOrgId"
                                v-model="formData.xzOrgId"
                                :model-text.sync="extendData.xzOrgId"
                                placeholder="请选择现住地机构"
                                showLevel="5"
                              ></biz-organ>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--事发地区-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('4')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">事发地区</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="sfRegionId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('4'),
                                  message: '请选择事发地区',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <hd-region
                                prop="sfRegionId"
                                v-model="formData.sfRegionId"
                                selectLastLevel
                                :model-text.sync="extendData.sfRegionId"
                                ref="sfdq"
                                placeholder="请选择事发地区"
                                @currentChanged="updateSfRegionId"
                              ></hd-region>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--事发地址-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('4')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">事发地址</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="sfRegionAddress"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('4'),
                                  message: '请输入事发地址',
                                  trigger: 'blur'
                                },
                                {
                                  validator: this.$utilValidate.validateBlank,
                                  trigger: 'blur'
                                }
                              ]"
                            >
                              <el-input
                                v-model="formData.sfRegionAddress"
                                placeholder="请输入事发地址"
                                maxlength="500"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--事发地机构-->
                    <div
                      class="form-row"
                      v-if="formData.gkdwlxList.includes('4')"
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">事发地机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item
                              prop="sfOrgId"
                              :rules="[
                                {
                                  required: formData.gkdwlxList.includes('4'),
                                  message: '请选择事发地机构',
                                  trigger: 'change'
                                }
                              ]"
                            >
                              <biz-organ
                                prop="sfOrgId"
                                v-model="formData.sfOrgId"
                                :model-text.sync="extendData.sfOrgId"
                                placeholder="请选择事发地机构"
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
  name: "BizPersonAdd",
  provide() {
    return {
      PersonAdd: this
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
        zdrylx: [],
        gkdwlxList: [],
        hjRegionId: "",
        hjRegionAddress: "",
        hjOrgId: "",
        xzRegionId: "",
        xzRegionAddress: "",
        xzOrgId: "",
        sfRegionId: "",
        sfRegionAddress: "",
        sfOrgId: "",
        isNecessary: "",

        isTunnelBq: "1",

        // tdbqList: [],

        tybqList: [],
        tybqListText: [],
        isSp: ""
      },
      // 扩展表单
      extendData: {
        zdrylx: [],
        hjRegionId: "",
        hjOrgId: "",
        xzRegionId: "",
        xzOrgId: "",
        sfRegionId: "",
        sfOrgId: ""
      },
      gkdwlxMap: new Map([
        [
          "1",
          {
            label: "户籍地",
            value: "hj"
          }
        ],
        [
          "2",
          {
            label: "现住地",
            value: "xz"
          }
        ],
        [
          "4",
          {
            label: "事发地",
            value: "sf"
          }
        ]
      ]),
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
        gkdwlxList: [
          { required: true, message: "请选择管控单位类型", trigger: "change" }
        ],
        // tdbqList: [
        //   { required: true, message: '请选择待核查特定标签', trigger: 'change' }
        // ],
        tybqList: [
          { required: true, message: "请选择待核实通用标签", trigger: "change" }
        ]
      },
      // 显示
      visible: false,
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
    // 'formData.hjRegionId': function () {
    //   // 监听户籍地区变化，户籍地址也相应赋值
    //   if (this.$refs.hjdq.input) {
    //     this.formData.hjRegionAddress = this.$refs.hjdq.input;
    //   }
    // },
    // // 现住地区
    // 'formData.xzRegionId': function () {
    //   // 监听户籍地区变化，户籍地址也相应赋值
    //   if (this.$refs.xzdq.input) {
    //     this.formData.xzRegionAddress = this.$refs.xzdq.input;
    //   }
    // },
    // // 事发地区
    // 'formData.sfRegionId': function () {
    //   // 监听户籍地区变化，户籍地址也相应赋值
    //   if (this.$refs.sfdq.input) {
    //     this.formData.sfRegionAddress = this.$refs.sfdq.input;
    //   }
    // }
  },
  methods: {
    // 加载之前
    beforeLoadForm() {},
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
                  _this.formData.gkdwlxList.includes(item.gkdwlx)
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
          // 根据管控单位类型 构造人员信息
          let newData = [];
          _this.formData.gkdwlxList.forEach((e) => {
            //户籍地
            if (e === "1") {
              let person = {
                name: _this.formData.name,
                cardId: _this.formData.cardId
                  ? _this.formData.cardId.toUpperCase()
                  : "",
                zdrylx: _this.formData.zdrylx,
                zdrylxText: _this.extendData.zdrylx,
                regionId: _this.formData.hjRegionId,
                regionIdText: _this.extendData.hjRegionId,
                regionAddress: _this.formData.hjRegionAddress,
                orgId: _this.formData.hjOrgId,
                orgIdText: _this.extendData.hjOrgId,
                gkdwlx: e,
                gkdwlxText: "户籍地",
                id: _this.$utilStr.uuid(32, 16),
                isNewAdd: "1",
                isNecessary: _this.formData.isNecessary,
                isSp: _this.formData.isSp,
                isTunnelBq: _this.formData.isTunnelBq,
                // tdbqList: _this.formData.tdbqList,
                tybqList: _this.formData.tybqList,
                tybqListText: _this.formData.tybqListText
              };
              newData.push(person);
            }
            //现住地
            if (e === "2") {
              let person = {
                name: _this.formData.name,
                cardId: _this.formData.cardId
                  ? _this.formData.cardId.toUpperCase()
                  : "",
                zdrylx: _this.formData.zdrylx,
                zdrylxText: _this.extendData.zdrylx,
                regionId: _this.formData.xzRegionId,
                regionIdText: _this.extendData.xzRegionId,
                regionAddress: _this.formData.xzRegionAddress,
                orgId: _this.formData.xzOrgId,
                orgIdText: _this.extendData.xzOrgId,
                gkdwlx: e,
                gkdwlxText: "现住地",
                id: _this.$utilStr.uuid(32, 16),
                isNewAdd: "1",
                isNecessary: _this.formData.isNecessary,
                isSp: _this.formData.isSp,
                isTunnelBq: _this.formData.isTunnelBq,
                // tdbqList: _this.formData.tdbqList,
                tybqList: _this.formData.tybqList,
                tybqListText: _this.formData.tybqListText
              };
              newData.push(person);
            }
            //事发地
            if (e === "4") {
              let person = {
                name: _this.formData.name,
                cardId: _this.formData.cardId
                  ? _this.formData.cardId.toUpperCase()
                  : "",
                zdrylx: _this.formData.zdrylx,
                zdrylxText: _this.extendData.zdrylx,
                regionId: _this.formData.sfRegionId,
                regionIdText: _this.extendData.sfRegionId,
                regionAddress: _this.formData.sfRegionAddress,
                orgId: _this.formData.sfOrgId,
                orgIdText: _this.extendData.sfOrgId,
                gkdwlx: e,
                gkdwlxText: "事发地",
                id: _this.$utilStr.uuid(32, 16),
                isNewAdd: "1",
                isNecessary: _this.formData.isNecessary,
                isSp: _this.formData.isSp,
                isTunnelBq: _this.formData.isTunnelBq,
                // tdbqList: _this.formData.tdbqList,
                tybqList: _this.formData.tybqList,
                tybqListText: _this.formData.tybqListText
              };
              newData.push(person);
            }
          });
          //将数据给父对象
          _this.bizTunnelPerson.tableData =
            _this.bizTunnelPerson.tableData.concat(
              JSON.parse(JSON.stringify(newData))
            );
          _this.cancelForm();
          _this.handleLoading = false;
        }
      });
    },
    // 取消
    cancelForm() {
      this.resetForm();
      this.visible = false;
    },
    // 更新地区
    updateHjRegionId(data) {
      this.$set(this.formData, "hjRegionAddress", data.nameAll);
    },
    // 更新地区
    updateXzRegionId(data) {
      this.$set(this.formData, "xzRegionAddress", data.nameAll);
    },
    // 更新地区
    updateSfRegionId(data) {
      this.$set(this.formData, "sfRegionAddress", data.nameAll);
    },
    // 从关注人员信息获取获取人员信息
    handleBaseInfo1() {
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
        this.$refs.formRef.validateField("gkdwlxList", (errMsg) => {
          if (!errMsg) {
            resolve();
          } else {
            reject(errMsg);
          }
        });
      });

      Promise.all([validateCardId, validateGkdwlx]).then(() => {
        // 如果errMsg无值，则代表是正确的情况
        let _this = this;
        _this.cardIdQueryLoading = true;
        // 参数
        let dataParams = {
          cardId: _this.formData.cardId
        };
        // Lambda写法
        getPersonBaseInfo(dataParams)
          .then((response) => {
            //响应成功回调
            let { success, data } = response.data;
            if (success) {
              // 人员信息
              _this.formData.name = data.vo.xm || "";
              // 户籍地信息
              _this.formData.hjRegionId =
                data.vo.hjdzSsxqdm || data.vo.xjzdzSsxqdm;
              _this.extendData.hjRegionId =
                data.vox.hjdzSsxqdm || data.vox.xjzdzSsxqdm;

              _this.formData.hjRegionAddress =
                data.vo.hjdzQhnxxdz || data.vo.xjzdzQhnxxdz;

              _this.formData.hjOrgId = data.vo.sjgsdwdm;
              _this.extendData.hjOrgId = data.vox.sjgsdwdm;

              // 现住地信息
              _this.formData.xzRegionId =
                data.vo.xjzdzSsxqdm || data.vo.hjdzSsxqdm;
              _this.extendData.xzRegionId =
                data.vox.xjzdzSsxqdm || data.vox.hjdzSsxqdm;

              _this.formData.xzRegionAddress =
                data.vo.xjzdzQhnxxdz || data.vo.hjdzQhnxxdz;

              _this.formData.xzOrgId = data.vo.sjgsdwdm;
              _this.extendData.xzOrgId = data.vox.sjgsdwdm;

              // 事发地
              _this.formData.sfRegionId =
                data.vo.xjzdzSsxqdm || data.vo.hjdzSsxqdm;
              _this.extendData.sfRegionId =
                data.vox.xjzdzSsxqdm || data.vox.hjdzSsxqdm;

              _this.formData.sfRegionAddress =
                data.vo.xjzdzQhnxxdz || data.vo.hjdzQhnxxdz;

              _this.formData.sfOrgId = data.vo.sjgsdwdm;
              _this.extendData.sfOrgId = data.vox.sjgsdwdm;

              // 提示
              if (!_this.formData.name) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: "暂未获取到关注人员信息",
                  type: "warning"
                });
              }
            }
          })
          .catch((error) => {
            // 响应错误回调
          })
          .finally(() => {
            _this.cardIdQueryLoading = false;
          });
      });
    },
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

      // 创建校验gkdwlxList的Promise
      const validateGkdwlx = new Promise((resolve, reject) => {
        this.$refs.formRef.validateField("gkdwlxList", (errMsg) => {
          if (!errMsg) {
            resolve();
          } else {
            reject(errMsg);
          }
        });
      });

      Promise.all([validateCardId, validateGkdwlx])
        .then(() => {
          let _this = this;
          _this.cardIdQueryLoading = true;
          // 参数
          let dataParams = {
            cardId: _this.formData.cardId
          };

          // 使用Promise.all调用多个请求
          let promises = _this.formData.gkdwlxList.map((gkdwlx) => {
            let params = {
              ...dataParams,
              gkdwlx: gkdwlx
            };
            return zdryTunnelPersonSearch(params);
          });

          Promise.all(promises)
            .then((responses) => {
              responses.forEach((response, index) => {
                let { success, data } = response.data;
                if (success) {
                  let gkdwlx = _this.formData.gkdwlxList[index];
                  let prefix = _this.gkdwlxMap.get(gkdwlx).value;
                  let lxmc = _this.gkdwlxMap.get(gkdwlx).label;

                  // 依据类型前缀赋值
                  _this.formData.name = data.vo.xm || "";
                  _this.formData[`${prefix}OrgId`] = data.vo.orgId;
                  _this.extendData[`${prefix}OrgId`] = data.vox.orgId;
                  _this.formData[`${prefix}RegionId`] = data.vo.regionId;
                  _this.extendData[`${prefix}RegionId`] = data.vox.regionId;
                  _this.formData[`${prefix}RegionAddress`] =
                    data.vo.regionAddress;

                  // 提示
                  if (!data.vo.xm) {
                    _this.$message({
                      showClose: true,
                      customClass: "is-fixed",
                      message: `【${lxmc}】管控单位类型暂未获取到关注人员信息`,
                      type: "warning"
                    });
                  }
                }
              });
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
    // 重置
    resetForm() {
      this.formData.hjRegionAddress = "";
      this.formData.xzRegionAddress = "";
      this.formData.sfRegionAddress = "";
      this.formData = {
        name: "",
        cardId: "",
        zdrylx: [],
        gkdwlxList: [],
        hjRegionId: "",
        hjRegionAddress: "",
        hjOrgId: "",
        xzRegionId: "",
        xzRegionAddress: "",
        xzOrgId: "",
        sfRegionId: "",
        sfRegionAddress: "",
        sfOrgId: "",
        isNecessary: "",

        isTunnelBq: "1",
        // tdbqList: [],
        tybqList: [],
        tdbqListText: []
      };
      // 扩展表单
      this.extendData = {
        zdrylx: [],
        hjRegionId: "",
        hjOrgId: "",
        xzRegionId: "",
        xzOrgId: "",
        sfRegionId: "",
        sfOrgId: ""
      };
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped></style>
