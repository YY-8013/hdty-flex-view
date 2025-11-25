<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-xs"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-row>
          <el-form-item label="日志内容">
            {{ detailData.message }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间">
              {{ $utilDate.dateFtt(detailData.timestamp, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日志等级">
              {{ detailData.levelStringMc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线 程 名">
              {{ detailData.threadName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户端IP">
              {{ detailData.clientIp }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用 户 名">
              {{ detailData.currentUsername }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="唯一标识">
              {{ detailData.opeCardId }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作单位">
              {{ detailData.companyName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端编号">
              {{ detailData.terminalId }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块名称">
              {{ detailData.opeModuleName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作类型">
              {{ detailData.opeTypeMc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户端类型">
              {{ detailData.clientTypeMc }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作系统">
              {{ detailData.opeSystem }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作条件">
              {{ detailData.opeCondition }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="logger名">
            {{ detailData.loggerName }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="logger MDC">
            {{ detailData.referenceFlag }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="调用者类名">
            {{ detailData.callerClass }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调用者函数">
              {{ detailData.callerMethod }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用者文件名">
              {{ detailData.callerFilename }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="程序项目名">
              {{ detailData.applicationName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码所在行数">
              {{ detailData.callerLine }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {hdForm} from "@/utils/util-framework";
  import {getDetail} from '@/api/log';

  export default {
    name: "LogDetail",
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
        detailData: {},
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
          id: _this.row.id
        };
        // Lambda写法
        getDetail(dataParams).then(response => {
          // 响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.detailData = data;
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
        this.detailData = {};
      }
    }
  }
</script>

<style scoped>

</style>
