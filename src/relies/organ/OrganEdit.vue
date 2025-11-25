<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="editData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-form-item label="上级机构" prop="parentId">
            <hd-organ ref="organRef" prop="parentId" v-model="editData.parentId" :model-text.sync="extendData.parentId" :showDept="editData.isDept === $global.dictItem.isOrNot.is?true:false" placeholder="请选择上级机构" underline></hd-organ>
          </el-form-item>
          <el-form-item label="机构编码" prop="id">
            <el-input v-model="editData.id" placeholder="请输入机构编码" maxlength="12" disabled underline></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="editData.name" placeholder="请输入机构名称" maxlength="25" underline></el-input>
          </el-form-item>
          <el-form-item label="级  别" prop="level">
            <hd-dict-select prop="level" v-model="editData.level" :model-text.sync="extendData.level" :dict-code="$global.dictType.orgLevel" placeholder="请选择级别" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="是否部门" prop="isDept">
            <hd-dict-select prop="isDept" v-model="editData.isDept" :model-text.sync="extendData.isDept" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否部门" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="是否统计" prop="isStat">
            <hd-dict-select prop="isStat" v-model="editData.isStat" :model-text.sync="extendData.isStat" :dict-code="$global.dictType.isOrNot" placeholder="请选择是否统计" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="是否有社区业务" prop="isSqyw">
            <hd-dict-select v-model="editData.isSqyw" :dict-code="$global.dictType.isOrNot" :model-text.sync="extendData.isSqyw" placeholder="请选择是否有社区业务" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="是否边防派出所" prop="isBfPcs">
            <hd-dict-select v-model="editData.isBfPcs" :dict-code="$global.dictType.isOrNot" :model-text.sync="extendData.isBfPcs" placeholder="请选择是否边防派出所" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="备  注" prop="memo">
            <el-input v-model="editData.memo" placeholder="请输入备注" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}" maxlength="100" underline></el-input>
          </el-form-item>
        </hd-component>
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
  import { editOne, getEditDetail } from '@/api/organ';
  export default {
    name: "OrganEdit",
    provide() {
      return {
        hdEdit: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        editData: {
          id: '',
          parentId: '',
          parentMc: '',
          name: '',
          level: '',
          isDept: '0',
          isStat: '1',
          isSqyw: '0',
          isBfPcs: '0',
          memo: ''
        },
        // 表单扩展
        extendData: {},
        // 验证
        rules: {
          parentId: [
            { required: true, message: '请选择上级机构', trigger: 'change' }
          ],
          id: [
            { required: true, message: '请输入机构编码', trigger: 'blur' },
            { min: 12, max: 12, message: '长度只能为12个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateInteger, trigger: 'blur' }
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
        // 行
        row: {},
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      },
      // 加载表单
      loadForm() {
        let _this = this;
        // 参数
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getEditDetail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.editData = data.vo;
            _this.extendData = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.editData
            };
            // Lambda写法
            editOne(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.$refs.organRef.reload();
                _this.hdList.loadList();
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
        this.visible = false;
        this.resetForm();
      },
      // 重置
      resetForm() {
        this.$nextTick(() =>{
          this.$refs.formRef.resetFields();
          this.$refs.componentRef.resetFields();
        });
      }
    }
  }
</script>

<style scoped>

</style>
