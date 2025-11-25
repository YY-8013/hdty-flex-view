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
          <el-form-item label="上级地区" prop="parentId">
            <hd-region prop="parentId" ref="regionRef" v-model="editData.parentId" :filterCity="false" :model-text.sync="extendData.parentId" placeholder="请选择上级地区" underline @currentChanged="handleChangedParentId"></hd-region>
          </el-form-item>
          <el-form-item label="地区编码" prop="id">
            <el-input v-model="editData.id" placeholder="请输入地区编码" maxlength="6" disabled underline></el-input>
          </el-form-item>
          <el-form-item label="地区简称" prop="name">
            <el-input v-model="editData.name" placeholder="请输入地区简称 如：新城区 或 呼和浩特市" maxlength="30" underline
                      @change="handleChangedName"></el-input>
          </el-form-item>
          <el-form-item label="地区全称" prop="nameAll">
            <el-input v-model="editData.nameAll" placeholder="请输入地区全称 如：内蒙古自治区呼和浩特市新城区" maxlength="30"
                      underline></el-input>
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
  import { editOne, getEditDetail } from '@/api/region';
  export default {
    name: "RegionEdit",
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
          parentId: '',
          parentMc: '',
          id: '',
          name: '',
          nameAll: ''
        },
        extendData: {},
        // 验证
        rules: {
          parentId: [
            { required: true, message: '请选择上级地区', trigger: 'change' }
          ],
          id: [
            { required: true, message: '请输入地区编码', trigger: 'blur' },
            { min: 6, max: 6, message: '长度只能为6个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateInteger, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入地区简称', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ],
          nameAll: [
            { required: true, message: '请输入地区全称', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ]
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
          let {success, data} = response.data;
          if (success) {
            _this.editData = data;
            _this.extendData.parentId = data.parentMc;
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
              let {success, msg} = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.$refs.regionRef.reload();
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
      // 上级地区选择事件
      handleChangedParentId(val, oldVal,selection) {
        if(selection) {
          this.editData.parentMc = selection.nameAll;
          this.editData.nameAll = selection.nameAll;
        } else {
          this.editData.parentMc = '';
          this.editData.nameAll = '';
        }
      },
      // 根据地区简称初始化地区全称
      handleChangedName(event) {
        this.editData.nameAll = this.editData.parentMc + event;
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
          // 为了解决编辑时：点击取消之后，再打开页面的时候上级地区为空的情况
          this.editData.parentMc = '';
        });
      }
    },
  }
</script>

<style scoped>

</style>
