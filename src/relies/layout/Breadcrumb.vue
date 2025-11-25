<template>
  <el-breadcrumb separator="|">
    <el-breadcrumb-item v-for="(item, index) in data" :key="item.path">
      <span
        v-if="item.redirect === 'noRedirect' || index == data.length - 1"
        class="no-redirect"
        ><i v-if="item.path === '/'" class="hdty-icon icon-home-o"></i
        >{{ item.meta.title }}</span
      >
      <a v-else @click.prevent="handleLink(item)"
        ><i v-if="item.path === '/'" class="hdty-icon icon-home-o"></i
        >{{ item.meta.title }}</a
      >
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      data: []
    };
  },
  watch: {
    $route: {
      handler() {
        let _this = this;
        let root = [];
        let matched = _this.$route.matched.filter(
          (e) => e.meta && e.meta.title
        );
        matched.forEach((val) => {
          root.push(val);
        });
        if (!root.find((e) => e.path === "/")) {
          let router = {
            path: "/",
            name: "Home",
            meta: {
              title: "工作台"
            },
            redirect: "/"
          };
          root.unshift(router);
        }
        _this.data = root;
      },
      immediate: true
    }
  },
  methods: {
    pathCompile(path) {
      const { params } = this.$route;
      let toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style scoped></style>
