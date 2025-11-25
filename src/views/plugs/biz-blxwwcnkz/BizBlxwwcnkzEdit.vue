<template>
  <el-dialog title="编辑" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-document-copy"></i>
              有严重不良行为未成年人扩展信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--家庭监护状况,1-父母，2-父亲，3-母亲，4-祖父母或者外祖父母，5-无-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">家庭监护状况</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="jtjhzk">
                            <hd-dict-select
                              filterable
                              v-model="formData.jtjhzk"
                              :dict-code="$global.dictType.jtjhzk"
                              :model-text.sync="formData.jtjhzkText"
                              placeholder="请选择家庭监护状况"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--受教育情况,1-上学，2-辍学，3-已完成义务教育-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">受教育情况</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="sjyqk">
                            <hd-dict-radio
                              v-model="formData.sjyqk"
                              filterable
                              :model-text.sync="formData.sjyqkText"
                              :dict-code="$global.dictType.sjyqk"
                              type="button"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--学校名称-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span :class="formData.sjyqk === '1'?'required':''">学校名称</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item
                            prop="xxmc"
                            :rules="[
                              { required: formData.sjyqk === '1', message: '请输入学校名称', trigger: 'blur' },
                              { validator: this.$utilValidate.validateBlank, trigger: 'blur'},
                            ]"
                          >
                            <el-input v-model="formData.xxmc" placeholder="请输入学校名称" maxlength="40"></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--父母状况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">父母状况</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="fmzk">
                            <hd-dict-select
                              filterable
                              v-model="formData.fmzk"
                              :dict-code="$global.dictType.fmzkCode"
                              :model-text.sync="formData.fmzkText"
                              placeholder="请选择父母状况"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人一_姓名-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人一
                          <br />姓名
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhryXm">
                            <el-input
                              v-model="formData.jhryXm"
                              placeholder="请输入监护人一姓名"
                              maxlength="20"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人一身份证号-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人一
                          <br />身份证号
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhryGmsfhm">
                            <el-input
                              v-model="formData.jhryGmsfhm"
                              filterable
                              placeholder="请输入监护人一身份证号"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人一手机号码-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人一
                          <br />手机号码
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhrySjhm">
                            <el-input
                              filterable
                              v-model="formData.jhrySjhm"
                              placeholder="请输入监护人一手机号码"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人一与未成年人关系-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人一
                          <br />与未成年人关系
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhryYwcnrgx">
                            <hd-dict-cascader
                              v-model="formData.jhryYwcnrgx"
                              :model-text.sync="formData.jhryYwcnrgxText"
                              :dict-code="$global.dictType.kzxxShgx"
                              filterable
                              placeholder="请选择监护人一与未成年人关系"
                              bigCascaderPane7
                            ></hd-dict-cascader>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人二_姓名-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人二
                          <br />姓名
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhreXm">
                            <el-input
                              v-model="formData.jhreXm"
                              placeholder="请输入监护人二姓名"
                              maxlength="20"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人二身份证号-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人二
                          <br />身份证号
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhreGmsfhm">
                            <el-input
                              v-model="formData.jhreGmsfhm"
                              filterable
                              placeholder="请输入监护人二身份证号"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人二手机号码-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人二
                          <br />手机号码
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhreSjhm">
                            <el-input
                              filterable
                              v-model="formData.jhreSjhm"
                              placeholder="请输入监护人二手机号码"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--监护人二与未成年人关系-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          监护人二
                          <br />与未成年人关系
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jhreYwcnrgx">
                            <hd-dict-cascader
                              v-model="formData.jhreYwcnrgx"
                              :model-text.sync="formData.jhreYwcnrgxText"
                              :dict-code="$global.dictType.kzxxShgx"
                              filterable
                              placeholder="请选择监护人二与未成年人关系"
                              bigCascaderPane7
                            ></hd-dict-cascader>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--严重危害社会行为类别-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">
                          严重危害社会
                          <br />行为类别
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="yzwhshxwlb">
                            <hd-dict-select
                              filterable
                              v-model="formData.yzwhshxwlb"
                              :dict-code="$global.dictType.yzwhshxwlbCode"
                              :model-text.sync="formData.yzwhshxwlbText"
                              placeholder="请选择严重危害社会行为类别"
                              bigCascaderPane7
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--处罚情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>处罚情况</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="cfqk">
                            <hd-dict-cascader
                              filterable
                              v-model="formData.cfqk"
                              :dict-code="$global.dictType.cfqkCode"
                              :model-text.sync="formData.cfqkText"
                              placeholder="请选择处罚情况"
                            ></hd-dict-cascader>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--矫治情况-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>矫治情况</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jzqk">
                            <hd-dict-select
                              filterable
                              v-model="formData.jzqk"
                              :dict-code="$global.dictType.jzqkCode"
                              :model-text.sync="formData.jzqkText"
                              placeholder="请选择矫治情况"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--矫治教育措施-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>矫治教育措施</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jzjycs">
                            <hd-dict-select
                              filterable
                              v-model="formData.jzjycs"
                              :dict-code="$global.dictType.jzjycsCode"
                              :model-text.sync="formData.jzjycsText"
                              placeholder="请选择矫治教育措施"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--提请专门教育情形-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>
                          提请
                          <br />专门教育情形
                        </span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="tqzmjyqx">
                            <hd-dict-select
                              filterable
                              v-model="formData.tqzmjyqx"
                              :dict-code="$global.dictType.tqzmjyqxCode"
                              :model-text.sync="formData.tqzmjyqxText"
                              placeholder="请选择提请专门教育情形"
                            ></hd-dict-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--专门学校名称-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>专门学校名称</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="zmxxmc">
                            <el-input
                              v-model="formData.zmxxmc"
                              placeholder="请输入专门学校名称"
                              maxlength="40"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--专门学校地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>专门学校地址</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="zmxxdz">
                            <el-input
                              v-model="formData.zmxxdz"
                              placeholder="请输入专门学校地址"
                              maxlength="40"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--专门学校期限-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>专门学校期限</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="zmxxqx">
                            <el-input
                              v-model="formData.zmxxqx"
                              placeholder="请输入专门学校期限"
                              maxlength="40"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!--刑事案件类别-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      <span :class="formData.yzwhshxwlb && formData.yzwhshxwlb === '1' ? 'required':''">刑事案件类别</span>
                    </label>
                    <div class="p-div">
                      <div class="text-div">
                        <el-form-item 
                          prop="ajlb"
                          :rules="[
                            { required: formData.yzwhshxwlb && formData.yzwhshxwlb === '1', message: '请选择刑事案件类别', trigger: 'blur' },
                            { validator: this.$utilValidate.validateBlank, trigger: 'blur'},
                          ]">
                          <hd-dict-cascader
                            v-model="formData.ajlb"
                            placeholder="请选择刑事案件类别"
                            :model-text.sync="formData.ajlbText"
                            :dict-code="$global.dictType.ajlb"
                            filterable
                          ></hd-dict-cascader>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <!--简要情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      <span :class="formData.yzwhshxwlb && formData.yzwhshxwlb === '1' ? 'required':''">简要情况</span>
                    </label>
                    <div class="p-div p-div3">
                      <div class="text-div">
                        <el-form-item 
                          prop="jyqk"
                          :rules="[
                            { required: formData.yzwhshxwlb && formData.yzwhshxwlb === '1', message: '请输入简要情况', trigger: 'change' },
                          ]">
                          <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.jyqk"
                            placeholder="请输入简要情况"
                            maxlength="1500"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                  <!--经常活动场所-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>经常活动场所</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item prop="jchdcs">
                            <el-input
                              v-model="formData.jchdcs"
                              placeholder="请输入经常活动场所"
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
  name: 'BizblxwwcnkzEdit',
  provide() {
    return {
      BizblxwwcnkzEdit: this
    };
  },
  inject: ['bizblxwwcnkz'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        ajlb: '',
        ajlbText: '',
        jyqk: '',
        jchdcs: '',
        jtjhzk: '',
        sjyqk: '',
        xxmc: '',
        fmzk: '',
        fmzkText: '',
        jhryXm: '',
        jhryGmsfhm: '',
        jhrySjhm: '',
        jhryYwcnrgx: '',
        jhryYwcnrgxText: '',
        jhreXm: '',
        jhreGmsfhm: '',
        jhreSjhm: '',
        yhreYwcnrgx: '',
        yhreYwcnrgxText: '',
        cfqk: '',
        cfqkText: '',
        jzqk: '',
        jzqkText: '',
        jzjycs: '',
        jzjycsText: '',
        tqzmjyqx: '',
        tqzmjyqxText: '',
        zmxxmc: '',
        zmxxdz: '',
        zmxxqx: ''
      },
      // 验证
      rules: {
        ajlb: [
          { required: false, message: '请选择刑事案件类别', trigger: 'change' }
        ],
        jyqk: [
          { required: false, message: '请输入简要情况', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        jchdcs: [
          { required: false, message: '请输入经常活动场所', trigger: 'blur' },
          { validator: this.$utilValidate.validateBlank, trigger: 'blur' }
        ],
        jtjhzk: [
          {
            required: true,
            message: '请选择家庭监护状况',
            trigger: 'change'
          }
        ],
        sjyqk: [
          {
            required: true,
            message: '请选择受教育情况',
            trigger: 'change'
          }
        ],
        fmzk: [
          {
            required: true,
            message: '请选择父母状况',
            trigger: 'change'
          }
        ],
        jhryXm: [
          { required: true, message: '请输入监护人一姓名', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: 'blur'
          },
          { min: 2, max: 30, message: '请正确输入真实姓名', trigger: 'blur' }
        ],
        jhryGmsfhm: [
          {
            required: true,
            message: '请输入监护人一身份证号',
            trigger: 'blur'
          },
          { validator: this.$utilValidate.validateIdcard, trigger: 'blur' }
        ],
        jhrySjhm: [
          {
            required: true,
            message: '请输入监护人一手机号码',
            trigger: 'blur'
          },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: 'blur'
          }
        ],
        jhryYwcnrgx: [
          {
            required: true,
            message: '请选择监护人一与未成年人关系',
            trigger: 'change'
          }
        ],
        jhreXm: [
          { required: true, message: '请输入监护人二姓名', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateChineseName,
            trigger: 'blur'
          },
          { min: 2, max: 30, message: '请正确输入真实姓名', trigger: 'blur' }
        ],
        jhreGmsfhm: [
          {
            required: true,
            message: '请输入监护人二身份证号',
            trigger: 'blur'
          },
          { validator: this.$utilValidate.validateIdcard, trigger: 'blur' }
        ],
        jhreSjhm: [
          {
            required: true,
            message: '请输入监护人二手机号码',
            trigger: 'blur'
          },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: 'blur'
          }
        ],
        jhreYwcnrgx: [
          {
            required: true,
            message: '请选择监护人二与未成年人关系',
            trigger: 'change'
          }
        ],
        yzwhshxwlb: [
          {
            required: true,
            message: '请选择严重危害社会行为类别',
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
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.formData.sjyqk === this.$global.dictItem.sjyqkType.sx) {
            _this.formData.sjyqkText = '上学';
          } else if (
            _this.formData.sjyqk === this.$global.dictItem.sjyqkType.cx
          ) {
            _this.formData.sjyqkText = '辍学';
          } else if (
            _this.formData.sjyqk === this.$global.dictItem.sjyqkType.ywcywjy
          ) {
            _this.formData.sjyqkText = '已完成义务教育';
          }
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
      this.formData.ajlbText = '';
      this.formData.jtjhzkText = '';
      this.formData.yhzgxText = '';
      this.formData.sjyqkText = '';
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
.form .form-row .form-item .p-divs {
  height: 50px;
}
</style>
