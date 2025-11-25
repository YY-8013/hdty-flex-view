<template>
  <el-dialog
    title="处理"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="formData"
        :rules="rules"
        ref="form1Ref"
        border
        stripe
        label-width="120px"
        @submit.native.prevent.
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="component1Ref">
          <div class="hdty-card">
            <div class="hdty-card-header">反馈内容</div>
            <div class="hdty-card-body">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="type" label="反馈类型">
                    {{ extendData.type }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="version" label="应用版本">
                    {{ formData.version }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="deviceBrand" label="设备品牌">
                    {{ formData.deviceBrand }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="deviceModel" label="设备型号">
                    {{ formData.deviceModel }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item prop="content" label="反馈内容">
                  {{ formData.content }}
                  <div>
                    <div v-for="(item, idx) in imageUrlList" :key="idx" style="float: left; padding-right: 5px;">
                      <hd-image :src="baseUrl + item" width="100" height="100" fit="cover"></hd-image>
                    </div>
                  </div>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="telephone" label="填写联系方式">
                    {{ formData.telephone }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="createUserTel" label="反馈人联系方式">
                    {{ formData.createUserTel }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="createUsername" label="反馈人">
                    {{ formData.createUsername }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="createTime" label="反馈时间">
                    {{ $utilDate.dateFtt(formData.createTime, 'yyyy-MM-dd HH:mm:ss') }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </hd-component>
      </el-form>

      <el-form
        :model="formData"
        :rules="rules"
        ref="form2Ref"
        label-width="100px"
        @submit.native.prevent.
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="component2Ref">
          <div class="hdty-card">
            <div class="hdty-card-header">反馈处理</div>
            <div class="hdty-card-body">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="处理人" prop="dealUsername">
                    <el-input v-model="formData.dealUsername"
                      placeholder="请输入处理人" readonly
                      underline></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="处理时间" prop="dealTime">
                    <hd-date-picker type="datetime"
                      v-model="formData.dealTime" placeholder="请选择处理时间"
                      underline readonly></hd-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="处理备注" prop="dealNote">
                <el-input v-model="formData.dealNote" type="textarea"
                  placeholder="请输入处理备注" maxlength="100"
                  underline></el-input>
              </el-form-item>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {hdForm} from "@/utils/util-framework";
import {deal, dealBefore} from '@/api/feedback';

export default {
  name: "MobileFeedbackEdit",
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
      formData: {
        id: '',
        type: '',
        version: '',
        content: '',
        telephone: '',
        imageNum: '',
        deviceModel: '',
        deviceBrand: '',
        createUserId: '',
        createUsername: '',
        createTime: '',
        isDeal: '',
        dealUserId: '',
        dealUsername: '',
        dealTime: '',
        dealNote: '',
      },
      // 表单扩展
      extendData: {
        type: '',
      },
      // 验证
      rules: {
        dealNote: [
          {required: true, message: "处理备注不能为空", trigger: 'blur'},
        ],
      },
      // 行
      row: {
      },
      // 显示
      visible: false,
      // 图片展示
      baseUrl: appEnv.baseURL,
      imageUrlList: [],
    }
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      dealBefore(dataParams).then(response => {
        //响应成功回调
        let {success, data} = response.data;
        if (success) {
          _this.formData = data.vo;
          _this.extendData = data.vox;
          _this.imageUrlList = data.vo.imgList;
          _this.formData.dealUsername = _this.$utilLogin.getUserInfo().xm;
          _this.formData.dealTime = _this.$utilDate.dateFtt(new Date(), 'yyyyMMddHHmmss');
        }
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.form2Ref.validate((valid) => {
        if (valid) {
          _this.submitting = true;
          // 参数
          let dataParams = {
            id: _this.formData.id,
            dealNote: _this.formData.dealNote,
          };
          // Lambda写法
          deal(dataParams).then(response => {
            //响应成功回调
            let {success, msg} = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
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
      this.$refs.form1Ref.resetFields();
      this.$refs.component1Ref.resetFields();
      this.$refs.form2Ref.resetFields();
      this.$refs.component2Ref.resetFields();
    }
  }
}
</script>

<style scoped>

</style>
