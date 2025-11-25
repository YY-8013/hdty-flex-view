<template>
  <el-dialog title="编辑" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <!--肇事肇祸精神病人扩展信息-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-user-solid"></i>
              肇事肇祸精神病人扩展信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--确诊精神疾病类型-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">精神疾病类型</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="qzjsjblx">
                            <el-input
                              v-model="formData.qzjsjblx"
                              placeholder="请输入精神疾病类型"
                              maxlength="30"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--确诊医院名称-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">确诊医院名称</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="qzyyMc">
                            <el-input
                              v-model="formData.qzyyMc"
                              placeholder="请输入确诊医院名称"
                              maxlength="30"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--确诊医院地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>确诊医院地址</span>
                      </label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="qzyyDzmc">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.qzyyDzmc"
                              placeholder="请输入确诊医院地址"
                              maxlength="50"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--确诊日期-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>确诊日期</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="qzrq">
                            <hd-date-picker
                              type="date"
                              v-model="formData.qzrq"
                              value-format="yyyyMMdd"
                              placeholder="请选择确诊日期"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--卫生管理单位-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">卫生管理单位</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="wsgldw">
                            <el-input
                              v-model="formData.wsgldw"
                              placeholder="请输入卫生管理单位"
                              maxlength="30"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--居家监护情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>居家监护情况</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jjjhqk">
                            <el-input
                              v-model="formData.jjjhqk"
                              placeholder="请输入居家监护情况"
                              maxlength="30"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--是否实行强制医疗-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">是否实行强制医疗</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="sfzxqzylPdbs">
                            <hd-dict-radio
                              v-model="formData.sfzxqzylPdbs"
                              :model-text.sync="formData.sfzxqzylPdbsText"
                              :dict-code="$global.dictType.sfzxqzyl"
                              type="button"
                              filterable
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--执行强制医疗场所-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>执行强制医疗场所</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="zxqzylcs">
                            <el-input
                              v-model="formData.zxqzylcs"
                              placeholder="请输入执行强制医疗场所"
                              maxlength="30"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--执行强制医疗时间-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>执行强制医疗时间</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="zxqzylsj">
                            <hd-date-picker
                              type="date"
                              v-model="formData.zxqzylsj"
                              value-format="yyyyMMdd"
                              placeholder="请选择执行强制医疗时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--解除强制医疗时间-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>解除强制医疗时间</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jcqzylsj">
                            <hd-date-picker
                              type="date"
                              v-model="formData.jcqzylsj"
                              value-format="yyyyMMdd"
                              placeholder="请选择解除强制医疗时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--精神障碍危险性评估等级-->
                  <!-- <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">精神障碍危险性评估等级</label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jszawxxpgdjdm">
                            <hd-dict-select
                              v-model="formData.jszawxxpgdjdm"
                              :model-text.sync="formData.jszawxxpgdjdmText"
                              :dict-code="$global.dictType.jszawxxpgdj"
                              filterable
                              placeholder="请选择精神障碍危险性评估等级">
                            </hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>-->
                  <!--监护人姓名-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">监护人姓名</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhrXm">
                            <el-input
                              v-model="formData.jhrXm"
                              placeholder="请输入监护人姓名"
                              maxlength="25"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人身份证号-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">监护人身份证号</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhrGmsfhm">
                            <el-input
                              v-model="formData.jhrGmsfhm"
                              placeholder="请输入监护人身份证号"
                              maxlength="18"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--与患者关系-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">与患者关系</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="yhzgx">
                            <hd-dict-cascader
                              v-model="formData.yhzgx"
                              :model-text.sync="formData.yhzgxText"
                              :dict-code="$global.dictType.kzxxShgx"
                              filterable
                              placeholder="请选择与患者关系"
                              bigCascaderPane7
                            ></hd-dict-cascader>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人手机号码-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">监护人手机号码</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhrSjhm">
                            <el-input
                              v-model="formData.jhrSjhm"
                              placeholder="请输入监护人手机号码"
                              maxlength="11"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--现实状态-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>现实状态</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="xszt">
                            <hd-dict-select
                              v-model="formData.xszt"
                              :model-text.sync="formData.xsztText"
                              :dict-code="$global.dictType.xszt"
                              filterable
                              placeholder="请选择现实状态"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--数据来源库-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">数据来源库</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="sjlykdm">
                            <hd-dict-select
                              v-model="formData.sjlykdm"
                              :model-text.sync="formData.sjlykdmText"
                              :dict-code="$global.dictType.silyk"
                              filterable
                              placeholder="请选择数据来源库"
                            ></hd-dict-select>
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
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import { getPopulationInfo } from '@/api/common';

