<template>
  <div class="editor-container">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
      ref="toolbarRef"
    />
    <Editor
      v-model="editorHtml"
      :defaultConfig="editorConfig"
      style="height: 500px"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';

export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    },
    uploadUrl: {
      type: String,
      default: appEnv.baseURL + '/web/fk/fkXcjy/photo/add'
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    isBase64: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    uploadFileName: {
      type: String,
      default: 'photo'
    },
    uploadImgAccept: {
      type: Array,
      default: () => ['jpg', 'jpeg', 'png', 'gif']
    }
  },
  data() {
    return {
      editorRef: null,
      editorHtml: this.value,
      toolbarConfig: {
        excludeKeys: ['group-video', 'fullScreen'] // 移除视频功能
      },
      editorConfig: {
        placeholder: this.placeholder,
        scroll: true,
        // ========== Word粘贴优化 ==========
        pasteIgnore: false, // 必须关闭
        // ================================
        MENU_CONF: {
          uploadImage: this.isBase64
            ? null
            : {
                server: this.uploadUrl,
                fieldName: this.uploadFileName,
                maxFileSize: this.maxSize,
                allowedFileTypes: this.uploadImgAccept,
                headers: {
                  Authorization: this.$utilLogin.getUserToken()
                },
                // 严格保留您指定的URL格式
                customInsert: (res, insertFn) => {
                  const { data } = res;
                  const imageUrl = `${appEnv.baseURL}${data.relativeUrl}?ossfileid=${data.id}`;
                  insertFn(imageUrl);
                }
              }
        }
      }
    };
  },
  methods: {
    handleCreated(editor) {
      this.editorRef = editor;

      this.$nextTick(() => {
        if (this.editorRef) {
          this.editorRef.setHtml('');
        }
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editorHtml) {
        this.editorHtml = newVal;
      }
    },
    editorHtml(newVal) {
      this.$emit('input', newVal);
    }
  },
  beforeDestroy() {
    if (this.editorRef) {
      this.editorRef.destroy();
      this.editorRef = null;
    }
  }
};
</script>

<style scoped>
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 300px;
}
</style>