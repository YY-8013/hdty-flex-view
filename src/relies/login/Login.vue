<template>
  <div v-show="!jump" class="hdty-login">
    <div v-if="titleAlign === 'center'" class="hdty-login-header">
      <div class="hdty-logo hdty-content-bottom">
        <span>{{ projectName }}</span>
      </div>
    </div>
    <div class="hdty-login-wrapper">
      <div class="hdty-login-container">
        <div class="hdty-login-content">
          <div class="hdty-fluid hdty-fluid-space48">
            <div class="hdty-row hdty-col-space48">
              <div class="hdty-col-md6">
                <div class="hdty-column hdty-content-middle">
                  <div class="hdty-login-intro">
                    <div
                      v-if="titleAlign === 'left'"
                      class="hdty-logo hdty-logo-text"
                    >
                      <span>{{ projectName }}</span>
                    </div>
                    <div v-if="carouserlEnabled" class="hdty-login-carousel">
                      <el-carousel
                        :class="{ 'is-bomb': bombInfo.enabled }"
                        arrow="never"
                        :interval="4000"
                        autoplay
                        @change="handleChangeCarousel"
                      >
                        <el-carousel-item
                          v-for="(item, index) in carouserlImgs"
                          :key="index"
                        >
                          <img :src="item" />
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                    <div v-else class="hdty-login-banner"></div>
                  </div>
                </div>
              </div>
              <div class="hdty-col-md6">
                <div class="hdty-column hdty-content-middle">
                  <div class="hdty-login-body">
                    <h4>用户登录</h4>
                    <el-form
                      ref="loginForm"
                      :model="loginForm"
                      :rules="rules"
                      :class="{ 'hdty-invisible': dragSuccess }"
                      @submit.native.prevent
                      @keyup.enter.native="validateForm"
                    >
                      <el-form-item prop="username">
                        <el-input
                          type="text"
                          v-model="loginForm.username"
                          suffix-icon="icon-user-o"
                          auto-complete="off"
                          placeholder="账号"
                          maxlength="20"
                        ></el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                        <el-input
                          type="password"
                          v-model="loginForm.password"
                          suffix-icon="icon-lock"
                          auto-complete="off"
                          placeholder="密码"
                          maxlength="16"
                          @change="handlePasswordChange"
                        ></el-input>
                      </el-form-item>
                      <!-- 登录验证码 -->
                      <el-form-item v-if="loginCode.enable" prop="loginCode">
                        <el-input
                          v-model="loginCode.code"
                          auto-complete="off"
                          placeholder="请输入验证码"
                          style="width: 63%"
                          @keyup.enter.native="login"
                        />
                        <div class="login-code">
                          <img
                            :src="loginCode.codeImg"
                            alt
                            @click="getCaptchaCode"
                          />
                        </div>
                      </el-form-item>
                      <!-- 登录验证码 END -->
                      <el-checkbox
                        v-model="checked"
                        @change="handleCheckboxChange"
                        >下次自动登录</el-checkbox
                      >
                    </el-form>
                    <el-popover
                      v-if="sliderEnabled"
                      v-model="visible"
                      placement="top"
                      title="请完成安全验证"
                      width="332"
                      trigger="manual"
                    >
                      <div
                        class="hdty-popover-close"
                        @click="handleClosePopover"
                      ></div>
                      <hd-slide-verify
                        ref="dragRef"
                        :l="42"
                        :r="8"
                        :w="308"
                        :h="154"
                        :imgs="dragImgs"
                        @success="validateSlide"
                      ></hd-slide-verify>
                      <el-button
                        slot="reference"
                        :loading="logining"
                        type="success"
                        class="hdty-login-button"
                        @click="validateForm"
                        >{{ loginName }}</el-button
                      >
                    </el-popover>
                    <el-button
                      v-else
                      :loading="logining"
                      type="success"
                      class="hdty-login-button"
                      @click="validateForm"
                      >{{ loginName }}</el-button
                    >
                    <div
                      v-show="dragSuccess"
                      class="hdty-login-tips hdty-content-middle"
                    >
                      <span>
                        <i class="icon-check"></i>
                        <p class="hdty-tips">验证成功!</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hdty-login-footer">
          <div
            v-html="$utilStr.arrayJoin(projectCopyright, '&emsp;')"
            class="hdty-copyright hdty-copyright-emboss"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { toLogin, getLoginCode, getConfig } from "@/api/user";
