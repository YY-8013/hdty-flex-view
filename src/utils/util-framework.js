/**
 * 框架类函数
 */

export const hdList = {
  data() {
    // 获取查询权限
    const getUserAuthorityQuery = () => {
      if (this.$app.btnAuthorizationEnabled) {
        let moduleName = this.$options.moduleName || this.$route.name;
        let moduleAuthorities = AUTHORITIES[moduleName];
        if (moduleAuthorities) {
          let operationAuthorities = moduleAuthorities.children;
          if (operationAuthorities) {
            let authorityName = "query";
            let currentAuthority = operationAuthorities[authorityName];
            if (currentAuthority && currentAuthority.hasAuthority) {
              return true;
            }
          }
        }
        return false;
      } else {
        return true;
      }
    };
    // 用户权限
    const AUTHORITIES = this.$utilLogin.getUserAuthorities();
    // 查询权限
    const AUTHORITY_QUERY = getUserAuthorityQuery();
    return {
      // 用户权限
      AUTHORITIES: AUTHORITIES,
      // 查询权限
      AUTHORITY_QUERY: AUTHORITY_QUERY,
      // 分页选择器
      pageOptions: { ...this.$app.paginationOptions },
      // 时间选择器
      pickerOptions: this.$app.pickerShortcutOptions,
      // 数据导出数量限制
      exportLimit: this.$app.exportLimit,
      // 空白页提示
      emptyText: AUTHORITY_QUERY ? "暂无数据" : "暂无权限",
      // 全部表格大小变化监听组件
      erdAllTable: [],
      // 全部容器大小变化监听元素
      erdAllContainer: [],
      // 加载中
      loading: false,
      // 提交中
      submitting: false,
      // 处理中
      handling: false,
      // 转场中
      converting: false,
      // 切换中
      toggling: false,
      // 同步中
      synchronizing: false,
      // 计算中
      calculating: false,
      // 上传中
      uploading: false,
      // 下载中
      downloading: false,
      // 导入中
      importing: false,
      // 导出中
      exporting: false,
      // 列表加载中
      triggerLoading: false,
      // 提交中
      handleLoading: false,
      // 切换中
      toggleLoading: false,
      // 上传中
      uploading: false,
      // 处理中
      batchLoading: false,
      // 导出中
      exportLoading: false
    };
  },
  created() {
    this.initQueryByPath();
  },
  mounted() {
    this.addTableResizeDoLayoutListener();
  },
  destroyed() {
    this.removeTableResizeDoLayoutListener();
  },
  methods: {
    /**
     * 根据路由参数初始化查询数据对象
     * @param queryObject 指定查询数据数据对象（值为空时，则默认在组件中查找this.queryData对象使用）
     * @param extendObject 指定查询扩展数据对象（值为空时，则则默认在组件中查找this.extendData对象使用）
     */
    initQueryByPath({ queryObject = null, extendObject = null } = {}) {
      if (typeof this.$route.query === "object" && this.$route.query) {
        let normalQuery = {};
        let extendQuery = {};
        for (let attr in this.$route.query) {
          if (this.$route.query.hasOwnProperty(attr)) {
            let val = this.$route.query[attr];
            if (this.$utilStr.isEncodeURIComponent(val)) {
              val = decodeURIComponent(val);
            } else if (this.$utilStr.isEncodeURI(val)) {
              val = decodeURI(val);
            } else if (this.$utilStr.isEscape(val)) {
              val = unescape(val);
            }
            if (this.$utilStr.isJSONStr(val)) {
              val = JSON.parse(val);
            }
            if (this.$utilStr.isStartsWith(attr, "\\$")) {
              let aesDecryptNetworkVal = null;
              if (
                this.$crypto.isAesEncryptNetworkData(val) &&
                this.$crypto.isSm4EncryptNetworkData(val)
              ) {
                if (appEnv.encryptMETHOD === "aes") {
                  aesDecryptNetworkVal =
                    this.$crypto.aesDecryptNetworkData(val);
                } else if (appEnv.encryptMETHOD === "sm4") {
                  aesDecryptNetworkVal =
                    this.$crypto.sm4DecryptNetworkData(val);
                } else {
                  aesDecryptNetworkVal = val;
                }
              } else if (this.$crypto.isAesEncryptNetworkData(val)) {
                aesDecryptNetworkVal = this.$crypto.aesDecryptNetworkData(val);
              } else if (this.$crypto.isSm4EncryptNetworkData(val)) {
                aesDecryptNetworkVal = this.$crypto.sm4DecryptNetworkData(val);
              } else {
                aesDecryptNetworkVal = val;
              }
              if (this.$utilStr.isStartsWith(attr.slice(1), "_")) {
                extendQuery[attr.slice(2)] = aesDecryptNetworkVal;
              }
              normalQuery[attr.slice(1)] = aesDecryptNetworkVal;
            }
            if (this.$utilStr.isStartsWith(attr, "_")) {
              extendQuery[attr.slice(1)] = val;
            }
            normalQuery[attr] = val;
          }
        }
        if (typeof queryObject === "object" && queryObject) {
          for (let attr in normalQuery) {
            if (normalQuery.hasOwnProperty(attr)) {
              queryObject[attr] = normalQuery[attr];
            }
          }
        } else if (typeof this.queryData === "object") {
          this.queryData = {
            ...this.queryData,
            ...normalQuery
          };
        }
        if (typeof extendObject === "object" && extendObject) {
          for (let attr in extendQuery) {
            if (extendQuery.hasOwnProperty(attr)) {
              extendObject[attr] = extendQuery[attr];
            }
          }
        } else if (typeof this.extendData === "object") {
          this.extendData = {
            ...this.extendData,
            ...extendQuery
          };
        }
      }
    },
    // 添加表格元素大小变化进行重新布局监听
    addTableResizeDoLayoutListener(el) {
      this.erdAllContainer = [];
      if (el) {
        if (this.$utilElem.isHTMLElement(el)) {
          this.erdAllContainer.push(el);
        } else if (Array.isArray(Array.prototype.slice.call(el))) {
          this.erdAllContainer = Array.prototype.slice.call(el);
        }
      } else {
        this.erdAllContainer.push(this.$el);
      }
      if (this.erdAllContainer && this.erdAllContainer.length > 0) {
        for (let i = 0, iLen = this.erdAllContainer.length; i < iLen; i++) {
          if (this.$utilElem.isHTMLElement(this.erdAllContainer[i])) {
            if (this.erdAllContainer[i].scrollHeight > 0) {
              this.listenTableResizeDoLayout();
            } else {
              this.$erd.listenTo(
                this.erdAllContainer[i],
                this.listenTableResizeDoLayout
              );
            }
          }
        }
      }
    },
    // 移除表格元素大小变化进行重新布局监听
    removeTableResizeDoLayoutListener() {
      if (this.erdAllContainer && this.erdAllContainer.length > 0) {
        for (let i = 0, iLen = this.erdAllContainer.length; i < iLen; i++) {
          if (this.$utilElem.isHTMLElement(this.erdAllContainer[i])) {
            this.$erd.removeListener(
              this.erdAllContainer[i],
              this.listenTableResizeDoLayout
            );
          }
        }
      }
      if (this.erdAllTable && this.erdAllTable.length > 0) {
        for (let i = 0, iLen = this.erdAllTable.length; i < iLen; i++) {
          this.$erd.removeListener(
            this.erdAllTable[i].$el,
            this.tableResizeDoLayout
          );
        }
      }
    },
    // 监听表格元素大小变化进行重新布局
    listenTableResizeDoLayout() {
      this.removeTableResizeDoLayoutListener();
      this.erdAllTable = this.queryComponentChildrenAll("ElTable");
      if (this.erdAllTable && this.erdAllTable.length > 0) {
        for (let i = 0, iLen = this.erdAllTable.length; i < iLen; i++) {
          this.erdAllTable[i].$el.dataset.index = i;
          this.$erd.listenTo(this.erdAllTable[i].$el, this.tableResizeDoLayout);
        }
      }
    },
    // 表格元素大小变化进行重新布局
    tableResizeDoLayout(e) {
      try {
        let targetIndex = e.dataset.index;
        this.erdAllTable[targetIndex].doLayout();
      } catch (err) {}
    },
    // 获取某个模块权限
    getUserModuleAuthority(
      moduleName,
      enabled = this.$app.btnAuthorizationEnabled
    ) {
      if (enabled) {
        if (typeof moduleName !== "undefined") {
          let currentAuthority = this.AUTHORITIES[moduleName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        } else {
          moduleName = this.queryComponentModuleName() || this.$route.name;
          let currentAuthority = this.AUTHORITIES[moduleName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },
    // 获取某个权限
    getUserAuthority(
      authorityName,
      moduleName,
      enabled = this.$app.btnAuthorizationEnabled
    ) {
      if (enabled) {
        if (
          typeof authorityName !== "undefined" &&
          typeof moduleName !== "undefined"
        ) {
          let moduleAuthorities = this.AUTHORITIES[moduleName];
          if (moduleAuthorities) {
            let operationAuthorities = moduleAuthorities.children;
            if (operationAuthorities) {
              let currentAuthority = operationAuthorities[authorityName];
              if (currentAuthority && currentAuthority.hasAuthority) {
                return true;
              }
            }
          }
        } else if (typeof authorityName !== "undefined") {
          moduleName = this.queryComponentModuleName() || this.$route.name;
          let moduleAuthorities = this.AUTHORITIES[moduleName];
          if (moduleAuthorities) {
            let operationAuthorities = moduleAuthorities.children;
            if (operationAuthorities) {
              let currentAuthority = operationAuthorities[authorityName];
              if (currentAuthority && currentAuthority.hasAuthority) {
                return true;
              }
            }
          }
        } else {
          authorityName = this.queryComponentModuleName() || this.$route.name;
          let currentAuthority = this.AUTHORITIES[authorityName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },
    // 下载二进制文件流
    download(response) {
      let filename =
        decodeURIComponent(
          response.headers["content-disposition"].split("=")[1]
        ) || new Date().getTime();
      this.$utilFile.downloadBlob(response.data, filename);
    },
    // 获取当前组件模块名称
    queryComponentModuleName(vnode) {
      let module = vnode || this;
      let moduleName = module.$options.moduleName;
      while (!moduleName) {
        module = module.$parent;
        if (module) {
          moduleName = module.$options.moduleName;
        } else {
          break;
        }
      }
      return moduleName;
    },
    // 获取父级组件
    queryComponentParent(name, vnode) {
      vnode = vnode || this;
      let parent = vnode.$parent;
      if (parent && name) {
        let parentName = parent.$options.componentName || parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (parent) {
            parentName = parent.$options.componentName || parent.$options.name;
          } else {
            break;
          }
        }
      }
      return parent;
    },
    // 获取所有匹配的子组件
    queryComponentChildrenAll(name, vnode) {
      vnode = vnode || this;
      let childrenAll = [];
      let children = vnode.$children;
      (function fn(children) {
        if (children && children.length > 0) {
          for (let i = 0, iLen = children.length; i < iLen; i++) {
            let childrenName =
              children[i].$options.componentName || children[i].$options.name;
            if (!name || childrenName === name) {
              childrenAll.push(children[i]);
            }
            if (children[i].$children) {
              fn(children[i].$children);
            }
          }
        }
      })(children);
      return childrenAll;
    },
    // 分页每页条数改变
    handleSizeChange(val) {
      this.pageOptions.size = val;
      if (this.pageOptions.current <= Math.ceil(this.pageOptions.total / val)) {
        if (typeof this.loadList === "function") {
          this.loadList();
        }
      }
    },
    // 分页当前页码改变
    handleCurrentChange(val) {
      this.pageOptions.current = val;
      if (typeof this.loadList === "function") {
        this.loadList();
      }
    },
    // 分页列表数据删除后重新加载列表
    triggerDeletedReload() {
      if (this.$utilStr.isNotEmptyObject(this.pageOptions)) {
        if (this.pageOptions.total % this.pageOptions.size === 1) {
          if (this.pageOptions.current > 1) {
            this.pageOptions.current = this.pageOptions.current - 1;
          } else {
            this.pageOptions.current = 1;
          }
        }
      }
      if (typeof this.loadList === "function") {
        this.loadList();
      }
    },
    // 校验分页列表数据是否可以导出
    validateExport() {
      if (this.$utilStr.isNotEmptyObject(this.pageOptions)) {
        if (this.pageOptions.total === 0) {
          this.$message({
            showClose: true,
            message: "没有可以导出的数据",
            type: "info",
            offset: 76
          });
          return false;
        }
        if (
          Number(this.exportLimit) &&
          this.pageOptions.total > Number(this.exportLimit)
        ) {
          this.$message({
            showClose: true,
            message:
              "超出导出数据最大限制，最多导出[" + this.exportLimit + "]条数据",
            type: "warning",
            offset: 76
          });
          return false;
        }
      }
      return true;
    },
    // 表格排序条件改变
    handleSortChange({ column, prop, order }, params) {
      let ascs = [];
      let descs = [];
      if (order === "ascending") {
        ascs = [this.$utilStr.getSuffix(prop) || prop];
      } else if (order === "descending") {
        descs = [this.$utilStr.getSuffix(prop) || prop];
      }
      if (typeof this.queryData === "object") {
        if (!this.queryData) {
          this.queryData = {};
        }
        this.$set(this.queryData, "ascs", ascs);
        this.$set(this.queryData, "descs", descs);
      }
      if (typeof params === "object") {
        this.$set(params, "ascs", ascs);
        this.$set(params, "descs", descs);
      }
      if (this.$utilStr.isNotEmptyObject(this.pageOptions)) {
        this.pageOptions.current = 1;
      }
      if (typeof this.loadList === "function") {
        this.loadList();
      }
    },
    // 表格自定义合计行的回调方法
    handleSummaryMethod({ columns, data }) {
      let sums = [];
      if (data && data.length > 0) {
        // 合计文本所在列索引
        let sumTextColIndex = [1];
        // 合计设为空的列索引
        let sumEmptyColIndex = [];
        // 合计设为空的列类型（default/custom/selection/index/operation/expand/text/number/amount/year/month/date/datetime/time/array/tag/geo/image/file/html）
        let sumEmptyColType = [
          "selection",
          "index",
          "operation",
          "expand",
          "text",
          "year",
          "month",
          "date",
          "datetime",
          "time",
          "array",
          "geo",
          "image",
          "file"
        ];
        // 合计为空显示文本
        let sumEmptyText = "";
        // 合计值的前缀
        let sumValuePrefix = "";
        // 合计值的后缀
        let sumValueSuffix = "";
        columns.forEach((column, index) => {
          if (sumTextColIndex.includes(index)) {
            sums[index] = "合计";
            return;
          }
          if (sumEmptyColIndex.includes(index)) {
            sums[index] = sumEmptyText;
            return;
          }
          if (sumEmptyColType.includes(column.type)) {
            sums[index] = sumEmptyText;
            return;
          }
          let values = data.map(
            (item) =>
              parseFloat(
                this.$utilStr.getValueOfDeepObj(item, column.property)
              ) &&
              Number(this.$utilStr.getValueOfDeepObj(item, column.property))
          );
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return prev + value;
              } else {
                return prev;
              }
            }, 0);
            if (column.type === "amount") {
              sums[index] = this.formatAmount(sums[index]);
            }
            if (sumValuePrefix) {
              sums[index] = sumValuePrefix + sums[index];
            }
            if (sumValueSuffix) {
              sums[index] += sumValueSuffix;
            }
          } else {
            sums[index] = sumEmptyText;
          }
        });
      }
      return sums;
    },
    // 表格单元格鼠标移入
    handleCellMouseEnter(row, column, cell, event) {
      if (cell.getAttribute("title") === null) {
        cell.style.cursor = "pointer";
        cell.setAttribute("title", "点击查看详情");
      }
      let buttons = cell.querySelectorAll("button");
      [].forEach.call(buttons, (btn) => {
        if (btn.getAttribute("title") === null) {
          btn.setAttribute("title", "");
        }
      });
    },
    // 树形表格多选触发
    handleTreeTableSelect(selection, row) {
      let _this = this;
      if (typeof row.checked === "string" && row.checked === "") {
        row.checked = false;
        _this.setTreeTableRowSelection(row, true);
      }
      row.checked = !row.checked;
      function selectAllChildren(data) {
        data.forEach((item) => {
          item.checked = row.checked;
          _this.setTreeTableRowSelection(item, row.checked);
          if (item.children && item.children.length > 0) {
            selectAllChildren(item.children);
          }
        });
      }
      function getSelectStatus(selectStatusArr, data) {
        data.forEach((childrenItem) => {
          let checked = false;
          if (
            typeof childrenItem.checked === "boolean" ||
            typeof childrenItem.checked === "string"
          ) {
            checked = childrenItem.checked;
          }
          selectStatusArr.push(checked);
          if (childrenItem.children && childrenItem.children.length) {
            getSelectStatus(selectStatusArr, childrenItem.children);
          }
        });
        return selectStatusArr;
      }
      function getLevelStatus(row) {
        if (!row.parentId) {
          if (row.children && row.children.length) {
            return 1;
          } else {
            return 4;
          }
        } else {
          if (!row.children || !row.children.length) {
            return 3;
          } else {
            return 2;
          }
        }
      }
      let result = {};
      function getExplicitNode(data, parentId) {
        data.forEach((item) => {
          if (item.id === parentId) {
            result = item;
          }
          if (item.children && item.children.length > 0) {
            getExplicitNode(item.children, parentId);
          }
        });
        return result;
      }
      function operateLastLevel(row) {
        let selectStatusArr = [];
        let item = getExplicitNode(_this.tableData, row.parentId);
        selectStatusArr = getSelectStatus(selectStatusArr, item.children);
        if (
          selectStatusArr.every((selectItem) => {
            return true === selectItem;
          })
        ) {
          item.checked = true;
          _this.setTreeTableRowSelection(item, true);
        } else if (
          selectStatusArr.every((selectItem) => {
            return false === selectItem;
          })
        ) {
          item.checked = false;
          _this.setTreeTableRowSelection(item, false);
        } else {
          item.checked = "";
        }
        if (item.parentId) {
          operateLastLevel(item);
        }
      }
      let levelStatus = getLevelStatus(row);
      if (levelStatus === 1) {
        selectAllChildren(row.children);
      } else if (levelStatus === 2) {
        selectAllChildren(row.children);
        operateLastLevel(row);
      } else if (levelStatus === 3) {
        operateLastLevel(row);
      }
    },
    // 树形表格全选触发
    handleTreeTableSelectAll(selection) {
      let _this = this;
      let isAllSelect = validAuthorityAllSelect();
      _this.tableData.forEach((item) => {
        item.checked = isAllSelect;
        _this.setTreeTableRowSelection(item, !isAllSelect);
        _this.handleTreeTableSelect(selection, item);
      });
      function validAuthorityAllSelect() {
        let oneProductIsSelect = [];
        _this.tableData.forEach((item) => {
          oneProductIsSelect.push(item.checked);
        });
        return oneProductIsSelect.every((selectStatusItem) => {
          return true === selectStatusItem;
        });
      }
    },
    // 树形表格自定义行的className的回调方法
    handleTreeTableRowClassName({ row }) {
      if (typeof row.checked === "string" && row.checked === "") {
        return "is-indeterminate";
      }
    },
    // 设置表格索引
    setIndex(index) {
      if (this.$utilStr.isNotEmptyObject(this.pageOptions)) {
        return (
          (this.pageOptions.current - 1) * this.pageOptions.size + index + 1
        );
      } else {
        return index + 1;
      }
    },
    // 设置表格行的鼠标悬停提示
    setTableRowTooltip(tip, vnode) {
      tip = tip || "点击查看详情";
      vnode = vnode || this;
      this.$nextTick(() => {
        let allRows = vnode.$el.querySelectorAll(".el-table__row");
        [].forEach.call(allRows, (row) => {
          if (row.getAttribute("title") === null) {
            row.style.cursor = "pointer";
            row.setAttribute("title", tip);
          }
          let allRowButtons = row.querySelectorAll(".el-button");
          [].forEach.call(allRowButtons, (btn) => {
            if (btn.getAttribute("title") === null) {
              btn.setAttribute("title", "");
            }
          });
        });
      });
    },
    // 设置树形表格某一行的选中状态
    setTreeTableRowSelection(row, selected) {
      this.$nextTick(() => {
        this.$refs.treeTableRef.toggleRowSelection(row, selected);
      });
    },
    // 表格数字列格式化
    formatNumber(row, column, cellValue) {
      let number;
      if (typeof cellValue !== "undefined") {
        number = cellValue;
      } else if (typeof row !== "undefined") {
        number = row;
      }
      return this.$utilStr.numFtt(number);
    },
    // 表格金额列格式化
    formatAmount(row, column, cellValue) {
      let amount;
      if (typeof cellValue !== "undefined") {
        amount = cellValue;
      } else if (typeof row !== "undefined") {
        amount = row;
      }
      return "￥" + this.$utilStr.numFtt(amount, 2);
    },
    // 表格年份列格式化
    formatYear(row, column, cellValue) {
      let pattern = "yyyy年";
      let year;
      if (typeof cellValue !== "undefined") {
        year = cellValue;
      } else if (typeof row !== "undefined") {
        year = row;
      }
      return this.$utilDate.dateFtt(year, pattern);
    },
    // 表格月份列格式化
    formatMonth(row, column, cellValue) {
      let pattern = "yyyy年MM月";
      let month;
      if (typeof cellValue !== "undefined") {
        month = cellValue;
      } else if (typeof row !== "undefined") {
        month = row;
      }
      if (
        this.$utilStr.isText(month) &&
        (month + "").replace(/[^0-9]/gi, "").length < 6
      ) {
        pattern = "MM月";
      }
      return this.$utilDate.dateFtt(month, pattern);
    },
    // 表格日期列格式化
    formatDate(row, column, cellValue) {
      let pattern = "yyyy-MM-dd";
      let date;
      if (typeof cellValue !== "undefined") {
        date = cellValue;
      } else if (typeof row !== "undefined") {
        date = row;
      }
      if (
        this.$utilStr.isText(date) &&
        (date + "").replace(/[^0-9]/gi, "").length < 8
      ) {
        pattern = "MM-dd";
      }
      return this.$utilDate.dateFtt(date, pattern);
    },
    // 表格日期时间列格式化
    formatDatetime(row, column, cellValue) {
      let pattern = "yyyy-MM-dd HH:mm:ss";
      let datetime;
      if (typeof cellValue !== "undefined") {
        datetime = cellValue;
      } else if (typeof row !== "undefined") {
        datetime = row;
      }
      if (
        this.$utilStr.isText(datetime) &&
        (datetime + "").replace(/[^0-9]/gi, "").length < 14
      ) {
        pattern = "yyyy-MM-dd HH:mm";
      }
      return this.$utilDate.dateFtt(datetime, pattern);
    },
    // 表格时间列格式化
    formatTime(row, column, cellValue) {
      let pattern = "HH:mm:ss";
      let time;
      if (typeof cellValue !== "undefined") {
        time = cellValue;
      } else if (typeof row !== "undefined") {
        time = row;
      }
      if (
        this.$utilStr.isText(time) &&
        (time + "").replace(/[^0-9]/gi, "").length < 6
      ) {
        pattern = "HH:mm";
      }
      return this.$utilDate.timeFtt(time, pattern);
    },
    // 表格数组列格式化
    formatArray(row, column, cellValue) {
      let array;
      if (typeof cellValue !== "undefined") {
        array = cellValue;
      } else if (typeof row !== "undefined") {
        array = row;
      }
      return this.$utilStr.arrayJoin(array, "，");
    },
    // 表格URL列格式化追加时间戳
    formatURLAppendTimeStamp(row, column, cellValue) {
      let url;
      if (typeof cellValue !== "undefined") {
        url = cellValue;
      } else if (typeof row !== "undefined") {
        url = row;
      }
      if (this.$utilStr.isURL(url)) {
        return this.$utilStr.appendParameterToURL(url, {
          t: new Date().getTime()
        });
      } else {
        return url;
      }
    },
    // 校验表格数据是否可以导出
    exportValidator() {
      if (this.$utilStr.isNotEmptyObject(this.pageOptions)) {
        if (this.pageOptions.total === 0) {
          this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "没有可以导出的数据"
          });
          return false;
        }
        if (
          Number(this.exportLimit) &&
          this.pageOptions.total > Number(this.exportLimit)
        ) {
          this.$message({
            showClose: true,
            customClass: "is-fixed",
            message:
              "超出导出数据最大限制，最多导出[" + this.exportLimit + "]条数据",
            type: "warning"
          });
          return false;
        }
      }
      return true;
    }
  }
};

