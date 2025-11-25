<template>
  <el-dialog
    title="表单预览"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane fit v-loading="loading">
      <!--表单信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-document"></i>
            {{rwForm.formTitle}}
          </div>
        </div>
        <div class="area-body" v-show="rwFormItemConfigList && rwFormItemConfigList.length > 0">
          <dynamic-form ref="DynamicFormRef" :isForbid="false"></dynamic-form>
        </div>
        <div
          class="area-body no-form-item"
          v-show="!rwFormItemConfigList || rwFormItemConfigList.length === 0"
        >{{'暂无数据'}}</div>
      </div>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import { getFormDetail } from './../api';
import DynamicForm from './../taskform/DynamicForm';

export default {
  name: 'NewTaskFormPreview',
  props: {
    // 是否展示
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      NewTaskFormPreview: this,
      ParentPage: this
    };
  },
  mixins: [hdList, hdForm],
  components: {
    DynamicForm
  },
  data() {
    return {
      isShowItem: false,
      // 显示
      visible: false,
      // 行
      row: {
        vo: {},
        vox: {}
      },
      // 表单配置相关
      rwForm: {},
      rwFormItemConfigList: [],
      rwFormItemList: [],
      rwNformObjectList: []
    };
  },
  mounted() {},
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置
        this.resetForm();
        // 加载
        this.loadForm();
        if (this.$refs.DynamicFormRef) {
          this.$refs.DynamicFormRef.isPreview = this.isPreview;
        }
      });
    },
    // 加载
    loadForm() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.formId
      };
      // Lambda写法
      getFormDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 赋值数据
            _this.rwForm = data.rwForm || {};
            _this.rwFormItemConfigList = (data.rwFormItemConfigList || []).map(
              (formItem) => {
                _this.$set(formItem, 'rules', formItem.rules || {});
                return formItem;
              }
            );
            _this.rwFormItemList = data.rwFormItemList || [];
            _this.rwNformObjectList = data.rwNformObjectList || [];
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.rwForm = {};
      this.rwFormItemConfigList = [];
      this.rwFormItemList = [];
      this.rwNformObjectList = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  .label {
    width: 150px !important;
  }
}

.no-form-item {
  color: #878d99;
  text-align: center;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>
