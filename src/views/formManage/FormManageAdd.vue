<template>
  <el-dialog
    title="新增表单"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="110px"
        @submit.native.prevent
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="表单名称" prop="formTitle">
                <el-input
                  v-model="formData.formTitle"
                  placeholder="请输入表单名称"
                  maxlength="30"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="formId" prop="formId">
                <el-input
                  v-model="formData.formId"
                  placeholder="请输入表单formId"
                  maxlength="30"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="图标文字" prop="appIcon">
                <el-input v-model="formData.appIcon" placeholder="请输入菜单图标" maxlength="1" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标颜色" prop="appColor">
                <input v-model="formData.appColor" type="color" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="图标(web)" prop="webIcon">
                <hd-iconfont v-model="formData.webIcon" placeholder="请选择web端图标" underline></hd-iconfont>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="图标颜色" prop="appColor">
                <input v-model="formData.appColor" type="color" />
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表单类型" prop="formType">
                <hd-dict-select
                  v-model="formData.formType"
                  :dict-code="$global.dictType.formType"
                  placeholder="请选择表单类型"
                  underline
                ></hd-dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属机构" prop="orgId">
                <hd-organ v-model="formData.orgId" placeholder="请选择所属机构" underline></hd-organ>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="父级字典" prop="parentDicKey">
                <hd-dict-select
                  v-model="formData.parentDicKey"
                  :dict-code="$global.dictType.formParentKey"
                  underline
                ></hd-dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排  序" prop="formOrder">
                <el-input
                  v-model.number="formData.formOrder"
                  placeholder="请输入排序"
                  maxlength="6"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="允许所有民警处理" prop="allowAllMjDel" label-width="160px">
                <hd-dict-radio
                  v-model="formData.allowAllMjDel"
                  :dict-code="$global.dictType.isOrNot"
                  underline
                ></hd-dict-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否必须有任务对象" prop="isMustObject" label-width="180px">
                <hd-dict-radio
                  v-model="formData.isMustObject"
                  :dict-code="$global.dictType.isOrNot"
                  underline
                ></hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="是否允许手动创建" prop="isManual" label-width="160px">
                <hd-dict-radio
                  v-model="formData.isManual"
                  :dict-code="$global.dictType.isOrNot"
                  underline
                ></hd-dict-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据抽取时对应的表名" prop="etlTableName" label-width="180px">
                <el-input
                  v-model="formData.etlTableName"
                  placeholder="请输入数据抽取时对应的表名"
                  maxlength="100"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="查询条件过滤类型" prop="etlType" label-width="160px">
                <hd-dict-select
                  v-model="formData.etlType"
                  :dict-code="$global.dictType.formFilterType"
                  placeholder="请选择查询条件过滤类型"
                  underline
                ></hd-dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体业务类别" prop="etlYwlb">
                <el-input
                  v-model="formData.etlYwlb"
                  placeholder="请输入具体业务类别,多个类别用逗号隔开，例: 62,63"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="表单配置" prop="formConfig">
              <hd-json-editor v-model="formData.formConfig" maxlength="4000" height="400"></hd-json-editor>
            </el-form-item>
          </el-row>
          <el-form-item label="备  注" prop="memo">
            <el-input
              type="textarea"
              v-model="formData.memo"
              :rows="3"
              placeholder="请输入备注"
              maxlength="1000"
              underline
            ></el-input>
          </el-form-item>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { addForm } from './api';

export default {
  name: 'FormManageAdd',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      formConfig: '',
      formData: {
        formTitle: '',
        formConfig: {
          refName: 'taskForm',
          title: '***表单',
          labelWidth: '100',
          labelAlign: 'left'
        },
        formOrder: '',
        appIcon: '',
        appColor: '#04395e',
        orgId: '',
        formType: '',
        etlTableName: '',
        etlType: '',
        isMustObject: this.$global.dictItem.isOrNot.is,
        isManual: '', // 是否允许手动创建
        allowAllMjDel: '', // 允许所有民警处理
        parentDicKey: '', // 父级字典key
        etlYwlb: '', // 数据抽取的具体业务类别，此项会放各个业务的大类或者细类
        memo: '',
        // web端图标
        webIcon: ''
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        formTitle: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
        ],
        formConfig: [
          {
            required: true,
            message: '请输入表单配置（JSON格式）',
            trigger: 'blur'
          }
        ],
        formOrder: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        appIcon: [
          { required: true, message: '请输入菜单图标', trigger: 'blur' }
        ],
        appColor: [
          { required: true, message: '请输入菜单图标颜色', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        formType: [
          { required: true, message: '请输入表单类型', trigger: 'blur' }
        ],
        parentDicKey: [
          { required: true, message: '请选择父级字典', trigger: 'change' }
        ],
        isMustObject: [
          {
            required: true,
            message: '请选择是否必须有任务对象',
            trigger: 'change'
          }
        ],
        isManual: [
          {
            required: true,
            message: '请选择是否允许手动创建',
            trigger: 'change'
          }
        ],
        allowAllMjDel: [
          {
            required: true,
            message: '请选择是否允许所有民警处理',
            trigger: 'change'
          }
        ]
      },
      // 显示
      visible: false
    };
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        let a = {
          refName: 'taskForm',
          title: '',
          labelWidth: '100',
          labelAlign: 'left'
        };
        _this.formConfig = JSON.stringify(a);
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      console.log('示例', _this.formData);
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.formData,
            appColor: _this.formData.appColor.substr(1)
          };
          // 使用正则表达式去除换行和多余的空格
          let cleanedJsonString = _this.formData.formConfig.replace(/\s+/g, '');
          // 将清理后的字符串转换为JSON对象
          dataParams.formConfig = cleanedJsonString;
          console.log('处理后---dataParams', dataParams);
          // Lambda写法
          addForm(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.cancelForm();
                _this.hdList.handleQuery();
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

<style scoped>
</style>
