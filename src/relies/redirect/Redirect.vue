<script>
  export default {
    name: "Redirect",
    beforeCreate() {
      let { params, query } = this.$route;
      let { path } = params;
      this.$nextTick(() => {
        this.$router.replace({ path: '/' + (path || ''), query });
      });
    },
    render(h) {
      return h();
    }
  }
</script>
