<template>
  <el-dialog
    title="新增流动轨迹"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
    width="60%"
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <biz-form-card title="流动轨迹信息">
          <biz-form>
            <!-- 流动人员 -->
            <biz-form-row>
              <biz-form-item label="人员姓名" :required="false" :span="12">
                <el-form-item>
                  <span>{{ formData.gzryXm }}</span>
                </el-form-item>
              </biz-form-item>
              <biz-form-item label="身份证号" :required="false" :span="12">
                <el-form-item>
                  <span>{{ formData.gzrySfzhm }}</span>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item label="流动类型" :required="false" :span="24">
                <el-form-item>
                  <span v-show="ldType === '02'">流出</span>
                  <span v-show="ldType === '01'">流入</span>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流动时间 -->
            <biz-form-row>
              <biz-form-item label="流动时间" :required="true" :span="24">
                <el-form-item prop="ldsj">
                  <hd-date-picker
                    type="datetime"
                    v-model="formData.ldsj"
                    align="left"
                    value-format="yyyyMMddHHmmss"
                    placeholder="请选择流动时间"
                  ></hd-date-picker>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row>
              <biz-form-item label="流出地址" :required="false" :span="24">
                <el-form-item prop="lcdQhnxxdz">
                  <biz-bzdz-new
                    v-model="formData.lcdDzbm"
                    :model-text.sync="formData.lcdQhnxxdz"
                    ywName
                    :isYw="false"
                    :disabled="true"
                    @handleGlbzdz="(info) => handleGlbzdz(info, 'lcd')"
                  ></biz-bzdz-new>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row>
              <biz-form-item
                label="流出地补充地址"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lcdBcdz">
                  <el-input
                    disabled
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    v-model="formData.lcdBcdz"
                    placeholder="请输入流出地补充地址"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流出地区 -->
            <biz-form-row v-if="false">
              <biz-form-item label="流出地区" :required="false" :span="24">
                <el-form-item prop="lcdq">
                  <hd-region
                    v-model="formData.lcdq"
                    :model-text.sync="formData.lcdqText"
                    placeholder="请选择流出地区"
                    @currentChanged="
                      (val, old, data) =>
                        updateRegionAddress(data, 'formData', 'lcdz')
                    "
                    :disabled="true"
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流出地址 -->
            <biz-form-row v-if="false">
              <biz-form-item
                label="流出地址"
                :required="true"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lcdz">
                  <el-input
                    v-model="formData.lcdz"
                    placeholder="请输入流出详细地址"
                    maxlength="200"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流出地机构 -->
            <biz-form-row>
              <biz-form-item
                label="流出地机构"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lcdOrgId">
                  <hd-organ
                    v-model="formData.lcdOrgId"
                    :model-text.sync="formData.lcdOrgIdText"
                    :filterCode="userInfo.orgId.substring(0, 4) + '00000000'"
                    checkLevel="5"
                    showLevel="5"
                    placeholder="请选择流出地机构"
                    :disabled="true"
                  ></hd-organ>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row v-if="ldType === '02'">
              <biz-form-item label="是否流出本市" :required="true" :span="24">
                <el-form-item prop="sflcbs">
                  <hd-dict-radio
                    v-model="formData.sflcbs"
                    :dict-code="$global.dictType.isOrNot"
                  ></hd-dict-radio>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row v-if="ldType === '01' || formData.sflcbs === '0'">
              <biz-form-item
                label="流入地址"
                :required="ldType === '01'"
                :span="24"
              >
                <el-form-item
                  prop="lrdQhnxxdz"
                  :rules="[
                    {
                      required: ldType === '01',
                      message: '请输入流入地址',
                      trigger: 'change'
                    }
                  ]"
                >
                  <biz-bzdz-new
                    v-model="formData.lrdDzbm"
                    :model-text.sync="formData.lrdQhnxxdz"
                    ywName
                    :sjgsdwdm="lrFilterOrgId"
                    :isYw="false"
                    @handleGlbzdz="(info) => handleGlbzdz(info, 'lrd')"
                  ></biz-bzdz-new>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row v-if="ldType === '01' || formData.sflcbs === '0'">
              <biz-form-item
                label="流入地补充地址"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lrdBcdz">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    v-model="formData.lrdBcdz"
                    placeholder="请输入流入地补充地址"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流入地区 -->
            <biz-form-row v-if="false">
              <biz-form-item label="流入地区" :required="true" :span="24">
                <el-form-item prop="lrdq">
                  <hd-region
                    v-model="formData.lrdq"
                    :model-text.sync="formData.lrdqText"
                    placeholder="请选择流入地区"
                    @currentChanged="
                      (val, old, data) =>
                        updateRegionAddress(data, 'formData', 'lrdz')
                    "
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流入地址 -->
            <biz-form-row v-if="false">
              <biz-form-item
                label="流入地址"
                :required="true"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lrdz">
                  <el-input
                    v-model="formData.lrdz"
                    placeholder="请输入流入详细地址"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流入地机构 -->
            <biz-form-row v-if="ldType === '01' || formData.sflcbs === '0'">
              <biz-form-item
                label="流入地机构"
                :required="true"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lrdOrgId">
                  <hd-organ
                    v-model="formData.lrdOrgId"
                    :model-text.sync="formData.lrdOrgIdText"
                    :filterCode="lrFilterOrgId"
                    :checkLevel="lrdOrgCheckLevel"
                    showLevel="5"
                    placeholder="请选择流入地机构"
                  ></hd-organ>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <!-- 流入地机构 -->
            <biz-form-row v-if="ldType === '01'">
              <biz-form-item
                label="流入地所在辖区<br/>派出所联系电话"
                :required="true"
                :span="12"
                pClass="p-divs"
              >
                <el-form-item prop="lrdPcslxdh">
                  <el-input
                    v-model="formData.lrdPcslxdh"
                    placeholder="请输入派出所联系电话"
                    maxlength="13"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
              <biz-form-item
                label="流入地所在辖区<br/>分局联系电话"
                :required="false"
                :span="12"
                pClass="p-divs"
              >
                <el-form-item prop="lrdFjlxdh">
                  <el-input
                    v-model="formData.lrdFjlxdh"
                    placeholder="请输入分局联系电话"
                    maxlength="13"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流动原因 -->
            <biz-form-row>
              <biz-form-item
                label="流动原因"
                :required="true"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="ldyy">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.ldyy"
                    placeholder="请输入流动原因"
                    maxlength="500"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 备注 -->
            <biz-form-row>
              <biz-form-item
                label="备  注"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="memo">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.memo"
                    placeholder="请输入备注"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
          </biz-form>
        </biz-form-card>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import { add } from "./api";

