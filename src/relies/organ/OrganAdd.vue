<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <el-form-item label="上级机构" prop="parentId">
          <hd-organ ref="organRef" v-model="addData.parentId" :show-dept="addData.isDept === $global.dictItem.isOrNot.is?true:false" placeholder="请选择上级机构" underline></hd-organ>
        </el-form-item>
        <el-form-item label="机构编码" prop="id">
          <el-input v-model="addData.id" placeholder="请输入机构编码" maxlength="12" underline></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="addData.name" placeholder="请输入机构名称" maxlength="25" underline></el-input>
        </el-form-item>
        <el-form-item label="级  别" prop="level">
          <hd-dict-select v-model="addData.level" :dict-code="$global.dictType.orgLevel" placeholder="请选择级别" underline></hd-dict-select>
        </el-form-item>
        <el-form-item label="是否部门" prop="isDept">
          <hd-dict-select v-model="addData.isDept" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否部门" underline></hd-dict-select>
        </el-form-item>
        <el-form-item label="是否统计" prop="isStat">
          <hd-dict-select v-model="addData.isStat" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否统计" underline></hd-dict-select>
        </el-form-item>
        <el-form-item label="是否有社区业务" prop="isSqyw">
          <hd-dict-select v-model="addData.isSqyw" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否有社区业务" underline></hd-dict-select>
        </el-form-item>
        <el-form-item label="是否边防派出所" prop="isBfPcs">
          <hd-dict-select v-model="addData.isBfPcs" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否边防派出所" underline></hd-dict-select>
        </el-form-item>
        <el-form-item label="备  注" prop="memo">
          <el-input v-model="addData.memo" placeholder="请输入备注" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}" maxlength="100" underline></el-input>
        </el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { addOrgan, validateExistId } from '@/api/organ';
  export default {
    name: "OrganAdd",
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validateId = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            id: this.addData.id
          };
          // Lambda写法
          validateExistId(dataParams).then(response => {
            // 响应成功回调
            let {success, data} = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('机构编码已存在'));
              } else {
                callback();
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
            callback(new Error('验证时发生错误，请重试'));
          });
        }
      };
      return {
        // 表单
        addData: {
          id: '',
          parentId: '',
          name: '',
          level: '',
          isDept: '0',
          isStat: '1',
          isSqyw: '0',
          isBfPcs: '0',
          memo: ''
        },
        // 验证
        rules: {
          parentId: [
            { required: true, message: '请选择上级机构', trigger: 'change' }
          ],
          id: [
            { required: true, message: '请输入机构编码', trigger: 'blur' },
            { min: 12, max: 12, message: '长度只能为12个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateInteger, trigger: 'blur' },
            { validator: validateId, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入机构名称', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请选择级别', trigger: 'change' }
          ],
          isDept: [
            { required: true, message: '请选择是否部门', trigger: 'change' }
          ],
          isStat: [
            { required: true, message: '请选择是否统计', trigger: 'change' }
          ],
          isSqyw: [
            { required: true, message: '请选择是否有社区业务', trigger: 'change' }
          ],
          isBfPcs: [
            { required: true, message: '请选择是否边防派出所', trigger: 'change' }
          ],
        },
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 这里写加载表单之前的操作
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.addData
            };
            // Lambda写法
            addOrgan(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.resetForm();
                _this.$refs.organRef.reload();
                _this.hdList.handleQuery();
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.submitting = false;
            });
          }
        });
      },
      // 取消
      cancelForm() {
        this.resetForm();
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.$refs.formRef.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
