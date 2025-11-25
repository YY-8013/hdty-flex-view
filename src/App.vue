<template>
  <div id="HDTY_app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // 系统水印
      watermark: {
        isEnabled: this.$app.watermarkEnabled,
        loaded: false,
        text: ""
      }
    };
  },
  computed: {
    activeLanding() {
      return this.$utilStr.parseBoolean(this.$route.query.landing);
    },
    activeRedirecting() {
      return this.$utilStr.parseBoolean(this.$route.query.redirecting);
    },
    activeWatermarkEnabled() {
      return (
        (!this.activeLanding && !this.activeRedirecting) ||
        (this.activeLanding &&
          !this.$utilStr.parseBoolean(this.$route.query.subpage)) ||
        (this.activeRedirecting &&
          !this.$utilStr.parseBoolean(this.$route.query.subpage))
      );
    }
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === "Login") {
          this.$watermark.set("");
          this.watermark.loaded = false;
          return;
        }
        if (this.watermark.loaded) return;
        if (!this.watermark.isEnabled) return;
        if (to.name && to.name !== "Login" && to.name !== "Landing") {
          this.setWatermark();
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    // 发送postMessage消息
    window.parent.postMessage({ type: "status", data: "ready" }, "*");
    // 接收postMessage消息
    window.addEventListener("message", (evt) => {
      let { type, data } = evt.data;
      if (type === "option") {
        if (this.activeLanding) {
          // 设置主题风格
          let joinThemeAlias = data.style.theme;
          if (joinThemeAlias) {
            document.documentElement.setAttribute(
              "theme-alias",
              joinThemeAlias
            );
            document.body.setAttribute("layout-alias", joinThemeAlias);
            this.$storage.local.set("hdty-admin-join-theme", joinThemeAlias);
            this.$store.dispatch("editTheme", joinThemeAlias);
          }
          // 设置布局大小
          let joinSizeAlias = data.style.size;
          if (joinSizeAlias) {
            document.body.setAttribute("layout-size", joinSizeAlias);
            this.$storage.local.set("hdty-admin-join-size", joinSizeAlias);
            this.$store.dispatch("editSize", joinSizeAlias);
          }
        }
      }
    });
    if (this.activeLanding) {
      // 设置主题风格
      let joinThemeAlias = this.$storage.local.get("hdty-admin-join-theme");
      if (joinThemeAlias) {
        document.documentElement.setAttribute("theme-alias", joinThemeAlias);
        document.body.setAttribute("layout-alias", joinThemeAlias);
        this.$store.dispatch("editTheme", joinThemeAlias);
      } else {
        document.documentElement.setAttribute(
          "theme-alias",
          this.$app.themeDefault
        );
        document.body.setAttribute("layout-alias", this.$app.themeDefault);
        this.$storage.local.set(
          "hdty-admin-join-theme",
          this.$app.themeDefault
        );
        this.$store.dispatch("editTheme", this.$app.themeDefault);
      }
      // 设置布局大小
      let joinSizeAlias = this.$storage.local.get("hdty-admin-join-size");
      if (joinSizeAlias) {
        document.body.setAttribute("layout-size", joinSizeAlias);
        this.$store.dispatch("editSize", joinSizeAlias);
      } else {
        document.body.setAttribute("layout-size", this.$app.sizeDefault);
        this.$storage.local.set("hdty-admin-join-size", this.$app.sizeDefault);
        this.$store.dispatch("editSize", this.$app.sizeDefault);
      }
    } else {
      // 设置主题风格
      let themeAlias = this.$storage.local.get("hdty-admin-theme");
      if (themeAlias) {
        document.documentElement.setAttribute("theme-alias", themeAlias);
        document.body.setAttribute("layout-alias", themeAlias);
        this.$store.dispatch("editTheme", themeAlias);
      } else {
        document.documentElement.setAttribute(
          "theme-alias",
          this.$app.themeDefault
        );
        document.body.setAttribute("layout-alias", this.$app.themeDefault);
        this.$storage.local.set("hdty-admin-theme", this.$app.themeDefault);
        this.$store.dispatch("editTheme", this.$app.themeDefault);
      }
      // 设置布局大小
      let sizeAlias = this.$storage.local.get("hdty-admin-size");
      if (sizeAlias) {
        document.body.setAttribute("layout-size", sizeAlias);
        this.$store.dispatch("editSize", sizeAlias);
      } else {
        document.body.setAttribute("layout-size", this.$app.sizeDefault);
        this.$storage.local.set("hdty-admin-size", this.$app.sizeDefault);
        this.$store.dispatch("editSize", this.$app.sizeDefault);
      }
    }
    // 设置布局方式
    let schemeAlias = this.$storage.local.get("hdty-admin-scheme");
    if (schemeAlias) {
      document.body.setAttribute("layout-scheme", schemeAlias);
      this.$store.dispatch("editScheme", schemeAlias);
    } else {
      document.body.setAttribute("layout-scheme", this.$app.schemeDefault);
      this.$storage.local.set("hdty-admin-scheme", this.$app.schemeDefault);
      this.$store.dispatch("editScheme", this.$app.schemeDefault);
    }
    // 设置顶部导航开启/关闭
    let topnavAlias = this.$storage.local.get("hdty-admin-topnav");
    if (!this.$utilStr.isEmpty(topnavAlias)) {
      this.$store.dispatch("editTopnav", topnavAlias);
    } else {
      this.$storage.local.set("hdty-admin-topnav", this.$app.topnavEnabled);
      this.$store.dispatch("editTopnav", this.$app.topnavEnabled);
    }
    // 设置页面选项卡开启/关闭
    let pagetabAlias = this.$storage.local.get("hdty-admin-pagetab");
    if (!this.$utilStr.isEmpty(pagetabAlias)) {
      this.$store.dispatch("editPagetab", pagetabAlias);
    } else {
      this.$storage.local.set("hdty-admin-pagetab", this.$app.pagetabEnabled);
      this.$store.dispatch("editPagetab", this.$app.pagetabEnabled);
    }
    // 设置消息通知提示开启/关闭
    let notifyAlias = this.$storage.local.get("hdty-admin-notify");
    if (!this.$utilStr.isEmpty(notifyAlias)) {
      this.$store.dispatch("editNotify", notifyAlias);
    } else {
      this.$storage.local.set("hdty-admin-notify", this.$app.notifyEnabled);
      this.$store.dispatch("editNotify", this.$app.notifyEnabled);
    }
    // 设置消息通知提示音开启/关闭
    let beepAlias = this.$storage.local.get("hdty-admin-beep");
    if (!this.$utilStr.isEmpty(beepAlias)) {
      this.$store.dispatch("editBeep", beepAlias);
    } else {
      this.$storage.local.set("hdty-admin-beep", this.$app.notifyBeepEnabled);
      this.$store.dispatch("editBeep", this.$app.notifyBeepEnabled);
    }
    // 设置消息通知提示位置
    let positionAlias = this.$storage.local.get("hdty-admin-position");
    if (positionAlias) {
      this.$store.dispatch("editPosition", positionAlias);
    } else {
      this.$storage.local.set("hdty-admin-position", this.$app.notifyPosition);
      this.$store.dispatch("editPosition", this.$app.notifyPosition);
    }
    // 设置未读消息标记效果
    let badgeAlias = this.$storage.local.get("hdty-admin-badge");
    if (badgeAlias) {
      this.$store.dispatch("editBadge", badgeAlias);
    } else {
      this.$storage.local.set("hdty-admin-badge", this.$app.notifyUnreadBadge);
      this.$store.dispatch("editBadge", this.$app.notifyUnreadBadge);
    }
    // 设置左侧菜单展开/收起
    let menucollapAlias = this.$storage.local.get("hdty-admin-menucollap");
    if (!this.$utilStr.isEmpty(menucollapAlias)) {
      this.$store.dispatch("editMenucollap", menucollapAlias);
    } else {
      this.$storage.local.set(
        "hdty-admin-menucollap",
        this.$app.sideMenuDefaultCollapse
      );
      this.$store.dispatch("editMenucollap", this.$app.sideMenuDefaultCollapse);
    }

    // 设置是否禁止通过本系统登录
    let loginDisabled = this.$storage.local.get("hdty-fkyw-loginDisabled");
    if (this.$utilStr.isEmpty(loginDisabled)) {
      console.log("空空空");

      this.$storage.local.set("hdty-fkyw-loginDisabled", appEnv.loginDisabled);
    }
  },
  created() {
    // 设置网站标题
    this.setWebTitle();
    // 设置网站图标
    this.setWebFavicon();
  },
  mounted() {
    // 发送postMessage消息
    window.parent.postMessage({ type: "status", data: "load" }, "*");
  },
  methods: {
    // 设置网站标题
    setWebTitle() {
      document.title =
        (this.$app.webTitleSuffix && this.$app.webTitleSuffix + " | ") +
        this.$app.projectName;
    },
    // 设置网站图标
    setWebFavicon() {
      let favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = this.$app.webFavicon;
      favicon.type = "image/x-icon";
      document.head.appendChild(favicon);
    },
    // 设置网站水印
    setWatermark() {
      if (this.activeWatermarkEnabled) {
        if (this.$app.watermarkMaskEnabled) {
          this.watermark.text =
            this.$utilStr.replaceIdcardX(this.$utilLogin.getUserGmsfhm()) +
              " " +
              this.$utilStr.replaceNameX(this.$utilLogin.getUserXm()) ||
            this.$utilLogin.getUsername();
        } else {
          this.watermark.text =
            this.$utilLogin.getUserGmsfhm() +
              " " +
              this.$utilLogin.getUserXm() || this.$utilLogin.getUsername();
        }
        this.$watermark.set(this.watermark.text);
        this.watermark.loaded = true;
      }
    }
  }
};
</script>

<style lang="scss">
@import "./assets/hdtyui/css/admin";
@import "./views/css/style";
</style>