export default {
  name: "BizXwgjAdd",
  provide() {
    return {
      BizXwgjAdd: this
    };
  },
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      userInfo: this.$utilPublic.getUserInfo(),

      ldType: "",
      lrFilterOrgId: "", // 标准地址的过滤
      // 表单信息
      formData: {
        gzryId: "",
        gzrySfzhm: "",
        gzryXm: "",

        ldsj: "", // 流动时间
        lcdq: "", // 流出地区
        lcdqText: "", // 流出地区
        lcdOrgId: "", // 流出地机构
        lcdOrgIdText: "", // 流出地机构
        lcdz: "", // 流出地址
        lrdq: "", // 流入地区
        lrdqText: "", // 流入地区
        lrdOrgId: "", // 流入机构
        lrdOrgIdText: "", // 流入机构
        lrdz: "", // 流入地址
        ldyy: "", // 流动原因
        memo: "", // 备注

        lcdDzbm: "", // 流出地 地址编码
        lcdQhnxxdz: "", //流出地 地址翻译

        lcdSsjlxdzbm: "", // 流出地 所属街路巷地址编码
        lcdSsjzwdzbm: "", // 流出地 所属建筑物地址编码
        lcdJzwlx: "", // 流出地 建筑物类型

        lcdBcdz: "", //流出地 补充地址

        lrdDzbm: "", //流入地 地址编码
        lrdQhnxxdz: "", //流入地 地址翻译

        lrdSsjlxdzbm: "", // 流入地 所属街路巷地址编码
        lrdSsjzwdzbm: "", //流入地  所属建筑物地址编码
        lrdJzwlx: "", // 流入地 建筑物类型

        lrdBcdz: "", // 流入地 补充地址

        sflcbs: "0", // 是否流出本市

        lrdPcslxdh: "", // 派出所联系电话
        lrdFjlxdh: "" //分局联系电话
      },
      // 验证规则
      rules: {
        ldsj: [
          { required: true, message: "请选择流动时间", trigger: "change" }
        ],
        lcdq: [
          { required: true, message: "请选择流出地区", trigger: "change" }
        ],
        lcdz: [{ required: true, message: "请输入流出地址", trigger: "blur" }],
        lcdOrgId: [
          { required: false, message: "请选择流出地机构", trigger: "change" }
        ],
        lrdq: [
          { required: true, message: "请选择流入地区", trigger: "change" }
        ],
        lrdz: [{ required: true, message: "请输入流入地址", trigger: "blur" }],
        ldyy: [{ required: true, message: "请输入流动原因", trigger: "blur" }],
        lrdOrgId: [
          { required: true, message: "请选择流入地机构", trigger: "change" }
        ],

        lrdQhnxxdz: [
          { required: true, message: "请输入流入地址", trigger: "blur" }
        ],
        lcdQhnxxdz: [
          { required: false, message: "请输入流出地址", trigger: "blur" }
        ],
        sflcbs: [
          { required: true, message: "请选择是否流出本市", trigger: "change" }
        ],
        lrdPcslxdh: [
          { required: true, message: "请输入派出所联系电话", trigger: "blur" },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: "blur"
          }
        ],
        lrdFjlxdh: [
          { required: false, message: "请输入派出所联系电话", trigger: "blur" },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: "blur"
          }
        ]
      },
      // 行
      row: { vo: {}, vox: {} },
      lrdOrgCheckLevel: [],
      lrdOrgFilter: ""
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.resetForm();
        _this.initData();
      });
    },
    initData() {
      let _this = this;
      let currentTime = this.$utilDate.getCurrentDatetime();
      // 流入
      let currentUserOrgId = this.userInfo.orgId;
      let currentUserOrgName = this.userInfo.orgName;
      let currentUserPcsOrId = this.userInfo.pcsOrgId;
      let currentUserPcsOrgName = this.userInfo.pcsOrgName;
      let currentUserOrgLevel = this.userInfo.orgLevel;
      this.$set(this.formData, "ldsj", currentTime);
      this.$set(this.formData, "gzryId", this.row.vo.zdrybm);
      this.$set(this.formData, "gzrySfzhm", this.row.vo.gmsfhm);
      this.$set(this.formData, "gzryXm", this.row.vo.xm);

      // 01 流入
      if (this.ldType === "01") {
        this.lrFilterOrgId = "";
        this.lrdOrgCheckLevel = ["5"];

        this.$set(this.formData, "lcdOrgId", this.row.vo.pcsOrgId);
        this.$set(this.formData, "lcdOrgIdText", this.row.vox.pcsOrgId);

        this.$set(this.formData, "lcdQhnxxdz", this.row.vo.xzdQhnxxdz);
        this.$set(this.formData, "lcdDzbm", this.row.vo.xzdDzbm);
        this.$set(this.formData, "lcdSsjlxdzbm", this.row.vo.xzdSsjlxdzbm);
        this.$set(this.formData, "lcdSsjzwdzbm", this.row.vo.xzdSsjzwdzbm);
        this.$set(this.formData, "lcdJzwlx", this.row.vo.xzdJzwlx);

        this.$set(this.formData, "lcdBcdz", this.row.vo.xzdBcdz);

        this.$set(this.formData, "lcdPointBdLat", this.row.vo.pointBdLat);
        this.$set(this.formData, "lcdPointBdLon", this.row.vo.pointBdLon);
        this.$set(this.formData, "lcdPointGpsLat", this.row.vo.pointGpsLat);
        this.$set(this.formData, "lcdPointGpsLon", this.row.vo.pointGpsLon);

        // this.$set(this.formData, 'lcdq', this.row.vo.xjzdzSsxqdm);
        // this.$set(this.formData, 'lcdqText', this.row.vox.xjzdzSsxqdm);
        // this.$set(this.formData, 'lcdz', this.row.vo.xjzdzQhnxxdz);

        // 派出所及以下下用户默认将当前派出所赋值
        if (currentUserOrgLevel >= 5) {
          this.$set(this.formData, "lrdOrgId", currentUserPcsOrId);
          this.$set(this.formData, "lrdOrgIdText", currentUserPcsOrgName);
        }

        // this.$set(this.formData, 'lrdq', currentUserRegionId);
        // this.$set(this.formData, 'lrdqText', currentUserRegionName);

        // this.$set(this.formData, 'lrdz', currentUserRegionName);
      }
      // 02 流出
      else if (this.ldType === "02") {
        this.lrFilterOrgId =
          this.$utilPublic.getUserInfo().orgId.substr(0, 4) + "00000000";
        this.lrdOrgCheckLevel = ["4", "5"];

        this.$set(this.formData, "lcdOrgId", this.row.vo.pcsOrgId);
        this.$set(this.formData, "lcdOrgIdText", this.row.vox.pcsOrgId);

        this.$set(this.formData, "lcdQhnxxdz", this.row.vo.xzdQhnxxdz);
        this.$set(this.formData, "lcdDzbm", this.row.vo.xzdDzbm);
        this.$set(this.formData, "lcdSsjlxdzbm", this.row.vo.xzdSsjlxdzbm);
        this.$set(this.formData, "lcdSsjzwdzbm", this.row.vo.xzdSsjzwdzbm);
        this.$set(this.formData, "lcdJzwlx", this.row.vo.xzdJzwlx);

        this.$set(this.formData, "lcdBcdz", this.row.vo.xzdBcdz);

        // this.$set(this.formData, 'lcdq', currentUserRegionId);
        // this.$set(this.formData, 'lcdqText', currentUserRegionName);

        // this.$set(this.formData, 'lcdz', currentUserRegionName);
      }
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          _this.handleLoading = true;
          let dataParams = {
            ..._this.formData,
            ldType: _this.ldType
          };
          console.log("dataParams", dataParams);

          add(dataParams)
            .then((response) => {
              let { success, msg } = response.data;
              if (success) {
                _this.$message.success(msg);
                _this.cancelForm();
                _this.$emit("update-list");
              }
            })
            .catch(console.error)
            .finally(() => {
              _this.handleLoading = false;
            });
        } else {
          _this.scrollIntoFormErrorView(error);
        }
      });
    },
    // 重置
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    handleGlbzdz(jzwinfo, preField) {
      console.log("所选地址信息", jzwinfo);
      let {
        dzbm,
        jzwlx,
        jzwbm,
        label,
        ssjlxxqDzbm,
        bdLat,
        bdLon,
        gpsLat,
        gpsLon
      } = jzwinfo;
      let dzInfo = {
        Dzbm: dzbm, //地址编码
        Qhnxxdz: label, //地址翻译

        Ssjlxdzbm: ssjlxxqDzbm, // 所属街路巷地址编码
        Ssjzwdzbm: jzwbm, // 所属建筑物地址编码
        Jzwlx: jzwlx, // 建筑物类型

        PointBdLat: bdLat,
        PointBdLon: bdLon,
        PointGpsLat: gpsLat,
        PointGpsLon: gpsLon
      };

      for (const key in dzInfo) {
        this.$set(this.formData, `${preField}${key}`, dzInfo[key]);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
