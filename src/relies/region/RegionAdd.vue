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
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <el-form-item label="上级地区" prop="parentId">
          <hd-region ref="regionRef" v-model="addData.parentId" :model-text.sync="addData.parentMc" :filterCity="false" placeholder="请选择上级地区" underline @currentChanged="handleChangedParentId"></hd-region>
        </el-form-item>
        <el-form-item label="地区编码" prop="id">
          <el-input v-model="addData.id" placeholder="请输入地区编码" maxlength="6" underline></el-input>
        </el-form-item>
        <el-form-item label="地区简称" prop="name">
          <el-input v-model="addData.name" placeholder="请输入地区简称 如：新城区 或 呼和浩特市" maxlength="30" underline @change="handleChangedName"></el-input>
        </el-form-item>
        <el-form-item label="地区全称" prop="nameAll">
          <el-input v-model="addData.nameAll" placeholder="请输入地区全称 如：内蒙古自治区呼和浩特市新城区" maxlength="30" underline></el-input>
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
  import { addRegion, validateExistId } from '@/api/region';
  export default {
    name: "RegionAdd",
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
                callback(new Error('地区编码已存在'));
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
          parentId: '',
          parentMc: '',
          id: '',
          name: '',
          nameAll: ''
        },
        // 验证
        rules: {
          parentId: [
            { required: true, message: '请选择上级地区', trigger: 'change' }
          ],
          id: [
            { required: true, message: '请输入地区编码', trigger: 'blur' },
            { min: 6, max: 6, message: '长度只能为6个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateInteger, trigger: 'blur' },
            { validator: validateId, trigger: 'blur' }
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
            let dataParams = {
              ..._this.addData
            };
            // Lambda写法
            addRegion(dataParams).then(response => {
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
                _this.$refs.regionRef.reload();
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
      // 上级地区选择事件
      handleChangedParentId(val, oldVal, selection) {
        if(selection) {
          this.addData.parentMc = selection.nameAll;
          this.addData.nameAll = selection.nameAll;
        } else {
          this.addData.parentMc = '';
          this.addData.nameAll = '';
        }
      },
      // 根据地区简称初始化地区全称
      handleChangedName(event) {
        this.addData.nameAll = this.addData.parentMc + event;
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
