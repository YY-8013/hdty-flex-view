## easy-player安装使用步骤

#### 1.安装依赖

npm install @easydarwin/easyplayer --save

#### 2.复制文件到静态文件目录下

将**<u>node_modules/@easydarwin/easyplayer/dist/element</u>**文件夹下的crossdomain.xml、EasyPlayer.wasm、EasyPlayer-element.min.js复制到静态文件static/public下，可创建目录easyPlayer，把3个文件放进去

#### 3.在index.html文件中引入

> ​	src的地址为3个文件存放的目录地址

    <script type="text/javascript" src="<%= process.env.NODE_PATH %>/static/public/js/easyPlayer/EasyPlayer-element.min.js?t=<%= new Date().getTime() %>"></script>

#### 4.在组件中引用

```vue
    <hd-video-easy-player
      :visible.sync="playerOptions.visible"
      :session="playerOptions.session"
      :poster="playerOptions.poster"
      :videoTitle="playerOptions.title"
      :sources-src="playerOptions.sourcesSrc"
      @beforeClose="liveStop"
    >
    </hd-video-easy-player>
```

- 当选择一个视频点击播放的时候，

```vue
// 示例：动态获取地址，播放直播
  handleDetail(device) {
    console.log('device',device)
    let _this = this;
    if(device.deviceImage) _this.playerOptions.poster = device.deviceImage;
    let param = {
      deviceId: device.vo.id,
    };
    _this.vedioLoading = true;
    // 需要在这个页面添加loading，用来获取播放地址
    // 获取直播地址
    live(param).then( response => {
      let {success, data} = response.data;
      if (success) {
        _this.playerOptions.session = data.sessionId;
        _this.playerOptions.sourcesSrc = data.playUrl;
        _this.playerOptions.title = data.title;
        _this.playerOptions.visible = true;
        // _this.updateState();
      }else {
        _this.$message({
          message: data.msg,
          customClass: 'is-fixed',
          type: 'warning',
        });
        _this.liveStop();
      }
    }).catch( error => {
      console.error(error);
    }).finally(()=>{
      _this.vedioLoading = false;
    })
  },

	// 如果动态加载直播地址，可在页面设置loading状态
<div v-loading="vedioLoading" element-loading-text="视频正在努力加载中" element-loading-spinner="el-icon-loading">
     内容
</div>

  
  如果播放地址需要上报直播状态或者手动关闭直播，需要在获取直播地址后、关闭弹框后分别调用对应方法
  
  // 上报直播状态
  updateState() {
    let _this = this;
    if (!_this.playerOptions.session || '0' !== _this.playerOptions.playMode) return;
    let params = {
      sessionId: _this.playerOptions.session,
    };
    updateLiveState(params).then(response => {
      let { success, data } = response.data;
      if (!success) {
        _this.$message({
          message: data.msg,
          customClass: 'is-fixed',
          type: 'error',
        })
      }
    }).catch(error => {
      console.error(error);
    }).finally( () => {
      if(_this.timerConn) {
        clearTimeout(_this.timerConn);
      }
      _this.timerConn = setTimeout(_this.updateState, _this.reportVideoTime);
    })
  },
  // 直播停止
  liveStop() {
    let _this = this;
    if(!_this.playerOptions.session || '0' !== _this.playerOptions.playMode) return;
    clearTimeout(_this.timerConn);
    _this.playerOptions.sourcesSrc = '';
    let param = {
      sessionId: _this.playerOptions.session,
    };
    stopVideoPlay(param).then(response => {
      let {success, data} = response.data;
      if (!success) {
        _this.$message({
          message: data.msg,
          customClass: 'is-fixed',
          type: 'error',
        });
      }
    }).catch( error => {
      console.error(error);
    }).finally( () => {
      _this.playerOptions.session = '';
    })
  },
```



#### 5.视频播放的弹框为lenon主题，如果没有此样式，可在样式文件中引用

复制样式代码至 assets/hdtyui/css/modules/layer.scss

```scss
 &[lenon] {
    .el-dialog {
      background-color: transparent;
      -webkit-box-shadow: none;
      box-shadow: none;
      .el-dialog__header {
        padding: 6px;
        background-color: transparent;
		height: 32px;
        border: none;
        .el-dialog__title {
          @include ft_base_color_first;
          font-weight: 500;
          opacity: .8;
        }
        .el-dialog__headerbtn {
          top: 0;
          .el-dialog__close {
            padding: 2px;
            border-width: 1px;
            border-style: solid;
            @include bd_base_color_first;
            border-radius: 50%;
            @include ft_base_color_first;
            font-size: 18px;
            font-weight: 900;
            opacity: .8;
          }
        }
      }
      .el-dialog__body {
        padding: 0;
        @include bs_shadow_dark_color_second(0 1px 3px);
      }
    }
  }

  变量添加至themes/theme.scss
  @mixin bs_shadow_dark_color_second($shadow, $important: null) {
  [theme-alias^="classical-green"] & {
    -webkit-box-shadow: $shadow $classical-green-shadow-dark-color-second $important;
    box-shadow: $shadow $classical-green-shadow-dark-color-second $important;
  }
  [theme-alias^="police-blue"] & {
    -webkit-box-shadow: $shadow $police-blue-shadow-dark-color-second $important;
    box-shadow: $shadow $police-blue-shadow-dark-color-second $important;
  }
  [theme-alias^="ocean-blue"] &, [dashboard] & {
    -webkit-box-shadow: $shadow $ocean-blue-shadow-dark-color-second $important;
    box-shadow: $shadow $ocean-blue-shadow-dark-color-second $important;
  }
}
```



```scss
$classical-green-shadow-dark-color-first: rgba(0, 0, 0, .7);
$classical-green-shadow-dark-color-second: rgba(0, 0, 0, .4);
$classical-green-shadow-dark-color-third: rgba(0, 0, 0, .2);
$classical-green-shadow-dark-color-fourth: rgba(0, 0, 0, .1);

$police-blue-shadow-dark-color-first: rgba(0, 0, 0, .7);
$police-blue-shadow-dark-color-second: rgba(0, 0, 0, .4);
$police-blue-shadow-dark-color-third: rgba(0, 0, 0, .3);
$police-blue-shadow-dark-color-fourth: rgba(0, 0, 0, .2);

$ocean-blue-shadow-dark-color-first: rgba(0, 0, 0, .7);
$ocean-blue-shadow-dark-color-second: rgba(0, 0, 0, .4);
$ocean-blue-shadow-dark-color-third: rgba(17, 168, 239, .2);
$ocean-blue-shadow-dark-color-fourth: rgba(17, 168, 239, .1);
```