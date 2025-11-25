<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      @submit.native.prevent
      @keyup.enter.native="submitForm">
      <hd-component
        :model="extendData"
        ref="componentRef">
          <el-form-item label="移交机构" prop="sjgsdwdm">
            <hd-organ v-model="formData.sjgsdwdm" :filterCode="filterCode"  showLevel="5" :checkLevel="[4,5]" :model-text.sync="formData.yjjgText"  placeholder="请选择移交机构" underline></hd-organ>
          </el-form-item>
          <el-form-item :label="yjyyLabel" prop="yjyy">
            <el-input v-model="formData.yjyy" :placeholder="'请输入' + yjyyLabel" maxlength="30" underline></el-input>
          </el-form-item>
      </hd-component>
    </el-form>
    <div slot="footer" class="hdty-btn-container" style="float:right;">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>
<script>
import {hdComponent, hdForm, hdList, hdMethod} from "@/utils/util-framework";
import {taskYj, taskYjNew} from './api';
export default {
  name: "BizTaskYj",
  provide() {
    return {
      BizTaskYj: this
    };
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
  props: {
    prop: String,
    // 现住地址
    xzdz: {
      type: String,
      default: ''
    },
    // 任务主键
    taskId: {
      type: String,
      default: ''
    },
    // 移交原因label
    yjyyLabel: {
      type: String,
      default: '现住地址'
    }
  },
  data() {
    return {
      // 表单
      formData: {
        sjgsdwdm: '',
        yjjgText: '',
        yjyy: this.xzdz,
        taskId: this.taskId,
      },
      // 表单扩展
      extendData: {
        yjjg: '',
      },
      // 验证
      rules: {
        yjyy: [
          { required: true, message: '请输入现住地址', trigger: 'blur' }
        ],
        sjgsdwdm: [
          { required: true, message: '请选择移交机构', trigger: 'change' }
        ],
      },
      filterCode: this.$utilPublic.getUserOrgId().substring(0,6) + '000000'
    }
  },
  methods: {
    // 获取数据列表
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          _this.loading = true;
          // 判断移交调用的页面是任务中心1.0或任务中心2.0，决定移交的接口和参数
          // if(_this.$route.name === 'NewTaskCenterDelList'){
            // 任务中心2.0
            // 参数
            let dataParams = {
              transferReason: _this.formData.yjyy,
              afterTransferOrgId: _this.formData.sjgsdwdm,
              taskUserRecodeId: _this.formData.taskId,
            };
            taskYjNew(dataParams).then(response => {
              //响应成功回调
              let { success, msg, data } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                let map = {
                  xzdz: _this.formData.yjyy,
                  sjgsdwdm: _this.formData.sjgsdwdm,
                  sjgsdwName: _this.formData.yjjgText,
                  newTaskYwbm: data,
                }
                this.$emit('currentChanged', map);
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.loading = false;
            });
          // }
          // else {
          //   // 任务中心1.0
          //   // 参数
          //   let dataParams = {
          //     ..._this.formData,
          //   };
          //   taskYj(dataParams).then(response => {
          //     //响应成功回调
          //     let { success, msg, data } = response.data;
          //     if (success) {
          //       _this.$message({
          //         showClose: true,
          //         customClass: 'is-fixed',
          //         message: msg,
          //         type: 'success'
          //       });
          //       let map = {
          //         xzdz: _this.formData.yjyy,
          //         sjgsdwdm: _this.formData.sjgsdwdm,
          //         sjgsdwName: _this.formData.yjjgText,
          //         newTaskYwbm: data,
          //       }
          //       this.$emit('currentChanged', map);
          //     }
          //   }).catch(error => {
          //     // 响应错误回调
          //     console.error(error);
          //   }).finally(() => {
          //     _this.loading = false;
          //   });
          // }
        }
      })
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.$emit('cancelForm', null);
    },
  }
}
</script>

<style scoped>

</style>