import { fileUpload } from "@/api/common";

export const hdForm = {
  data() {
    return {
      fileUpload,
      // 加载中
      loading: false,
      // 提交中
      submitting: false,
      // 处理中
      handling: false,
      // 转场中
      converting: false,
      // 切换中
      toggling: false,
      // 同步中
      synchronizing: false,
      // 计算中
      calculating: false,
      // 上传中
      uploading: false,
      // 下载中
      downloading: false,
      // 导入中
      importing: false,
      // 导出中
      exporting: false,
      // 加载中
      triggerLoading: false,
      // 提交中
      handleLoading: false,
      // 切换中
      toggleLoading: false,
      // 处理中
      batchLoading: false,
      // 导出中
      exportLoading: false
    };
  },
  methods: {
    // 时间格式化
    formatTime(val) {
      if (val) {
        return this.$utilDate.dateFtt(val, "yyyy-MM-dd HH:mm:ss");
      }
    },
    // 触发表单项校验
    triggerValidateField(vnode) {
      vnode = vnode || this;
      let filedNode = vnode.$parent,
        filedNodeName =
          filedNode.$options.componentName || filedNode.$options.name;
      while (filedNodeName !== "ElFormItem") {
        filedNode = filedNode.$parent;
        if (!filedNode) break;
        filedNodeName =
          filedNode.$options.componentName || filedNode.$options.name;
      }
      if (filedNode) {
        let validNode = filedNode;
        let validNodeName = filedNodeName;
        while (validNodeName !== "ElForm") {
          validNode = validNode.$parent;
          if (!validNode) break;
          validNodeName =
            validNode.$options.componentName || validNode.$options.name;
        }
        if (validNode) {
          this.$nextTick(() => {
            validNode.validateField(filedNode.prop);
          });
        }
      }
    },
    // 移除表单项校验
    triggerClearValidate(vnode) {
      vnode = vnode || this;
      let filedNode = vnode.$parent,
        filedNodeName =
          filedNode.$options.componentName || filedNode.$options.name;
      while (filedNodeName !== "ElFormItem") {
        filedNode = filedNode.$parent;
        if (!filedNode) break;
        filedNodeName =
          filedNode.$options.componentName || filedNode.$options.name;
      }
      if (filedNode) {
        let validNode = filedNode;
        let validNodeName = filedNodeName;
        while (validNodeName !== "ElForm") {
          validNode = validNode.$parent;
          if (!validNode) break;
          validNodeName =
            validNode.$options.componentName || validNode.$options.name;
        }
        if (validNode) {
          this.$nextTick(() => {
            validNode.clearValidate(filedNode.prop);
          });
        }
      }
    },
    // 校验表单是否为空
    validateEmptyForm(vnode, skipProps) {
      vnode = vnode || this;
      skipProps = skipProps || "andor";
      if (!Array.isArray(skipProps)) {
        skipProps = [skipProps];
      }
      for (let i = 0; i < vnode.fields.length; i++) {
        if (!skipProps.includes(vnode.fields[i].prop)) {
          if (!this.$utilStr.isEmpty(vnode.fields[i].fieldValue)) {
            return false;
          }
        }
      }
      return true;
    },
    // 校验表单是否为原始对象（强校验，不能为初始值）
    validateOriginForm(vnode, skipProps) {
      vnode = vnode || this;
      skipProps = skipProps || "andor";
      if (!Array.isArray(skipProps)) {
        skipProps = [skipProps];
      }
      for (let i = 0; i < vnode.fields.length; i++) {
        if (!skipProps.includes(vnode.fields[i].prop)) {
          if (
            !this.$utilStr.isEmpty(vnode.fields[i].fieldValue) &&
            !this.$utilStr.isEqual(
              vnode.fields[i].fieldValue,
              vnode.fields[i].initialValue
            )
          ) {
            return false;
          }
        }
      }
      return true;
    },
    // 校验表单是否非空
    validateNotEmptyForm(vnode, skipProps) {
      vnode = vnode || this;
      skipProps = skipProps || "andor";
      if (!Array.isArray(skipProps)) {
        skipProps = [skipProps];
      }
      for (let i = 0; i < vnode.fields.length; i++) {
        if (!skipProps.includes(vnode.fields[i].prop)) {
          if (!this.$utilStr.isEmpty(vnode.fields[i].fieldValue)) {
            return true;
          }
        }
      }
      this.$alert("请至少填写一个表单项", "提示", {
        confirmButtonText: "知道了",
        type: "warning"
      });
      return false;
    },
    // 校验表单是否非原始对象（强校验，不能为初始值）
    validateNotOriginForm(vnode, skipProps) {
      vnode = vnode || this;
      skipProps = skipProps || "andor";
      if (!Array.isArray(skipProps)) {
        skipProps = [skipProps];
      }
      for (let i = 0; i < vnode.fields.length; i++) {
        if (!skipProps.includes(vnode.fields[i].prop)) {
          if (
            !this.$utilStr.isEmpty(vnode.fields[i].fieldValue) &&
            !this.$utilStr.isEqual(
              vnode.fields[i].fieldValue,
              vnode.fields[i].initialValue
            )
          ) {
            return true;
          }
        }
      }
      this.$alert("请至少填写一个表单项", "提示", {
        confirmButtonText: "知道了",
        type: "warning"
      });
      return false;
    },
    // 滚动到表单错误项所在视野
    scrollIntoFormErrorView(prop, vnode, container) {
      let _this = this;
      if (prop) {
        if (typeof prop === "object" && prop) {
          prop = Object.keys(prop)[0];
        }
        vnode = vnode || _this;
        container =
          container ||
          _this.$el.querySelector(".hdty-scroll") ||
          _this.$el.querySelector(".hdty-scrollbar");
        let children = vnode.$children;
        (function fn(children) {
          for (let i = 0, iLen = children.length; i < iLen; i++) {
            let childrenName =
              children[i].$options.componentName || children[i].$options.name;
            if (childrenName === "ElFormItem") {
              if (children[i].prop === prop) {
                let propContainer = children[i].$el;
                let propContainerScrollTop = propContainer.scrollTop;
                if (propContainerScrollTop > 0) {
                  container.scrollTop = propContainerScrollTop;
                } else {
                  let containerOffsetTop =
                    _this.$utilElem.getOffset(container).top;
                  let propContainerOffsetTop =
                    _this.$utilElem.getOffset(propContainer).top;
                  container.scrollTop =
                    propContainerOffsetTop - containerOffsetTop;
                }
                break;
              }
            }
            if (children[i].$children) {
              fn(children[i].$children);
            }
          }
        })(children);
      }
    },
    // 格式化必传附加数组（key value）
    formatRequireDocs(data) {
      let requiredDocs = [];
      if (data.vo.requiredDoc && data.vo.requiredDoc.length > 0) {
        data.vo.requiredDoc.forEach((item, index) => {
          let obj = {
            key: item,
            value: data.vox.requiredDoc[index]
          };
          requiredDocs.push(obj);
        });
      }
      return requiredDocs;
    },
    // 格式化所有附加数组（key value）
    formatAllDocs(data) {
      let allDocs = [];
      if (data.vo.allDoc && data.vo.allDoc.length > 0) {
        data.vo.allDoc.forEach((item, index) => {
          let obj = {
            key: item,
            value: data.vox.allDoc[index]
          };
          allDocs.push(obj);
        });
      }
      return allDocs;
    },
    // 获取需要过滤掉的附件类型（即找到两个数组中不同的元素）
    getDifferentArr(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    },
    // 判断所传附件是否满足附件必填项的要求
    getRequireRes(requireDocs, fileTableData) {
      // 先定义所有的必传附件集合，以逗号分隔
      let res = "";
      requireDocs.forEach((item) => {
        res += item + ",";
      });
      // 循环遍历已选附件集合
      fileTableData.forEach((item) => {
        // 如果已选附件在必传集合中，则去掉必传集合的字符串中的该选型
        if (res.indexOf(item.fileTypeText) >= 0) {
          // 获取该选项的起始位置
          let start = res.indexOf(item.fileTypeText);
          // 获取该选项的结束位置（该选项后面的逗号位置）
          let end = res.indexOf(",", start);
          // 截取该选项前面的内容
          let fix = res.substring(0, start);
          // 截取该选项后面的内容（该选项逗号后面的内容）
          let sub = res.substring(end + 1);
          // 合并最后的内容
          res = fix + sub;
        }
      });
      if (res) res = res.substring(0, res.length - 1);
      return res;
    },
    // 自动根据地区填充地址
    updateRegion(val, old, data, fieldName) {
      this.$set(this.formData, fieldName, data.nameAll);
    },
    updateRegionAddress(data, formData, field) {
      console.log("formData", formData);
      console.log("field", field);
      console.log("data", data);

      this.$set(this[formData], field, data.nameAll);
    }
  }
};

