export default {
  data() {
    return {};
  },
  methods: {
    // 督导检查详情
    handleDdjcDetail(wybs) {
      let row = {
        vo: {
          id: wybs
        }
      };
      this.$refs.ddjcDetailRef.visible = true;
      this.$refs.ddjcDetailRef.row = row;
      this.$refs.ddjcDetailRef.beforeLoadForm();
    },
    // 标题栏按钮点击
    handleTitleButton(item) {
      // this.handleZdmbJcxSelect(item);
      if (item.customFn && this[item.customFn]) {
        this[item.customFn](item);
      }
    },
    // 业务
    handleJcxSelect(item) {
      // 打开选择弹窗的方法
      this.$refs.zdmbJcxSelectRef.open(item);
    },
    // 更新字段列表
    updateJcxList(selections, formItemConfig) {
      console.log("selections", selections);
      console.log("formItemConfig", formItemConfig);
      let tableProps = formItemConfig.tableProps || [];
      let selectResults = [];
      if (selections && selections.length > 0) {
        selections.forEach((rowItem) => {
          let obj = tableProps.reduce(
            (pre, cur) => {
              pre[cur.prop] = "";
              if (cur.mapProp) {
                this.$set(
                  pre,
                  cur.prop,
                  this.getNestedValue(rowItem, cur.mapProp)
                );
              }
              return pre;
            },
            {
              id: this.$utilStr.uuid(32)
            }
          );
          selectResults.push(obj);
          console.log("obj", obj);
        });
      }

      console.log("selectResults", selectResults);
      // 判断tableProps里是否有唯一的键
      let wyKey = tableProps.find((item) => item.isUnique);
      if (wyKey) {
        // 获取当前已存在的列表
        let currentValue = (this.formData[formItemConfig.prop] || []).map(
          (item) => item[wyKey.prop]
        );
        let filterList = selectResults.filter(
          (item) => !currentValue.includes(item[wyKey.prop])
        );
        this.formData[formItemConfig.prop] = (
          this.formData[formItemConfig.prop] || []
        ).concat(filterList);
      }
    }
  }
};
