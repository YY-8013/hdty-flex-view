<template>
  <div class="hdty-camera">
    <div
      v-loading="witnessing"
      class="hdty-camera-wrapper"
      :style="activeWrapperStyle">
      <video
        ref="video"
        width="100%"
        height="100%"
        :poster="videoPoster"
        :class="{'hdty-flip-h': flipped}"
        autoplay>
        浏览器不支持video
      </video>
      <div v-if="selector" class="hdty-camera-select">
        <el-select
          v-if="constraints && constraints.length > 0"
          v-model="activeIndex"
          :size="size"
          @change="handleCameraChange">
          <el-option
            v-for="(item, index) in constraints"
            :key="index"
            :label="item.video.label"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <div v-if="manipulator" class="hdty-camera-tool">
        <el-button
          v-if="!automatic"
          :loading="calling"
          type="success"
          :size="size"
          plain
          @click="callCamera">
          连&emsp;接
        </el-button>
        <el-button
          :loading="taking"
          type="success"
          :size="size"
          @click="photograph">
          拍&emsp;照
        </el-button>
      </div>
    </div>
    <ul
      v-if="preview"
      class="hdty-camera-preview hdty-scroll"
      :style="{ height: activeWrapperStyle.height }">
      <div class="hdty-scrollbar">
        <li
          v-for="(item, index) in photos"
          :key="index"
          class="hdty-preview-item">
          <hd-image v-model="photos[index]">
          </hd-image>
          <div class="hdty-preview-clear" @click="handlePreviewClear(index)">
            <i class="icon-cancel"></i>
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
  import { compareFaceWeb } from "@/api/device";
  export default {
    name: "index",
    provide() {
      return {
        hdCamera: this
      };
    },
    props: {
      prop: String,
      // 绑定值
      value: {
        type: [String, Object, File],
        default: ''
      },
      // 拍照输出的数据对象（file / base64）
      outputModel: {
        type: String,
        default: 'file'
      },
      // 拍照输出图片的名称
      outputName: {
        type: String,
        default: ''
      },
      // 拍照输出图片的类型
      outputType: {
        type: String,
        default: 'png'
      },
      // 拍照输出图片的质量（0 到 1 的区间）
      outputQuality: {
        type: Number,
        default: 1
      },
      // 拍照输出图片的宽度
      outputImgWidth: {
        type: Number,
        default: 900
      },
      // 拍照输出图片的高度
      outputImgHeight: {
        type: Number,
        default: 600
      },
      // 默认激活设备
      active: {
        type: Number,
        default: 0
      },
      // 尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 自动连接
      automatic: {
        type: Boolean,
        default: true
      },
      // 开启设备选择器
      selector: {
        type: Boolean,
        default: true
      },
      // 开启操作控制器
      manipulator: {
        type: Boolean,
        default: true
      },
      // 开启镜面反转
      specular: {
        type: Boolean,
        default: false
      },
      // 开启图片预览
      preview: {
        type: Boolean,
        default: false
      },
      // 开启人证核验
      witness: {
        type: Boolean,
        default: false
      },
      // 是否保存图片至本地
      preserved: {
        type: Boolean,
        default: false
      },
      // 宽度
      width: {
        type: [Number, String],
        default: 640
      },
      // 高度
      height: {
        type: [Number, String],
        default: 480
      }
    },
    data () {
      return {
        // 视频海报
        videoPoster: '',
        // 视频设备
        constraints: [],
        // 当前激活设备
        activeIndex: this.active,
        // 当前照片文件
        currentImageFile: null,
        // 当前照片base64
        currentImageBase64: '',
        // 照片
        photos: [],
        // 身份证数据
        idcard: null,
        // hdtySocket实例
        hdtySocket: null,
        // 是否水平翻转视频
        flipped: false,
        // 连接中
        calling: false,
        // 拍照中
        taking: false,
        // 核验中
        witnessing: false,
      }
    },
    computed: {
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height),
          marginBottom: this.$utilElem.pixelsFtt(this.manipulator ? 50 : null)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      active: {
        handler(val) {
          this.activeIndex = val
        },
        immediate: false
      }
    },
    created() {
      // 初始化
      this.init();
      this.setPoster();
      if(this.witness) {
        this.hdtySocket = this.$socket.init();
      }
    },
    beforeDestroy() {
      // 关闭连接
      this.closeCamera();
      if(this.witness) {
        this.handleReaderClose();
        this.hdtySocket.close();
      }
    },
    methods: {
      // 初始化
      init() {
        navigator.mediaDevices.enumerateDevices().then(
          this.gotDevices
        ).catch(error => {
          this.$emit('currentOpened', false);
          console.error(error);
        });
      },
      // 调用摄像头
      callCamera () {
        this.calling = true;
        // H5调用电脑摄像头API
        navigator.mediaDevices.getUserMedia(
          this.constraints[this.activeIndex]
        ).then(success => {
          this.$emit('currentOpened', true);
          // 摄像头开启成功
          this.$refs.video.srcObject = success;
          // 实时拍照效果
          this.$refs.video.play();
          // 开启镜面反转
          if(this.specular) {
            this.videoPoster = '';
            this.flipped = true;
          }
          // 开启人证核验
          if(this.witness) {
            this.handleReader();
          }
        }).catch(error => {
          this.$emit('currentOpened', false);
          console.error('摄像头开启失败，请检查摄像头是否可用');
        }).finally(() => {
          this.calling = false;
        });
        // // H5调用电脑摄像头API
        // navigator.mediaDevices.getUserMedia({
        //   video: true
        // }).then(success => {
        //   // 摄像头开启成功
        //   this.$refs.video.srcObject = success;
        //   // 实时拍照效果
        //   this.$refs.video.play();
        // }).catch(error => {
        //   console.error('摄像头开启失败，请检查摄像头是否可用');
        // });
      },
      // 遍历所有的设备，包括视频和音频设备，找出视频设备
      gotDevices(deviceInfos) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          let deviceInfo = deviceInfos[i];
          if (deviceInfo.kind === 'videoinput') {
            this.constraints.push({
              video: {
                deviceId: deviceInfo.deviceId,
                label: this.$utilStr.trimParenthesesContent(deviceInfo.label)
              }
            });
          }
        }
        if (window.stream) {
          window.stream.getTracks().forEach(function(track) {
            track.stop();
          });
        }
        // 打开摄像头
        if(this.automatic) {
          this.callCamera();
        }
      },
      // 拍照
      photograph () {
        this.taking = true;
        let cvs = document.createElement('canvas');
        cvs.width = this.outputImgWidth;
        cvs.height = this.outputImgHeight;
        let cxt = cvs.getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        cxt.drawImage(this.$refs['video'], 0, 0, cvs.width, cvs.height);
        // 转base64格式、图片格式转换、图片质量压缩
        this.currentImageBase64 = cvs.toDataURL(this.$utilFile.assetTypeToAcceptType(this.outputType), this.outputQuality);
        // 图片名称
        let filename = this.$utilFile.appendFileExtension(this.outputName, this.outputType);
        // 转file格式
        this.currentImageFile = this.$utilFile.base64ToFile(this.currentImageBase64, filename);
        // 图片URL
        let url = URL.createObjectURL(this.currentImageFile);
        // 图片字节
        let str = this.$utilFile.removeBase64Prefix(this.currentImageBase64);
        let strLength = str.length;
        let fileLength = strLength - (strLength / 8) * 2;
        // 图片尺寸（由字节转换为KB）
        let size = this.$utilStr.upFixed(fileLength / 1024, 2);
        // 照片预览
        if(this.preview) {
          this.photos.push(url);
        }
        // 人证核验
        if(this.witness) {
          this.handleWitness();
        }
        // 保存到本地
        if(this.preserved) {
          this.$utilFile.downloadBase64(this.currentImageBase64, filename);
        }
        if(this.outputModel === 'file') {
          if(!this.witness) {
            this.$emit('input', this.currentImageFile);
          }
          this.$emit('currentPhotographed', this.currentImageFile, filename, url, size);
        }else if(this.outputModel === 'base64') {
          if(!this.witness) {
            this.$emit('input', this.currentImageBase64);
          }
          this.$emit('currentPhotographed', this.currentImageBase64, filename, url, size);
        }
        this.taking = false;
      },
      // 关闭摄像头
      closeCamera () {
        if (!this.$refs.video.srcObject) return;
        let stream = this.$refs.video.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
        this.$refs.video.srcObject = null;
        if(this.flipped) {
          this.setPoster();
          this.flipped = false;
        }
      },
      // 设置海报
      setPoster() {
        if(this.automatic) {
          this.videoPoster = process.env.NODE_PATH + '/static/public/images/video/theme-classical-green/bg-002.gif';
        }else {
          this.videoPoster = process.env.NODE_PATH + '/static/public/images/video/theme-classical-green/bg-003.gif';
        }
      },
      // 切换设备
      handleCameraChange() {
        this.closeCamera();
        this.callCamera();
      },
      // 调用读卡
      handleReader() {
        let _this = this;
        this.hdtySocket.idcardloop(function(res) {
          let { success, data } = res;
          if(success) {
            _this.idcard = data;
          }
          _this.$emit('currentReader', res);
        });
      },
      // 人证核验
      handleWitness() {
        this.witnessing = true;
        // 参数
        let formData = new FormData();
        formData.append('cardId', this.idcard.cardid);
        formData.append('name', this.idcard.name);
        formData.append('file', this.currentImageFile);
        // Lambda写法
        compareFaceWeb(formData).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            if(this.outputModel === 'file') {
              this.$emit('input', this.currentImageFile);
            }else if(this.outputModel === 'base64') {
              this.$emit('input', this.currentImageBase64);
            }
            let witData = {
              idcard: this.idcard,
              result: data
            };
            this.$emit('currentWitnessed', witData);
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          this.witnessing = false;
        });
      },
      // 清除预览
      handlePreviewClear(index) {
        this.photos.splice(index, 1);
      },
      // 关闭读卡
      handleReaderClose() {
        this.hdtySocket.stopidcardloop();
      }
    }
  }
</script>

<style scoped>

</style>
