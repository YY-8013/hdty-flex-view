<template>
  <el-dialog title="新增" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-user-solid"></i>
              故意犯罪刑满释放不满五年的人员扩展信息
            </div>
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <div class="form-row">
                  <!--案件名称-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">案件名称</span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="ajmc">
                          <el-input v-model="formData.ajmc" placeholder="请输入案件名称" maxlength="60"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--案件类别-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">案件类别</span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="ajlb">
                          <hd-dict-cascader
                            v-model="formData.ajlb"
                            placeholder="请选择案件类别"
                            :model-text.sync="formData.ajlbText"
                            :dict-code="$global.dictType.ajlb"
                            filterable
                          ></hd-dict-cascader>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <!--简要案情-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">简要案情</span>
                    </label>
                    <div class="p-div p-div3">
                      <div class="text-div">
                        <el-form-item prop="jyaql">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.jyaql"
                            placeholder="请输入简要案情"
                            maxlength="125"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--释放监狱(看守所)_省市县(区)-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">
                        释放监狱(看守所)
                        <br />省市县(区)
                      </span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="sfjySsxq">
                          <hd-region
                            v-if="visible"
                            v-model="formData.sfjySsxq"
                            :model-text.sync="formData.sfjySsxqText"
                            selectLastLevel
                            ref="xzdq"
                            placeholder="请选择释放监狱(看守所)省市县(区)"
                          ></hd-region>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--释放监狱(看守所)_名称-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">
                        释放监狱(看守所)
                        <br />名称
                      </span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="sfjyMc">
                          <el-input
                            v-model="formData.sfjyMc"
                            filterable
                            :rows="2"
                            placeholder="请输入释放监狱(看守所)名称"
                            maxlength="50"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--入狱(入所)时间-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">入狱(入所)时间</span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="rysj">
                          <hd-date-picker
                            type="date"
                            v-model="formData.rysj"
                            value-format="yyyyMMdd"
                            placeholder="请选择入狱(入所)时间"
                          ></hd-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--释放时间-->
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span class="required">释放时间</span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="sfsj">
                          <hd-date-picker
                            type="date"
                            v-model="formData.sfsj"
                            value-format="yyyyMMdd"
                            placeholder="请选择释放时间"
                          ></hd-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>

                <!--服刑期间改造表现-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span>
                        服刑期间
                        <br />改造表现
                      </span>
                    </label>
                    <div class="p-div p-div3">
                      <div class="text-div">
                        <el-form-item prop="fxqjgzbx">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.fxqjgzbx"
                            placeholder="请输入服刑期间改造表现"
                            maxlength="125"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <!--回归社会危险性评估意见-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span>
                        回归社会危险性
                        <br />评估意见
                      </span>
                    </label>
                    <div class="p-div p-div3">
                      <div class="text-div">
                        <el-form-item prop="hgshwxxpgyj">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.hgshwxxpgyj"
                            placeholder="请输入回归社会危险性评估意见"
                            maxlength="50"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <!--超过5年是否继续纳管0-否 ,1-是-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label label-150">
                      <span>
                        超过5年
                        <br />是否继续纳管
                      </span>
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <el-form-item prop="cgwnsfjxngPdbs">
                          <hd-dict-radio
                            v-model="formData.cgwnsfjxngPdbs"
                            filterable
                            :model-text.sync="formData.cgwnsfjxngPdbsText"
                            :dict-code="$global.dictType.zdrkCgwnsfjxng"
                            mode="button"
                          ></hd-dict-radio>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
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

export default {
  name: 'BizGyfzxmsfbmwnAdd',
  provide() {
    return {
      BizGyfzxmsfbmwnAdd: this
    };
  },
  inject: ['bizgyfzxmsfbmwn'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 表单
      formData: {
        ajmc: '',
        ajlb: '',
        ajlbText: '',
        jyaql: '',
        sfjySsxq: '',
        sfjySsxqText: '',
        sfjyMc: '',
        rysj: '',
        sfsj: '',
        fxqjgzbx: '',
        hgshwxxpgyj: '',
        cgwnsfjxngPdbs: '',
        cgwnsfjxngPdbsText: '',
        sjczlxdm: ''
      },
      // 验证
      rules: {
        ajmc: [
          { required: true, message: '请输入案件名称', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        ajlb: [
          { required: true, message: '请选择案件类别', trigger: 'change' }
        ],
        jyaql: [
          { required: true, message: '请输入简要案情', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        sfjySsxq: [
          {
            required: true,
            message: '请选择释放监狱(看守所)省市县(区)',
            trigger: 'change'
          }
        ],
        sfjyMc: [
          {
            required: true,
            message: '请输入释放监狱(看守所)名称',
            trigger: 'blur'
          },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        rysj: [
          { required: true, message: '请选择入狱(入所)时间', trigger: 'change' }
        ],
        sfsj: [
          { required: true, message: '请选择释放时间', trigger: 'change' },
          {
            validator: this.dataChange, // 引用自定义验证函数
            trigger: 'change' // 触发时机为失去焦点时
          }
        ]
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {},
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.cgwnsfjxngPdbs === '1') {
            _this.formData.cgwnsfjxngPdbsText = '是';
          } else if (_this.formData.cgwnsfjxngPdbs === '0') {
            _this.formData.cgwnsfjxngPdbsText = '否';
          } else {
            _this.formData.cgwnsfjxngPdbsText = '';
          }
          _this.$emit('currentChange', _this.formData);
          _this.cancelForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.formData.ajlbText = '';
      this.formData.sfjySsxqText = '';
      this.formData.cgwnsfjxngPdbsText = '';
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 开始时间不能小于结束时间
    dataChange(rule, value, callback) {
      const rysj = this.formData.rysj;
      if (rysj === null) {
        callback(); // 验证通过
      }
      if (rysj > value) {
        callback(new Error('结束时间必须大于开始时间'));
      } else {
        callback(); // 验证通过
      }
    }
  }
};
</script>

<style scoped>
.form .form-row .form-item .p-div-bmwnfz {
  height: 50px;
}
</style>
