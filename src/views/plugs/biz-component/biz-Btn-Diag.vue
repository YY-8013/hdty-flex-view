<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="(row && row.path === '/pages/hand-over/hand-over' && visible)? '50%':'80%'"
    append-to-body
  >
    <hd-pane fit>
      <!-- 如果是民警选择-->
      <biz-mj-select
        v-if="row && row.path === '/pages/select-police/list' && visible"
        @currentChanged="handleChanged"
      ></biz-mj-select>
      <!-- 一标三实核实-实有人口-->
      <biz-syrk-check
        v-if="row && row.menuUrl === '/pages/real-person/task-check' && visible"
        :gmsfhm="formData.taskYwbm"
        :ckdz="formData.xzdz"
        @currentChanged="handleChanged"
      ></biz-syrk-check>
      <!-- 任务移交-->
      <biz-task-yj
        v-if="row && row.path === '/pages/hand-over/hand-over' && visible"
        :xzdz="formData.taskAddress || formData.xzdz"
        :taskId="row.taskId"
        :yjyyLabel="row.yjAddressLabel?row.yjAddressLabel:'现住地址'"
        @currentChanged="handleChanged"
        @cancelForm="visible = false"
      ></biz-task-yj>
      <!-- 实有房屋选择-->
      <biz-syfw-select
        v-if="row && row.menuUrl === '/pages/query/house/list' && visible"
        @currentChanged="handleChanged"
      ></biz-syfw-select>
      <!-- 实有单位选择-->
      <biz-sydw-select
        v-if="row && row.path === 'selectSydw' && visible"
        :ywlb="ywlb.length > 0 ? ywlb : ['50']"
        @currentChanged="handleChanged"
      ></biz-sydw-select>
      <!-- 从业人员核查-->
      <biz-employees-check
        v-if="row && row.menuUrl === '/pages/employed-person/check/check' && visible"
        :gmsfhm="formData.sfzh"
        :ywId="formData.wybs"
        @currentChanged="handleChanged"
      ></biz-employees-check>
      <!-- 子系统跳转-->
      <iframe-view
        style="min-height: calc(100vh - 80px)"
        v-if="systemParamVisible && visible"
        :path="row.webPath"
        :appId="row.appId"
        :subpage="systemParam.subpage"
        :bodypage="systemParam.bodypage"
        :params="systemParam.params"
        :transform="systemParam.transform"
      ></iframe-view>
    </hd-pane>
  </el-dialog>
</template>
<script>
import BizMjSelect from './child/biz-mj-select.vue';
import BizTaskYj from './child/biz-task-yj.vue';
import BizSyfwSelect from './child/biz-syfw-select.vue';
import BizEmployeesCheck from "./child/biz-employees-check.vue";
import IframeView from '@/relies/IframeView';

export default {
  name: 'TaskCenterFinish',
  components: { BizSyfwSelect, BizTaskYj, BizMjSelect, IframeView, BizEmployeesCheck},
  provide() {
    return {
      RealPersonList: this
    };
  },
  data() {
    return {
      visible: false,
      title: '',
      row: null,
      formData: null,
      RealPerson: {
        activeTab: '99'
      },
      // 子系统接入参数
      systemParam: {
        subpage: true,
        bodypage: true,
        transform: true,
        params: {}
      },
      systemParamVisible: false,
      ywlb: [],
      isDetail: false
    };
  },
  mounted() {
    let _this = this;
    // 获取并监听传递来的数据
    window.addEventListener('message', function (messageEvent) {
      var data = messageEvent.data;
      if (data && data.cmd === 'hdty-zhpcs-task' && data.params) {
        _this.visible = false;
        if (data.params && data.params.isCancel) {
          this.visible = false;
        } else {
          _this.$emit('currentChanged', data.params);
        }
      }
    });
  },
  destroyed() {
    window.removeEventListener('message', function () {});
  },
  methods: {
    handleParams() {
      console.log(this.formData, 'formDatadiag', this.row);

      this.systemParamVisible = false;
      // 处理子系统参数
      if (this.row.params && this.row.webPath) {
        if (this.$utilStr.isArray(this.row.params)) {
          this.row.params.forEach((e) => {
            this.$set(this.systemParam.params, e, this.formData[e]);
          });
        } else {
          for (var name in this.row.params) {
            if (this.row.params[name]) {
              this.$set(
                this.systemParam.params,
                name,
                this.formData[this.row.params[name]]
              );
            }
          }
        }
        if (this.row.extraParams) {
          for (var name in this.row.extraParams) {
            if (this.row.extraParams[name]) {
              this.$set(
                this.systemParam.params,
                name,
                this.row.extraParams[name]
              );
            }
          }
        }
        this.$set(this.systemParam.params, 'isFromTask', '1');
        this.$set(this.systemParam.params, 'isDetail', this.isDetail);
        this.systemParamVisible = true;
      }
    },
    handleChanged(item) {
      this.visible = false;
      let map = {
        data: item,
        row: this.row
      };
      this.$emit('currentChanged', map);
    }
  }
};
</script>

<style scoped>
</style>
