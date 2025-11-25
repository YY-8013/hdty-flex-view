<template>
  <li class="hdty-links-item">
    <a href="javascript:;" @click="handleClick">
      <slot></slot>
    </a>
    <el-dialog
      v-if="mode === 'dialog'"
      :title="dialogTitle"
      :custom-class="activeDialogCustomClass"
      :visible.sync="visible"
      append-to-body
    >
      <hd-pane :height="dialogHeight">
        <iframe-view
          v-if="visible"
          :path="path"
          :app-id="appId"
          :app-client="appClient"
          :params="params"
          :images="images"
          :super-params="superParams"
          :super-images="superImages"
          :subpage="subpage"
          :bodypage="bodypage"
          :landing="landing"
          :forward="forward"
          :transform="transform"
        >
        </iframe-view>
      </hd-pane>
      <div slot="footer" v-if="showFooter" class="hdty-btn-container">
        <el-button type="primary" @click="cancelForm">确 定</el-button>
      </div>
    </el-dialog>
  </li>
</template>

<script>
import IframeView from "@/relies/IframeView";
export default {
  name: "HdLinksItem",
  components: {
    IframeView
  },
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    // 跳转路径
    path: {
      type: String,
      default: ""
    },
    // 目标程序身份标识
    appId: {
      type: [Number, String],
      default: ""
    },
    // 目标程序客户端标识
    appClient: {
      type: [Number, String],
      default() {
        return appEnv.clientTYPE;
      }
    },
    // 跳转请求参数
    params: {
      type: Object,
      default: null
    },
    // 跳转请求图像参数
    images: {
      type: Object,
      default: null
    },
    // 最高权重跳转请求参数
    superParams: {
      type: Object,
      default: null
    },
    // 最高权重跳转请求图像参数
    superImages: {
      type: Object,
      default: null
    },
    // 是否仅作为子页面
    subpage: {
      type: Boolean,
      default: null
    },
    // 是否只显示主内容
    bodypage: {
      type: Boolean,
      default: null
    },
    // 是否进行登录认证
    landing: {
      type: Boolean,
      default: null
    },
    // 是否转接跳转参数
    forward: {
      type: Boolean,
      default: true
    },
    // 是否转换跳转路径
    transform: {
      type: Boolean,
      default: true
    },
    // 模式（dialog / window / pagetab）
    mode: {
      type: String,
      default: "dialog"
    },
    // 会话窗口标题
    dialogTitle: {
      type: String,
      default: "详情"
    },
    // 会话窗口尺寸（large / medium / small / mini / fit）
    dialogSize: {
      type: String,
      default: "large"
    },
    // 会话窗口的自定义类名
    dialogClass: {
      type: String,
      default: ""
    },
    // 会话窗口高度
    dialogHeight: {
      type: [Number, String],
      default: 700
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    activeDialogCustomClass() {
      if (this.dialogClass) {
        return this.dialogClass;
      } else {
        if (this.dialogSize === "large") {
          return "hdty-dialog-large";
        } else if (this.dialogSize === "medium") {
          return "hdty-dialog-medium";
        } else if (this.dialogSize === "small") {
          return "hdty-dialog-small";
        } else if (this.dialogSize === "mini") {
          return "hdty-dialog-mini";
        } else if (this.dialogSize === "fit") {
          return "hdty-dialog-fit";
        } else {
          return this.dialogSize;
        }
      }
    }
  },
  methods: {
    handleClick() {
      if (this.mode === "window") {
        this.$utilLink.getLinkPageURL({
          path: this.path,
          appId: this.appId,
          appClient: this.appClient,
          params: this.params,
          images: this.images,
          superParams: this.superParams,
          superImages: this.superImages,
          subpage: this.subpage,
          bodypage: this.bodypage,
          landing: this.landing,
          forward: this.forward,
          transform: this.transform,
          callback: ({ fullPath }) => {
            window.open(fullPath, "_blank");
          }
        });
      } else if (this.mode === "pagetab") {
        this.$utilLink.getLinkPageURL({
          path: this.path,
          appId: this.appId,
          appClient: this.appClient,
          params: this.params,
          images: this.images,
          superParams: this.superParams,
          superImages: this.superImages,
          subpage: this.subpage,
          bodypage: this.bodypage,
          landing: this.landing,
          forward: this.forward,
          transform: this.transform,
          callback: ({ path, params }) => {
            this.$router.push({ path: path, query: params });
          }
        });
      } else {
        this.visible = true;
      }
    },
    cancelForm() {
      this.visible = false;
    }
  }
};
</script>

<style scoped></style>
<style lang="scss" scoped>
::v-deep .dp-jsc-dialog.el-dialog {
  background: rgba(8, 43, 74, 0.85) !important;
  border: 1px solid #74ecfc !important;
  box-shadow: 0 0 20px 0 #74f3fc !important;
  border-radius: 10px !important;

  width: 80%;

  .el-dialog__header {
    background-color: transparent !important;
    border-color: #74ecfc !important;
    padding: 5px 30px !important;
  }

  .el-dialog__body {
    padding: 5px;
  }
}
</style>