export const hdTable = {
  data() {
    return {
      // 全部表格大小变化监听组件
      erdAllTable: [],
      // 全部容器大小变化监听元素
      erdAllContainer: []
    };
  },
  mounted() {
    this.addTableResizeDoLayoutListener();
  },
  destroyed() {
    this.removeTableResizeDoLayoutListener();
  },
  methods: {
    // 添加表格元素大小变化进行重新布局监听
    addTableResizeDoLayoutListener(el) {
      this.erdAllContainer = [];
      if (el) {
        if (this.$utilElem.isHTMLElement(el)) {
          this.erdAllContainer.push(el);
        } else if (Array.isArray(Array.prototype.slice.call(el))) {
          this.erdAllContainer = Array.prototype.slice.call(el);
        }
      } else {
        this.erdAllContainer.push(this.$el);
      }
      if (this.erdAllContainer && this.erdAllContainer.length > 0) {
        for (let i = 0, iLen = this.erdAllContainer.length; i < iLen; i++) {
          if (this.$utilElem.isHTMLElement(this.erdAllContainer[i])) {
            if (this.erdAllContainer[i].scrollHeight > 0) {
              this.listenTableResizeDoLayout();
            } else {
              this.$erd.listenTo(
                this.erdAllContainer[i],
                this.listenTableResizeDoLayout
              );
            }
          }
        }
      }
    },
    // 移除表格元素大小变化进行重新布局监听
    removeTableResizeDoLayoutListener() {
      if (this.erdAllContainer && this.erdAllContainer.length > 0) {
        for (let i = 0, iLen = this.erdAllContainer.length; i < iLen; i++) {
          if (this.$utilElem.isHTMLElement(this.erdAllContainer[i])) {
            this.$erd.removeListener(
              this.erdAllContainer[i],
              this.listenTableResizeDoLayout
            );
          }
        }
      }
      if (this.erdAllTable && this.erdAllTable.length > 0) {
        for (let i = 0, iLen = this.erdAllTable.length; i < iLen; i++) {
          this.$erd.removeListener(
            this.erdAllTable[i].$el,
            this.tableResizeDoLayout
          );
        }
      }
    },
    // 监听表格元素大小变化进行重新布局
    listenTableResizeDoLayout() {
      this.removeTableResizeDoLayoutListener();
      this.erdAllTable = this.queryComponentChildrenAll("ElTable");
      if (this.erdAllTable && this.erdAllTable.length > 0) {
        for (let i = 0, iLen = this.erdAllTable.length; i < iLen; i++) {
          this.erdAllTable[i].$el.dataset.index = i;
          this.$erd.listenTo(this.erdAllTable[i].$el, this.tableResizeDoLayout);
        }
      }
    },
    // 表格元素大小变化进行重新布局
    tableResizeDoLayout(e) {
      try {
        let targetIndex = e.dataset.index;
        this.erdAllTable[targetIndex].doLayout();
      } catch (err) {}
    },
    // 获取当前组件模块名称
    queryComponentModuleName(vnode) {
      let module = vnode || this;
      let moduleName = module.$options.moduleName;
      while (!moduleName) {
        module = module.$parent;
        if (module) {
          moduleName = module.$options.moduleName;
        } else {
          break;
        }
      }
      return moduleName;
    },
    // 获取父级组件
    queryComponentParent(name, vnode) {
      vnode = vnode || this;
      let parent = vnode.$parent;
      if (parent && name) {
        let parentName = parent.$options.componentName || parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (parent) {
            parentName = parent.$options.componentName || parent.$options.name;
          } else {
            break;
          }
        }
      }
      return parent;
    },
    // 获取所有匹配的子组件
    queryComponentChildrenAll(name, vnode) {
      vnode = vnode || this;
      let childrenAll = [];
      let children = vnode.$children;
      (function fn(children) {
        if (children && children.length > 0) {
          for (let i = 0, iLen = children.length; i < iLen; i++) {
            let childrenName =
              children[i].$options.componentName || children[i].$options.name;
            if (!name || childrenName === name) {
              childrenAll.push(children[i]);
            }
            if (children[i].$children) {
              fn(children[i].$children);
            }
          }
        }
      })(children);
      return childrenAll;
    }
  }
};