import { getDictionaryInfo, getZdryTdbqConfig } from "@/api/common";
export default {
  name: "Login",
  data() {
    return {
      // 项目名称
      projectName: this.$app.projectName + this.$app.loginTitleSuffix,
      // 项目版权
      projectCopyright: this.$app.projectCopyright,
      // 标题对齐方式
      titleAlign: this.$app.loginTitleAlign,
      // 启用横幅轮播
      carouserlEnabled: this.$app.loginCarouselEnabled,
      // 轮播图
      carouserlImgs: this.$app.carouselImages,
      // 爆炸效果
      bombInfo: {
        enabled: this.$app.loginBombEnabled,
        imgwidth: 0,
        imgheight: 0,
        gridrow: 4,
        gridcol: 3,
        offset: [],
        oaleft: 0,
        oatop: 0,
        ospanw: 0,
        ospanh: 0
      },
      // 启用滑动验证
      sliderEnabled: this.$app.loginSliderEnabled,
      // 验证成功标志
      dragSuccess: false,
      // 滑动验证背景图
      dragImgs: [
        process.env.NODE_PATH + "/static/public/images/drag/img-001.jpg",
        process.env.NODE_PATH + "/static/public/images/drag/img-002.jpg",
        process.env.NODE_PATH + "/static/public/images/drag/img-003.jpg",
        process.env.NODE_PATH + "/static/public/images/drag/img-004.jpg",
        process.env.NODE_PATH + "/static/public/images/drag/img-005.jpg"
      ],
      // 登录验证码
      loginCode: {
        enable: false,
        code: "",
        codeKey: "",
        codeImg: ""
      },
      // 表单
      loginForm: {
        username: "",
        password: ""
      },
      // md5加密密码
      md5password: "",
      // 验证
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur"
          },
          { validator: this.$utilValidate.validateUsername, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      // 登录名称
      loginName: "登 录",
      // 选中
      checked: !this.$utilStr.isEmpty(
        this.$storage.local.get("hdty-admin-autologin")
      )
        ? this.$storage.local.get("hdty-admin-autologin")
        : false,
      // 跳过
      jump: false,
      // 显示
      visible: false,
      // 加载
      logining: false
    };
  },
  created() {
    this.validateAuto();
    this.getCaptchaCode();
  },
  mounted() {
    this.bombReady();
  },
  methods: {
    // 自动登录验证
    validateAuto() {
      if (this.checked) {
        let lastLogin = this.$storage.cookie.get("hdty-last-login");
        if (lastLogin) {
          let login = this.$storage.session.get("login");
          if (login) {
            this.loginForm.username = login.username;
            this.loginForm.password = login.password;
            this.md5password = login.password;
          } else {
            this.jump = true;
            this.$storage.session.set("login", lastLogin);
            this.loginForm.username = lastLogin.username;
            this.loginForm.password = lastLogin.password;
            this.md5password = lastLogin.password;
            NProgress.start();
            this.login();
          }
        }
      }
    },
    // 表单验证
    validateForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.sliderEnabled) {
            this.visible = !this.visible;
          } else {
            this.login();
          }
        }
      });
    },
    // 滑动验证
    validateSlide() {
      this.visible = false;
      this.dragSuccess = true;
      this.login();
    },
    // 获取登录验证码
    getCaptchaCode() {
      let that = this;
      if (that.loginCode.enable) {
        getLoginCode().then((res) => {
          that.loginCode.codeImg = res.data.codeImg;
          that.loginCode.codeKey = res.data.codeKey;
        });
      }
    },
    // 登录系统
    login() {
      let _this = this;
      this.logining = true;
      this.loginName = "登录中...";
      // 参数
      let dataParams = {
        clientType: appEnv.clientTYPE,
        username: this.loginForm.username,
        password: this.md5password
      };
      // 使用登录验证码
      if (this.loginCode.enable) {
        dataParams["code"] = this.loginCode.code;
        dataParams["codeKey"] = this.loginCode.codeKey;
      }
      // Lambda写法
      toLogin(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success } = response.data;
          if (success) {
            this.$utilLogin.login(response, this);

            _this.getConfig();
            _this.getConfig1();
            _this.getZdryTypeDl();
          }
        })
        .catch((error) => {
          // 响应错误回调
          this.reset();
          console.error(error);
        });
    },
    // 获取配置
    getConfig() {
      let _this = this;
      // 参数
      let dataParams = {
        configItemList: appEnv.ywConfig
      };
      // Lambda写法
      getConfig(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.$storage.session.remove("configData");
            _this.$storage.session.set("configData", data.value);
          }
        })
        .catch((error) => {
          // 响应错误回调
          _this.reset();
          console.error(error);
        });
    },
    // 获取配置
    getConfig1() {
      let _this = this;

      // Lambda写法
      getZdryTdbqConfig()
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.$storage.session.remove("configData1");
            _this.$storage.session.set("configData1", data);
          }
        })
        .catch((error) => {
          // 响应错误回调
          _this.reset();
          console.error(error);
        })
        .finally(() => {
          // 获取关注人员类型细类
          _this.getZdryType();
        });
    },
    // 获取关注人员类型大类
    async getZdryTypeDl() {
      let _this = this;
      let dataParams = {
        typeId: this.$global.dictType.zdrylxNew,
        parentId: "",
        hasParent: false
      };
      const response = await getDictionaryInfo(dataParams);
      let { data, success } = response.data;
      if (success) {
        // 过滤掉涉恐类型
        let filterList = data.records.filter(
          (item) => item.key !== _this.$global.zdryLxType.skry
        );
        this.$storage.session.set("dict_zdrylx_dl", filterList);
      }
    },
    // 获取关注人员类型
    async getZdryType() {
      let _this = this;
      let zdryLxParentType = _this.$global.zdryLxParentType;

      // 创建一个 Promise 数组,遍历获取完细类后，根据配置，处理人员现状类型
      const promises = zdryLxParentType.map(async (item) => {
        let dataParams = {
          typeId: this.$global.dictType.zdrylxNew,
          parentId: item.key,
          hasParent: false
        };
        const response = await getDictionaryInfo(dataParams);
        let { data, success } = response.data;
        if (success) {
          let data_ = data;
          data_.records = (data_.records || []).filter(
            (dictItem) => !(item.excludeKeys || []).includes(dictItem.key)
          );

          let obj = this.$storage.session.get("dict_zdrylx") || {};
          obj[item.key] = data_;
          this.$storage.session.set("dict_zdrylx", obj);
        }
      });
      // 等待所有 Promise 完成
      await Promise.all(promises);

      // 所有请求完成后执行
      _this.getRyxzRylx();
    },
    // 获取人员现状 对应的可选人员类型集合
    getRyxzRylx() {
      let result = this.$storage.session.get("configData1");
      // 存储到session
      this.$storage.session.set("ryxz_rylx", result);
    },
    // 改变密码
    handlePasswordChange(val) {
      this.md5password = this.$crypto.md5(val);
    },
    // 切换复选框
    handleCheckboxChange(val) {
      if (val) {
        this.$storage.local.set("hdty-admin-autologin", val);
      } else {
        this.$storage.local.remove("hdty-admin-autologin");
        this.$storage.cookie.remove("hdty-last-login");
        this.$storage.session.remove("login");
      }
    },
    // 关闭弹出框
    handleClosePopover() {
      this.visible = false;
    },
    // 切换幻灯片
    handleChangeCarousel(index, prev) {
      if (this.bombInfo.enabled) {
        this.bombBong(prev);
      }
    },
    // 爆炸效果准备
    bombReady() {
      if (this.carouserlEnabled && this.bombInfo.enabled) {
        //创建元素
        let style = document.createElement("style");
        style.id = "bomb-style";
        let div = document.createElement("div");
        div.className = "bomb-box";
        let a = document.createElement("a");
        a.className = "bomb-href";
        let carousel = document.querySelector(".hdty-login-carousel");
        carousel.appendChild(style);
        carousel.appendChild(div);
        div.appendChild(a);
        this.bombInfo.imgwidth = carousel.clientWidth;
        this.bombInfo.imgheight = carousel.clientHeight;
        let oaOffset = this.$utilElem.getOffset(a);
        this.bombInfo.oaleft = oaOffset.left;
        this.bombInfo.oatop = oaOffset.top;
        this.bombInfo.ospanw = this.bombInfo.imgwidth / this.bombInfo.gridcol;
        this.bombInfo.ospanh = this.bombInfo.imgheight / this.bombInfo.gridrow;
        style.innerHTML +=
          ".bomb-box span{ width: " +
          this.bombInfo.ospanw +
          "px; height: " +
          this.bombInfo.ospanh +
          "px; }";
        for (
          let i = 0;
          i < this.bombInfo.gridcol * this.bombInfo.gridrow;
          i++
        ) {
          a.innerHTML += "<span></span>";
        }
        Array.from(a.children).forEach((element) => {
          // 获取元素相对于父级的坐标
          let offset = this.$utilElem.getOffset(element);
          let left = offset.left - this.bombInfo.oaleft;
          let top = offset.top - this.bombInfo.oatop;
          this.bombInfo.offset.push({
            l: left,
            t: top
          });
        });
      }
    },
    // 爆炸效果播放
    bombBong(prev) {
      if (prev < 0) {
        return;
      }
      let a = document.querySelector(".bomb-href");
      a.innerHTML = "";
      for (let i = 0; i < this.bombInfo.gridcol * this.bombInfo.gridrow; i++) {
        a.innerHTML += "<span></span>";
      }
      // 进行span处理
      Array.from(a.children).forEach((element, index) => {
        element.style.position = "absolute";
        element.style.left = this.bombInfo.offset[index].l + "px";
        element.style.top = this.bombInfo.offset[index].t + "px";
        element.style.background =
          "url(" +
          this.carouserlImgs[prev] +
          ") no-repeat -" +
          this.bombInfo.offset[index].l +
          "px -" +
          this.bombInfo.offset[index].t +
          "px";
        element.style.transition = "all .5s ease-out";
        // 计算目标位置
        let left =
          (this.bombInfo.offset[index].l +
            this.bombInfo.ospanw / 2 -
            this.bombInfo.imgwidth / 2) *
            this.rnd(2, 3) +
          this.bombInfo.imgwidth / 2 -
          this.bombInfo.ospanw / 2;
        let top =
          (this.bombInfo.offset[index].t +
            this.bombInfo.ospanh / 2 -
            this.bombInfo.imgheight / 2) *
            this.rnd(2, 3) +
          this.bombInfo.imgheight / 2 -
          this.bombInfo.ospanh / 2;
        setTimeout(
          ((ele, l, t) => {
            // 进行结束后的效果,爆炸
            return () => {
              ele.style.opacity = 0;
              ele.style.left = l + "px";
              ele.style.top = t + "px";
              ele.style.transform =
                "rotateX(" +
                this.rnd(-145, 145) +
                "deg) rotateY(" +
                this.rnd(-145, 145) +
                "deg) rotateZ(" +
                this.rnd(-145, 145) +
                "deg) scale(" +
                this.rnd(1.5, 2.5) +
                "," +
                this.rnd(1.5, 2.5) +
                ")";
              ele.style.zIndex = 3;
            };
          })(element, left, top)
        );
      });
    },
    // 随机函数
    rnd(min, max) {
      return Math.random() * (max - min) + min;
    },
    // 重置
    reset() {
      this.jump = false;
      this.logining = false;
      this.loginName = "登 录";
      this.dragSuccess = false;
      try {
        this.$refs.dragRef.reset();
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/hdtyui/css/login";

/* 登录验证码样式 */
.login-code {
  display: inline-block;
  width: 33%;
  height: 38px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
