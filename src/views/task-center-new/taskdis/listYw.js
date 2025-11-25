export default {
  data() {
    return {
      isLoaded: false,

      treeDataList: [],

      leftActiveForm: ""
    };
  },
  methods: {
    changeMenuItem() {
      let _this = this;
      if (!_this.isLoaded) {
        _this.handleQuery();
      } else {
        _this.$emit(
          "update-left-tree",
          _this.treeDataList,
          _this.leftActiveForm
        );
      }
    }
  }
};
