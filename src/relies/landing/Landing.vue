<script>
import { getConfig, toLogin } from "@/api/user";
import { getDictionaryInfo, getZdryTdbqConfig } from "@/api/common";

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
          this.getZdryTypeDl();
        }
      })
      .catch((error) => {
        // 响应错误回调
        console.error(error);
      });
  },
  methods: {
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
    // 获取配置
    getConfig1() {
      let _this = this;

      // Lambda写法
      getZdryTdbqConfig()
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.$storage.session.remove("configData");
            _this.$storage.session.set("configData", data);
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
      let result = this.$storage.session.get("configData");
      this.$storage.session.set("ryxz_rylx", result);
    }
  },

  render(h) {
    return h();
  }
};
</script>
