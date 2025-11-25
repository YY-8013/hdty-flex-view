<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="formData"
        ref="formRef"
        label-width="120px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.type" label="反馈类型">
              {{ formData.vox.type }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.version" label="应用版本">
              {{ formData.vo.version }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.deviceBrand" label="设备品牌">
              {{ formData.vo.deviceBrand }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.deviceModel" label="设备型号">
              {{ formData.vo.deviceModel }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="vo.content" label="反馈内容">
            {{ formData.vo.content }}
            <div>
              <div v-for="(item, idx) in imageUrlList" :key="idx" style="float: left; padding-right: 5px;">
                <hd-image :src="baseUrl + item" width="100" height="100" fit="cover"></hd-image>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.telephone" label="填写联系方式">
              {{ formData.vo.telephone }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createUserTel" label="反馈人联系方式">
              {{ formData.vo.createUserTel }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.createUsername" label="反馈人">
              {{ formData.vo.createUsername }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="反馈时间">
              {{ $utilDate.dateFtt(formData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="dealFlag ? 12 : 24">
            <el-form-item prop="vo.isDeal" label="是否处理">
              {{ formData.vox.isDeal }}
              <span v-show="formData.vo.dealTime">({{ $utilDate.dateFtt(formData.vo.dealTime, 'yyyy-MM-dd HH:mm:ss') }})</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dealFlag">
            <el-form-item prop="vo.dealUsername" label="处理人姓名">
              {{ formData.vo.dealUsername }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="dealFlag">
          <el-form-item prop="vo.dealNote" label="处理备注">
            {{ formData.vo.dealNote }}
          </el-form-item>
        </el-row>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {hdForm} from "@/utils/util-framework";
import {detail} from '@/api/feedback';

export default {
  name: "MobileFeedbackDetail",
  provide() {
    return {
      hdDetail: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      formData: {
        vo: {
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
          createUserTel: '',
          imgList: []
        },
        vox: {}
      },
      // 行
      row: {},
      // 显示
      visible: false,
      // 处理标识
      dealFlag: false,
      // 图片展示
      baseUrl: appEnv.baseURL,
      imageUrlList: [],
    }
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
        id: _this.row.vo.id
      };
      // Lambda写法
      detail(dataParams).then(response => {
        //响应成功回调
        let { success, data } = response.data;
        if (success) {
          _this.formData.vo = data.vo;
          _this.formData.vox = data.vox;
          _this.dealFlag = data.vo.isDeal === '1';
          _this.imageUrlList = data.vo.imgList;
        }
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      })
    },
    // 取消
    cancelForm() {
      this.visible = false;
    },
    // 重置
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };
    }
  }
}
</script>

<style scoped>

</style>