export const hdComponent = {
  mounted() {
    if (this.prop) {
      this.dispatch("HdComponent", "hd.component.addField", [this]);
      let initialValue = this.fieldValue();
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, "initialValue", {
        configurable: true,
        value: initialValue
      });
    }
  },
  beforeDestroy() {
    this.dispatch("HdComponent", "hd.component.removeField", [this]);
  },
  methods: {
    // 重定义父组件自定义事件
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        // .apply()重定义this对象
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    getPropByPath(obj, path, strict) {
      let tempObj = obj;
      //将a[b].c转换为a.b.c
      path = path.replace(/\[(\w+)\]/g, ".$1");
      //将.a.b转换为a.b
      path = path.replace(/^\./, "");
      let keyArr = path.split(".");
      let i = 0;
      for (let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        let key = keyArr[i];
        if (key in tempObj) {
          tempObj = tempObj[key];
        } else {
          if (strict) {
            throw new Error(
              "please transfer a valid prop path to hdComponent!"
            );
          }
          break;
        }
      }
      return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null
      };
    },
    Component() {
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      while (parentName !== "HdComponent") {
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    },
    fieldValue() {
      const model = this.Component().model;
      if (!model || !this.prop) {
        return;
      }
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }
      return this.getPropByPath(model, path, true).v;
    },
    resetField() {
      let model = this.Component().model;
      let value = this.fieldValue();
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }
      let prop = this.getPropByPath(model, path, true);
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
    }
  }
};

