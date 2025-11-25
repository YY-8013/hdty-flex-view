<template>
  <div class="hdty-container hdty-scroll">
    <div class="hdty-blockquote hdty-blockquote-light">
      本篇主要介绍如何链接一个其他网站页面，包括链接本系统、子系统或外部网站，以及如何配置本系统、子系统只显示主体内容或显示全部内容等。 注意一些关键配置属性的使用，如：
      <br>
      （1）bodypage为true，表示链接的当前页面只显示主体内容，反之表示显示全部内容；
      <br>
      （2）subpage为true，表示链接的当前页面是作为上级子页面，将不再处理上级页面的一些数据或流程，如系统水印、未读消息、mqtt连接等，反之表示当前页面是作为最上级页面，要处理一些数据或流程。
      <br>
      （3）landing为true，表示链接的当前页面将自动进行登录认证，反之不会进行登录认证。
      <br>
      （4）forward为true，表示链接的当前页面将会转接父级页面的路由参数，反之不会转接父级页面的路由参数。
      <br>
      （5）transform为true，表示链接的当前页面地址会根据条件与接入系统表或菜单表数据进行转换，反之不会进行转换，只进行条件拼接。
      <br>
      （6）appId属性，表示目标系统身份标识，当transform为true时，如果设置了appId，链接的当前页面地址会根据设置的值与接入系统表数据进行转换，如果没有设置appId，则与菜单表数据进行转换，而当transform为false时，不会进行任何转换，只进行条件拼接。
      <br>
      （7）appClient属性，表示目标系统客户端标识，当transform为true时，如果设置了appClient，链接的当前页面地址会根据设置的值与接入系统表或菜单表数据进行转换，而当transform为false时，不会进行任何转换，只进行条件拼接。
      <br>
    </div>
    <div class="hdty-blockquote hdty-blockquote-light">
      链接一个其他网站页面时，链接参数的五层优先级从低到高如下说明：
      <br>
      （1）第一层优先级，也是最低的优先级为初始参数，包括初始设置的params属性和images属性。
      <br>
      （2）第二层优先级为父级参数，包括父级路由设置的params属性和query属性。
      <br>
      （3）第三层优先级为默认参数，包括默认设置的landing属性、appId属性、appClient属性、subpage属性和bodypage属性。
      <br>
      （4）第四层优先级为原始参数，仅包括原始设置的链接页面地址上的URLParameters属性。
      <br>
      （5）第五层优先级，也是最高的优先级为最高权重参数，包括最高权重设置的superParams属性和superImages属性。
      <br>
      同时，请注意，在通过一、二、四、五优先级自定义设置链接参数时，除非特殊情况，链接参数需要避免使用一些链接关键字作为属性，包括path、appId、appClient、params、images、superParams、superImages、subpage、bodypage、landing、redirecting、forward和transform，否则将会影响对链接配置属性的识别，从而产生代码逻辑的偏离。
    </div>
    <fieldset class="hdty-fieldset-title">
      <legend>自定义按钮</legend>
    </fieldset>
    <div class="hdty-blockquote hdty-blockquote-light">
      如需跳转至页面新选项卡，前提必须在本系统中拥有路由信息，通过本系统中的路由地址跳转。
    </div>
    <div class="hdty-btn-container">
      <el-button @click="handleMyPageWin">
        本系统页面跳转至浏览器新窗口
      </el-button>
      <el-button @click="handleMyPageTab">
        本系统页面跳转至页面新选项卡
      </el-button>
      <el-button @click="handleJoinPageWin">
        子系统页面跳转至浏览器新窗口
      </el-button>
      <el-button @click="handleJoinPageTab">
        子系统页面跳转至页面新选项卡
      </el-button>
      <el-button @click="handleOutsideWebWin">
        外部网站跳转至浏览器新窗口
      </el-button>
      <el-button @click="handleOutsideWebTab">
        外部网站跳转至页面新选项卡
      </el-button>
    </div>
    <fieldset class="hdty-fieldset-title">
      <legend>自定义导航条</legend>
    </fieldset>
    <hd-links>
      <span slot="title">
        链接菜单
      </span>
      <hd-links-item
        :path="myPageBody.path"
        :subpage="myPageBody.subpage"
        :bodypage="myPageBody.bodypage"
        :transform="myPageBody.transform"
        dialog-title="本系统页面">
        本系统页面会话层打开
      </hd-links-item>
      <hd-links-item
        :path="myPageLayout.path"
        :subpage="myPageLayout.subpage"
        :bodypage="myPageLayout.bodypage"
        :transform="myPageLayout.transform"
        mode="window">
        本系统页面新窗口打开
      </hd-links-item>
      <hd-links-item
        :path="joinPageBody.path"
        :appId="joinPageBody.appId"
        :subpage="joinPageBody.subpage"
        :bodypage="joinPageBody.bodypage"
        :transform="joinPageBody.transform"
        dialog-title="子系统页面">
        子系统页面会话层打开
      </hd-links-item>
      <hd-links-item
        :path="joinPageLayout.path"
        :appId="joinPageLayout.appId"
        :subpage="joinPageLayout.subpage"
        :bodypage="joinPageLayout.bodypage"
        :transform="joinPageLayout.transform"
        mode="window">
        子系统页面新窗口打开
      </hd-links-item>
      <hd-links-item
        :path="outsideWebWin.path"
        :transform="outsideWebWin.transform"
        dialog-title="外部网站">
        外部网站会话层打开
      </hd-links-item>
      <hd-links-item
        :path="outsideWebWin.path"
        :transform="outsideWebWin.transform"
        mode="window">
        外部网站新窗口打开
      </hd-links-item>
    </hd-links>
    <fieldset class="hdty-fieldset-title">
      <legend>自定义窗口</legend>
    </fieldset>
    <div class="hdty-fluid">
      <div class="hdty-row hdty-col-space24">
        <div class="hdty-col-md6">
          <div class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                本系统显示全部内容窗口
              </div>
            </div>
            <div class="hdty-card-body">
              <IframeView
                :path="myPageLayout.path"
                :subpage="myPageLayout.subpage"
                :bodypage="myPageLayout.bodypage"
                :transform="myPageLayout.transform"
                :height="400">
              </IframeView>
            </div>
          </div>
        </div>
        <div class="hdty-col-md6">
          <div class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                本系统显示主体内容窗口
              </div>
            </div>
            <div class="hdty-card-body">
              <IframeView
                :path="myPageBody.path"
                :subpage="myPageBody.subpage"
                :bodypage="myPageBody.bodypage"
                :transform="myPageBody.transform"
                :height="400">
              </IframeView>
            </div>
          </div>
        </div>
        <div class="hdty-col-md6">
          <div class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                子系统显示全部内容窗口
              </div>
            </div>
            <div class="hdty-card-body">
              <IframeView
                :path="joinPageLayout.path"
                :appId="joinPageLayout.appId"
                :subpage="joinPageLayout.subpage"
                :bodypage="joinPageLayout.bodypage"
                :transform="joinPageLayout.transform"
                :height="400">
              </IframeView>
            </div>
          </div>
        </div>
        <div class="hdty-col-md6">
          <div class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                子系统显示主体内容窗口
              </div>
            </div>
            <div class="hdty-card-body">
              <IframeView
                :path="joinPageBody.path"
                :appId="joinPageBody.appId"
                :subpage="joinPageBody.subpage"
                :bodypage="joinPageBody.bodypage"
                :transform="joinPageBody.transform"
                :height="400">
              </IframeView>
            </div>
          </div>
        </div>
        <div class="hdty-col-md6">
          <div class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                外部网站窗口
              </div>
            </div>
            <div class="hdty-card-body">
              <IframeView
                :path="outsideWebWin.path"
                :transform="outsideWebWin.transform"
                :height="400">
              </IframeView>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IframeView from '@/relies/IframeView';
  export default {
    name: "ExampleLink",
    components: {
      IframeView
    },
    data() {
      return {
        // 本系统页面显示全部内容配置
        myPageLayout: {
          path: '/',
          subpage: false,
          bodypage: false,
          transform: false
        },
        // 本系统页面显示主体内容配置
        myPageBody: {
          path: '/',
          subpage: true,
          bodypage: true,
          transform: false
        },
        // 本系统页面跳转新选项卡配置
        myPageTab: {
          path: '/',
          subpage: true,
          bodypage: true,
          transform: false
        },
        // 子系统页面显示全部内容配置
        joinPageLayout: {
          path: '/',
          appId: 'hdty-framework-admin',
          subpage: false,
          bodypage: false,
          transform: true
        },
        // 子系统页面显示主体内容配置
        joinPageBody: {
          path: '/',
          appId: 'hdty-framework-admin',
          subpage: true,
          bodypage: true,
          transform: true
        },
        // 子系统页面跳转新选项卡配置
        joinPageTab: {
          path: '/link/join/page',
          subpage: true,
          bodypage: true,
          transform: false
        },
        // 外部网站跳转新窗口配置
        outsideWebWin: {
          path: 'https://v2.cn.vuejs.org',
          transform: false
        },
        // 外部网站跳转新选项卡配置
        outsideWebTab: {
          path: '/link/outside/web',
          transform: false
        }
      }
    },
    methods: {
      // 本系统页面跳转至浏览器新窗口
      handleMyPageWin() {
        this.$utilLink.getLinkPageURL({
          path: this.myPageLayout.path,
          subpage: this.myPageLayout.subpage,
          bodypage: this.myPageLayout.bodypage,
          transform: this.myPageLayout.transform,
          callback: ({ fullPath }) => {
            window.open(fullPath, '_blank');
          }
        });
      },
      // 本系统页面跳转至页面新选项卡
      handleMyPageTab() {
        this.$utilLink.getLinkPageURL({
          path: this.myPageTab.path,
          params: {
            name: '张三'
          },
          subpage: this.myPageTab.subpage,
          bodypage: this.myPageTab.bodypage,
          transform: this.myPageTab.transform,
          callback: ({ path, params }) => {
            this.$router.push({ path: path, query: params });
          }
        });
      },
      // 子系统页面跳转至浏览器新窗口
      handleJoinPageWin() {
        this.$utilLink.getLinkPageURL({
          path: this.joinPageLayout.path,
          appId: this.joinPageLayout.appId,
          subpage: this.joinPageLayout.subpage,
          bodypage: this.joinPageLayout.bodypage,
          transform: this.joinPageLayout.transform,
          callback: ({ fullPath }) => {
            window.open(fullPath, '_blank');
          }
        });
      },
      // 子系统页面跳转至页面新选项卡
      handleJoinPageTab() {
        this.$utilLink.getLinkPageURL({
          path: this.joinPageTab.path,
          subpage: this.joinPageTab.subpage,
          bodypage: this.joinPageTab.bodypage,
          transform: this.joinPageTab.transform,
          callback: ({ path, params }) => {
            this.$router.push({ path: path, query: params });
          }
        });
      },
      // 外部网站跳转至浏览器新窗口
      handleOutsideWebWin() {
        this.$utilLink.getLinkPageURL({
          path: this.outsideWebWin.path,
          transform: this.outsideWebWin.transform,
          callback: ({ fullPath }) => {
            window.open(fullPath, '_blank');
          }
        });
      },
      // 外部网站跳转至页面新选项卡
      handleOutsideWebTab() {
        this.$utilLink.getLinkPageURL({
          path: this.outsideWebTab.path,
          transform: this.outsideWebTab.transform,
          callback: ({ path, params }) => {
            this.$router.push({ path: path, query: params });
          }
        });
      }
    }
  }
</script>

<style scoped>
  fieldset ~ .hdty-btn-container,
  fieldset ~ .hdty-links {
    margin: 0 8px;
  }
  fieldset ~ .hdty-fluid {
    padding: 0 8px;
  }
</style>
