<template>
  <editor v-model="content" :init="init" :disabled="disabled" @onClick="onClick"></editor>
</template>

<script>
import axios from 'axios';
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
// import $configDev from '@/config/configDev';
// 默认样式不生效，需要手动引入样式
import 'tinymce/icons/default/icons.min.js';
import 'tinymce/themes/silver/theme';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/code'; //代码块插件
import 'tinymce/plugins/fullscreen'; //全屏
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/toc';
import lgs from './tinymce/langs/zh_CN';
import skin from './tinymce/skins/ui/oxide/skin.css';

export default {
  name: 'index',
  components: {
    Editor
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否使用图片服务器
    usePicServer: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        'lists image table wordcount code fullscreen toc fullpage autosave nonbreaking insertdatetime visualchars visualblocks searchreplace spellchecker pagebreak charmap paste print preview hr anchor'
    },
    toolbar: {
      type: [String, Array],
      default:
        'newdocument undo redo | formatselect visualaid | alignleft aligncenter alignright alignjustify | fontsizeselect | bold italic underline strikethrough| cut copy paste selectall |codeformat blockformats| superscript subscript  | forecolor backcolor | outdent indent |  removeformat | code  bullist numlist | lists image table | toc fullpage restoredraft nonbreaking insertdatetime visualchars visualblocks searchreplace pagebreak anchor charmap pastetext print preview hr'
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: lgs,
        language: 'zh_CN',
        skin_url: skin,
        height: 500,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        //此处为图片上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
          if (this.usePicServer) {
            // 走图片服务器 ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
            let formData = new FormData();
            formData.append('file', blobInfo.blob());
            axios
              .post(appEnv.baseURL + '/cmsFile/uploadFast', formData)
              .then((response) => {
                if (response.status === 200) {
                  success('' + response.data.data.serverPath); // 这里的 '' 里写入 $configDev.configDev.fastdfsURL
                } else {
                  failure('上传失败！');
                }
              })
              .catch((error) => {
                failure('上传失败！');
              });
          } else {
            // 这个直接用了base64的图片形式上传图片
            const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            success(img);
          }
        }
      },
      content: this.value
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    onClick(e) {
      this.$emit('onClick', e, tinymce);
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.content = '';
    }
  },
  watch: {
    value(text) {
      this.content = text;
    },
    content(text) {
      this.$emit('input', text);
    }
  }
};
</script>
<style scoped>
</style>