export default {
  name: 'BizZszhjsbrEdit',
  provide() {
    return {
      BizYybfshtrEdit: this
    };
  },
  inject: ['bizZszhjsbr'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        qzjsjblx: '',
        qzyyMc: '',
        qzyyDzmc: '',
        wsgldw: '',
        jjjhqk: '',
        sfzxqzylPdbs: '',
        sfzxqzylPdbsText: '',
        zxqzylcs: '',
        zxqzylsj: '',
        jcqzylsj: '',
        jszawxxpgdjdm: '',
        jszawxxpgdjdmText: '',
        jhrXm: '',
        jhrGmsfhm: '',
        yhzgx: '',
        yhzgxText: '',
        jhrSjhm: '',
        xszt: '',
        xsztText: '',
        sjlykdm: '',
        sjlykdmText: ''
      },
      // 验证
      rules: {
        qzjsjblx: [
          {
            required: true,
            message: '请输入确诊精神疾病类型',
            trigger: 'blur'
          },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        qzyyMc: [
          { required: true, message: '请输入确诊医院名称', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        wsgldw: [
          { required: true, message: '请输入卫生管理单位', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        sfzxqzylPdbs: [
          {
            required: true,
            message: '请选择是否实行强制医疗',
            trigger: 'change'
          }
        ],
        jszawxxpgdjdm: [
          {
            required: true,
            message: '请选择精神障碍危险性评估等级',
            trigger: 'change'
          }
        ],
        jhrXm: [
          { required: true, message: '请输入监护人姓名', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: 'blur'
          },
          { min: 2, max: 30, message: '请正确输入真实姓名', trigger: 'blur' }
        ],
        jhrGmsfhm: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: this.$utilValidate.validateIdcard, trigger: 'blur' }
        ],
        jhrSjhm: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: 'blur'
          }
        ],
        yhzgx: [
          {
            required: true,
            message: '请选择与患者关系',
            trigger: 'change'
          }
        ],
        sjlykdm: [
          {
            required: true,
            message: '请选择数据来源库',
            trigger: 'change'
          }
        ]
      },
      // 行
      row: {},
      // 行
      rowIndex: -1
    };
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
    // 确定
    submitForm() {
      let _this = this;
      if (_this.formData.sfzxqzylPdbs === '1') {
        _this.formData.sfzxqzylPdbsText = '是';
      } else if (_this.formData.sfzxqzylPdbs === '0') {
        _this.formData.sfzxqzylPdbsText = '否';
      } else {
        _this.formData.sfzxqzylPdbsText = '';
      }
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.jhrGmsfhm) {
            _this.formData.jhrGmsfhm = _this.formData.jhrGmsfhm.toUpperCase();
          }
          _this.$set(_this.formData, 'needEdit', false);

          _this.$emit('currentChange', _this.formData, _this.rowIndex);
          _this.cancelForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.sfzxqzylPdbsText = '';
      this.formData.jszawxxpgdjdmText = '';
      this.formData.yhzgxText = '';
      this.formData.xsztText = '';
      this.formData.sjlykdmText = '';
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-row {
  .label {
    width: 150px !important;
  }
}
</style>