export const hdMethod = {
  data() {
    return {
      // 用户权限
      AUTHORITIES: this.$utilLogin.getUserAuthorities()
    };
  },
  methods: {
    // 获取某个模块权限
    getUserModuleAuthority(
      moduleName,
      enabled = this.$app.btnAuthorizationEnabled
    ) {
      if (enabled) {
        if (typeof moduleName !== "undefined") {
          let currentAuthority = this.AUTHORITIES[moduleName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        } else {
          moduleName = this.queryComponentModuleName() || this.$route.name;
          let currentAuthority = this.AUTHORITIES[moduleName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },
    // 获取某个权限
    getUserAuthority(
      authorityName,
      moduleName,
      enabled = this.$app.btnAuthorizationEnabled
    ) {
      if (enabled) {
        if (
          typeof authorityName !== "undefined" &&
          typeof moduleName !== "undefined"
        ) {
          let moduleAuthorities = this.AUTHORITIES[moduleName];
          if (moduleAuthorities) {
            let operationAuthorities = moduleAuthorities.children;
            if (operationAuthorities) {
              let currentAuthority = operationAuthorities[authorityName];
              if (currentAuthority && currentAuthority.hasAuthority) {
                return true;
              }
            }
          }
        } else if (typeof authorityName !== "undefined") {
          moduleName = this.queryComponentModuleName() || this.$route.name;
          let moduleAuthorities = this.AUTHORITIES[moduleName];
          if (moduleAuthorities) {
            let operationAuthorities = moduleAuthorities.children;
            if (operationAuthorities) {
              let currentAuthority = operationAuthorities[authorityName];
              if (currentAuthority && currentAuthority.hasAuthority) {
                return true;
              }
            }
          }
        } else {
          authorityName = this.queryComponentModuleName() || this.$route.name;
          let currentAuthority = this.AUTHORITIES[authorityName];
          if (currentAuthority && currentAuthority.hasAuthority) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },
    // 下载二进制文件流
    download(response) {
      let filename =
        decodeURIComponent(
          response.headers["content-disposition"].split("=")[1]
        ) || new Date().getTime();
      this.$utilFile.downloadBlob(response.data, filename);
    },
    // 获取当前组件模块名称
    queryComponentModuleName(vnode) {
      let module = vnode || this;
      let moduleName = module.$options.moduleName;
      while (!moduleName) {
        module = module.$parent;
        if (module) {
          moduleName = module.$options.moduleName;
        } else {
          break;
        }
      }
      return moduleName;
    },
    // 获取父级组件
    queryComponentParent(name, vnode) {
      vnode = vnode || this;
      let parent = vnode.$parent;
      if (parent && name) {
        let parentName = parent.$options.componentName || parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (parent) {
            parentName = parent.$options.componentName || parent.$options.name;
          } else {
            break;
          }
        }
      }
      return parent;
    },
    // 获取所有匹配的子组件
    queryComponentChildrenAll(name, vnode) {
      vnode = vnode || this;
      let childrenAll = [];
      let children = vnode.$children;
      (function fn(children) {
        if (children && children.length > 0) {
          for (let i = 0, iLen = children.length; i < iLen; i++) {
            let childrenName =
              children[i].$options.componentName || children[i].$options.name;
            if (!name || childrenName === name) {
              childrenAll.push(children[i]);
            }
            if (children[i].$children) {
              fn(children[i].$children);
            }
          }
        }
      })(children);
      return childrenAll;
    }
  }
};

export const ywList = {
  data() {
    return {
      // 查询权限
      AUTHORITY_QUERY:
        !this.$app.btnEnabledConf ||
        this.$utilPublic.getUserAuthority(
          "query",
          this.$options.moduleName || this.$route.name
        ),
      // 分页选择器
      pageOptions: { ...this.$app.pageOptionsConf },
      // 时间选择器
      pickerOptions: this.$app.pickerOptionsConf,
      // 导出条数限制
      exportLimit: this.$global.exportLimit,
      // 空白页提示
      emptyText:
        !this.$app.btnEnabledConf ||
        this.$utilPublic.getUserAuthority(
          "query",
          this.$options.moduleName || this.$route.name
        )
          ? ""
          : "无权限",
      // 加载中
      triggerLoading: false,
      // 提交中
      handleLoading: false,
      // 切换中
      toggleLoading: false,
      // 上传中
      uploading: false,
      // 下载中
      downloading: false,
      // 处理中
      batchLoading: false,
      // 导出中
      exportLoading: false
    };
  },
  beforeMount() {},
  methods: {
    // 删除后刷新列表
    triggerDeletedReload() {
      let _this = this;
      // 判断是否删除的最后一页最后一行
      if (Math.ceil(_this.pageOptions.total % _this.pageOptions.size) === 0) {
        _this.pageOptions.current = _this.pageOptions.current - 1;
      }
      if (_this.pageOptions.current < 1) {
        _this.pageOptions.current = 1;
      }
      _this.loadList();
    },
    // 页码
    handleSizeChange(val) {
      this.pageOptions.size = val;
      this.loadList();
    },
    // 跳转
    handleCurrentChange(val) {
      this.pageOptions.current = val;
      this.loadList();
    },
    // 排序
    handleSortChange(val) {
      if (val.order === "descending") {
        this.queryData.ascs = [];
        this.queryData.descs = [this.$utilStr.getSuffix(val.prop) || val.prop];
      } else if (val.order === "ascending") {
        this.queryData.descs = [];
        this.queryData.ascs = [this.$utilStr.getSuffix(val.prop) || val.prop];
      } else {
        this.queryData.descs = [];
        this.queryData.ascs = [];
      }
      this.pageOptions.current = 1;
      this.loadList();
    },
    // 序号
    setIndex(index) {
      return (this.pageOptions.current - 1) * this.pageOptions.size + index + 1;
    },
    // 日期格式化
    formatDate(row, column, cellValue) {
      if (cellValue) {
        return this.$utilDate.dateFtt(cellValue, "yyyy-MM-dd");
      }
    },
    // 时间格式化
    formatTime(row, column, cellValue) {
      if (cellValue) {
        return this.$utilDate.dateFtt(cellValue, "yyyy-MM-dd HH:mm:ss");
      }
    },
    // 数组格式化
    formatArray(row, column, cellValue) {
      if (cellValue) {
        return this.$utilStr.splitArray(cellValue, "，");
      }
    },
    // 下载二进制文件流
    download(response) {
      let filename =
        decodeURIComponent(
          response.headers["content-disposition"].split("=")[1]
        ) || new Date().getTime();
      let suf = filename.substr(filename.lastIndexOf(".") + 1);
      let type = this.$utilFile.validAcceptType(suf);
      let blob = new Blob([response.data], { type: type });
      if (this.$utilFile.ieVersion() === -1) {
        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
    },
    // 导出验证
    exportValidator() {
      if (this.pageOptions.total === 0) {
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "没有可以导出的数据"
        });
        return false;
      }
      // 导出条数限制
      if (this.exportLimit !== 0 && this.pageOptions.total > this.exportLimit) {
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          message:
            "超出导出数据最大限制，最多导出[" + this.exportLimit + "]条数据",
          type: "warning"
        });
        return false;
      }
      return true;
    }
  }
};
