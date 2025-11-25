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
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item prop="vo.title" label="消息标题">
          {{ formData.vo.title }}
        </el-form-item>
        <el-form-item prop="vo.description" label="消息内容">
          {{ formData.vo.description }}
        </el-form-item>
        <el-form-item prop="vo.msgType" label="消息主题">
          {{ formData.vox.msgType }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.readType" label="读取状态">
              <el-tag :type="formData.vo.readType===$global.dictItem.msgReadStatus.unRead?'danger':'success'">{{ formData.vox.readType }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="formData.vo.readTime" prop="vo.readTime" label="读取时间">
              {{ $utilDate.dateFtt(formData.vo.readTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="formData.vo.appId !== $utilLogin.getAppId()" prop="vo.appId" label="消 息 源">
          {{ formData.vox.appId }}
        </el-form-item>
        <el-form-item prop="vo.createTime" label="发送时间">
          {{ $utilDate.dateFtt(formData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </el-form-item>
        <el-form-item prop="vo.memo" label="备  注">
          {{ formData.vo.memo }}
        </el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { detail } from '@/api/msg';
  export default {
    name: "MsgDetail",
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
          vo: {},
          vox: {}
        },
        // 行
        row: {},
        // 显示
        visible: false
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
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
            _this.hdList.loadList();
            appMessage.$emit('mqtt-message', {
              type: 'count',
              data: -1
            });
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
