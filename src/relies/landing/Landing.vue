<script>
import { getConfig, toLogin } from "@/api/user";
import { getDictionaryInfo } from "@/api/common";

export default {
  name: "Landing",
  beforeCreate() {
    let { query, params } = this.$route;
    let { token, appId, appid, uid, auth_type, subpage, bodypage } = query;
    let { path } = params;
    this.$storage.session.set("landing-token", token);
    this.$storage.session.remove("token");
    this.$storage.session.remove("routers");
    this.$storage.session.remove("user");
    this.$storage.session.remove("authorities");
    this.$storage.session.remove("navigations");

    this.$storage.session.set(
      "subpage",
      this.$utilStr.parseBoolean(subpage || true)
    );
    this.$storage.session.set(
      "bodypage",
      this.$utilStr.parseBoolean(bodypage || true)
    );
    // 参数
    let dataParams = {
      appid: appId || appid,
      token: token,
      uid: uid,
      auth_type: auth_type,
      clientType: appEnv.clientTYPE
    };
    // Lambda写法
    toLogin(dataParams)
      .then((response) => {
        // 响应成功回调
        let { success } = response.data;
        if (success) {
          let { authorization } = response.headers;
          this.$storage.session.set("token", authorization);
          this.$storage.session.set("landing", true);

          this.$router.replace({
            path: "/" + (path || ""),
            query: {
              ...query,
              landed: "true",
              bodypage: bodypage || true,
              subpage: subpage || true
            }
          });
          let lastLogin = this.$storage.cookie.get("hdty-last-login");
          if (lastLogin) {
            this.$storage.session.set("login", lastLogin);
          }
          this.getConfig();
        }
      })
      .catch((error) => {
        // 响应错误回调
        console.error(error);
      });
  },
  methods: {
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
    }
  },

  render(h) {
    return h();
  }
};
</script>
