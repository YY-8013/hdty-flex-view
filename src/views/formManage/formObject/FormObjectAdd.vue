<template>
  <el-dialog title="新增任务对象" :visible.sync="visible" custom-class="hdty-dialog-medium" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="140px"
        @submit.native.prevent
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务对象列名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入任务对象列名" maxlength="200" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="绑定属性名" prop="prop">
                <el-input
                  v-model="formData.prop"
                  placeholder="请输入绑定属性名"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务对象标签名" prop="label">
                <el-input
                  v-model="formData.label"
                  placeholder="请输入任务对象标签名"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务对象排序" prop="objectOrder">
                <el-input v-model.number="formData.objectOrder" placeholder="请输入任务对象排序" maxlength="3" underline></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否系统配置" prop="isAdmin">
                <hd-dict-radio v-model="formData.isAdmin" :dict-code="$global.dictType.isOrNot" underline></hd-dict-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否显示" prop="isShow">
                <hd-dict-radio v-model="formData.isShow" :dict-code="$global.dictType.isOrNot" underline></hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="列 类 型" prop="colType">
                <el-input v-model="formData.colType" placeholder="请输入列类型" maxlength="50" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据抽取列名" prop="tableKey">
                <el-input
                  v-model="formData.tableKey"
                  placeholder="请输入数据抽取时对应的列名"
                  maxlength="1000"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
               <el-form-item label="备  注" prop="memo">
                                <el-input v-model="formData.memo" type="textarea" :rows="2" placeholder="请输入备注"  maxlength="500"  underline></el-input>
                            </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="任务对象配置" prop="config">
              <hd-json-editor v-model="formData.config" maxlength="4000" height="268"></hd-json-editor>
              <!-- <el-card style="margin-left:8px;">
                配置示例：
                <div class="code-box">
                  <hd-code :jsonCode="config"></hd-code>
                </div>
              </el-card>-->
            </el-form-item>
          </el-row>
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
import { formObjectAdd } from './api';

export default {
  name: 'FormManageAdd',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList', 'formItemList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      config:  {"id":"ssyhsfzhm","prop":"ssyhsfzhm","propText":"ssyhsfzhmText","propText":"ssyhsfzhmText","placeholder":"请选择责任人","label":"责任人","type":"personSelect","disabled":false,"typeId":"002","rules":{"required":false,"requiredMsg":"责任人不能为空"},"vIf":[{"label":"frmz","value":["0"]}],"valueField":"vo.gmsfhm"},
      // 表单
      formData: {
        name: '',
        tableKey: '',
        colType: '',
        objectOrder: '',
        label: '',
        prop: '',
        isAdmin: '',
        isShow: '',
        memo: '',
        config: {
          "prop": "name",
          "placeholder": "请输入人员姓名",
          "label": "人员姓名",
          "type": "input",
          "maxlength": 15,
          "disabled": false,
          "rules": {
            "required": true,
            "message": "请输入人员姓名",
            "validator": "checkChineseName"
          }
        }
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        name: [
          { required: true, message: '请输入任务对象列名', trigger: 'blur' }
        ],
        tableKey: [
          {
            required: false,
            message: '请输入数据抽取时对应的列名',
            trigger: 'blur'
          }
        ],
        colType: [{ required: false, message: '请输入列类型', trigger: 'blur' }],
        objectOrder: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入任务对象标签名', trigger: 'blur' }
        ],
        prop: [
          {
            required: true,
            message: '请输入绑定表单对象属性名',
            trigger: 'blur'
          }
        ],
        isAdmin: [
          {
            required: true,
            message: '请选择是否系统配置',
            trigger: 'change'
          }
        ],
        isShow: [
          {
            required: true,
            message:
              '请选择是否显示在任务名称中，如配置1后会在构造任务描述时取具体的值',
            trigger: 'change'
          }
        ],
        config: [
          {
            required: true,
            message: '请输入任务对象组件配置（JSON格式）',
            trigger: 'blur'
          }
        ]
      },
      // 显示
      visible: false,
      row: { vo: {} }
    };
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {});
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
            formId: _this.row.vo.formId,
            ..._this.formData
          };
          // 使用正则表达式去除换行和多余的空格
          let cleanedJsonString = _this.formData.config.replace(/\s+/g, '');
          // 将清理后的字符串转换为JSON对象
          dataParams.config = cleanedJsonString;
          console.log('处理后---dataParams', dataParams);
          // Lambda写法
          formObjectAdd(dataParams)
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
                _this.formItemList.handleQuery();
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
