<template>

</template>

<script>
  export default {
    name: "Upload",
    provide() {
      return {
        hdUpload: this
      };
    },
    data() {
      return {
        // 上传文件类型
        acceptType: ['jpeg', 'png'],
        // 上传文件大小（单位MB，0代表不限制）
        acceptSize: 3,
        // 输出的数据对象（file / base64）
        outputModel: 'file',
        // 回调函数
        callback: null
      }
    },
    mounted() {
      this.create();
    },
    methods: {
      create() {
        // 创建临时input元素
        let fileInput = document.createElement('input');
        // 设置input type为文件类型
        fileInput.type = 'file';
        // 设置input接受类型
        let acceptType = '';
        if(Array.isArray(this.acceptType)) {
          let arr = [];
          for (let e of this.acceptType) {
            let type = this.$utilFile.assetTypeToAcceptType(e);
            if(type) {
              arr.push(type)
            }
          }
          acceptType = this.$utilStr.arrayJoin(arr, ',');
        }else {
          acceptType = this.$utilFile.assetTypeToAcceptType(this.acceptType);
        }
        fileInput.accept = acceptType;
        fileInput.onchange = change.bind(this);
        // 触发input点击事件，弹出选择文件对话框
        fileInput.click();
        function change() {
          let files = fileInput.files;
          let file = files[0];
          let isAccept = false;
          let acceptType = [];
          if(Array.isArray(this.acceptType)) {
            acceptType = this.acceptType;
          }else {
            acceptType.push(this.acceptType);
          }
          acceptType.forEach(e => {
            isAccept = isAccept || file.type === this.$utilFile.assetTypeToAcceptType(e);
          });
          const isSize = !Number(this.acceptSize) || file.size / 1024 / 1024 < Number(this.acceptSize);
          if (!isAccept) {
            this.$message({
              showClose: true,
              message: '上传文件只能是 ' + this.$utilStr.arrayJoin(acceptType, '/').toUpperCase() + ' 格式',
              type: 'error',
              offset: 76
            });
            return false;
          }
          if (!isSize) {
            this.$message({
              showClose: true,
              message: '上传文件大小不能超过' + this.acceptSize + 'MB',
              type: 'error',
              offset: 76
            });
            return false;
          }
          if(this.outputModel === 'file') {
            this.callback(file, file.name);
          }else if(this.outputModel === 'base64') {
            this.$utilFile.fileToBase64(file, base64 => {
              this.callback(base64, file.name);
            })
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
