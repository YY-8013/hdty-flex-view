<template>
  <div
    class="hdty-dialog-select hdty-menu-select"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline"
  >
    <hd-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      clear-class="hdty-dialog-select-clear"
      :placeholder="placeholder"
      :clearable="clearable"
      :readonly="readonly"
      :disabled="disabled"
      :adaptive="adaptive"
      @focus="handleInputFocus"
      @clear="handleInputClear(true)"
    >
    </hd-input>
    <el-dialog
      ref="dialogRef"
      :visible.sync="visible"
      class="hdty-dialog-select-wrapper"
      custom-class="hdty-dialog-select-panel hdty-menu-select-dialog hdty-dialog-fit"
      append-to-body
      @open="handleDialogOpen"
    >
      <div slot="title" class="hdty-dialog-header">
        <div class="hdty-dialog-title">
          {{ dialogTitle || placeholder }}
        </div>
        <div
          v-if="refresh"
          class="hdty-dialog-refresh"
          title="点击刷新"
          @click="reload(true)"
        ></div>
      </div>
      <hd-pane fit>
        <div class="hdty-card">
          <div class="hdty-card-body">
            <hd-tree
              v-if="lazy"
              v-loading="loading"
              ref="treeRef"
              :node-key="defaultProps['value']"
              :props="defaultProps"
              :data="rootData"
              :load="loadNode"
              :lazy="lazy"
              highlight-current
              :check-on-click-node="checkOnClickNode"
              :expand-on-click-node="expandOnClickNode"
              :default-expanded-keys="activeDefaultExpandedKeys"
              :show-checkbox="multiple"
              :check-strictly="!checkStrictly"
              :accordion="accordion"
              @node-click="handleNodeClick"
              @check="handleCheck"
            >
              <div class="hdty-space-between" slot-scope="{ data }">
                <div
                  :title="
                    ($utilStr.getValueOfDeepObj(data, defaultProps['code']) ||
                      $utilStr.getValueOfDeepObj(data, defaultProps['value'])) +
                    ' ' +
                    $utilStr.getValueOfDeepObj(data, defaultProps['label'])
                  "
                >
                  <i
                    :class="
                      $utilStr.getValueOfDeepObj(data, defaultProps['icon'])
                    "
                    class="hdty-icon-left"
                  >
                    <span v-if="showCode">
                      {{
                        $utilStr.getValueOfDeepObj(
                          data,
                          defaultProps["code"]
                        ) ||
                        $utilStr.getValueOfDeepObj(data, defaultProps["value"])
                      }}
                    </span> </i
                  >{{ $utilStr.getValueOfDeepObj(data, defaultProps["label"]) }}
                </div>
              </div>
            </hd-tree>
            <el-tree
              v-else
              v-loading="loading"
              ref="treeRef"
              :node-key="defaultProps['value']"
              :props="defaultProps"
              :data="treeData"
              highlight-current
              :check-on-click-node="checkOnClickNode"
              :expand-on-click-node="expandOnClickNode"
              :default-expanded-keys="activeDefaultExpandedKeys"
              :show-checkbox="multiple"
              :check-strictly="!checkStrictly"
              :accordion="accordion"
              @node-click="handleNodeClick"
              @check="handleCheck"
            >
              <div class="hdty-space-between" slot-scope="{ data }">
                <div
                  :title="
                    ($utilStr.getValueOfDeepObj(data, defaultProps['code']) ||
                      $utilStr.getValueOfDeepObj(data, defaultProps['value'])) +
                    ' ' +
                    $utilStr.getValueOfDeepObj(data, defaultProps['label'])
                  "
                >
                  <i
                    :class="
                      $utilStr.getValueOfDeepObj(data, defaultProps['icon'])
                    "
                    class="hdty-icon-left"
                  >
                    <span v-if="showCode">
                      {{
                        $utilStr.getValueOfDeepObj(
                          data,
                          defaultProps["code"]
                        ) ||
                        $utilStr.getValueOfDeepObj(data, defaultProps["value"])
                      }}
                    </span> </i
                  >{{ $utilStr.getValueOfDeepObj(data, defaultProps["label"]) }}
                </div>
              </div>
            </el-tree>
          </div>
        </div>
      </hd-pane>
      <div slot="footer" class="hdty-dialog-footer">
        <div class="hdty-float-left">
          当前选择：
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 0"
            type="success"
            :closable="clearable"
            @close="handleTagClose"
          >
            {{
              $utilStr.getValueOfDeepObj(
                activeTag[0],
                defaultProps["fullLabel"]
              )
            }}
          </el-tag>
          <el-tag
            v-else-if="!Array.isArray(activeTag) && activeTag"
            type="success"
            :closable="clearable"
            @close="handleTagClose"
          >
            {{ activeTag }}
          </el-tag>
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 1"
            type="success"
          >
            +{{ activeTag.length - 1 }}
          </el-tag>
        </div>
        <div class="hdty-btn-container">
          <el-button @click="cancel"> 取 消 </el-button>
          <el-button v-if="multiple" type="primary" @click="submit">
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent, hdForm } from "@/utils/util-framework";
import { showTree } from "./api";
export default {
  name: "index",
  provide() {
    return {
      hdMenu: this
    };
  },
  mixins: [hdComponent, hdForm],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: [Number, String, Array],
      default: ""
    },
    // 绑定值文本
    modelText: {
      type: [Number, String, Array],
      default: ""
    },
    // 启用多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选限制（0代表不限制）
    limit: {
      type: [Number, String],
      default: 0
    },
    // 客户端类型
    clientType: {
      type: [Number, String],
      default: appEnv.clientTYPE
    },
    // 是否强过滤（若开启，则会过滤掉无权限和非导航的列）
    filterStrong: {
      type: Boolean,
      default: false
    },
    // 只能显示到的级别
    showLevel: {
      type: [Number, String],
      default: ""
    },
    // 可选择的级别（支持数组设置多个可选择级别，如[1, 2]）
    checkLevel: {
      type: [Number, String, Array],
      default: ""
    },
    // 输入框尺寸（medium / small / mini）
    size: {
      type: String,
      default: ""
    },
    // 会话选择窗口标题
    dialogTitle: {
      type: String,
      default: "选择列"
    },
    // 水印
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 是否只可选择最后一级
    checkFinalLevel: {
      type: Boolean,
      default: false
    },
    // 多选时是否严格遵守父子节点关联（true:父子关联，选择父级时即选中当前父级所有子级；false:父子不关联，选择任意一级时只选中本身）
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 在改变会影响到绑定值的组件属性时（multiple/limit/clientType/filterStrong/showLevel/checkLevel/checkFinalLevel/checkStrictly），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
    checkInfluentially: {
      type: Boolean,
      default: false
    },
    // 是否默认展开首个节点
    defaultExpandFirst: {
      type: Boolean,
      default: false
    },
    // 是否开启手风琴模式
    accordion: {
      type: Boolean,
      default: false
    },
    // 是否显示刷新按钮
    refresh: {
      type: Boolean,
      default: true
    },
    // 是否显示编码
    showCode: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否开启懒加载
    lazy: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 宽度自适应（元素宽度随内容变化）
    adaptive: {
      type: Boolean,
      default: false
    },
    // 下划线风格
    underline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 默认渲染节点数据对象的配置选项
      defaultProps: {
        // 指定节点的值对应节点数据对象中的属性值
        value: "id",
        // 指定节点标签对应节点数据对象中的属性值
        label: "label",
        // 指定节点子节点对应节点数据对象中的属性值
        children: "children",
        // 指定节点叶子节点标志位对应节点数据对象中的属性值
        isLeaf: "leaf",
        // 指定节点允许多选标志位对应节点数据对象中的属性值
        showCheckbox: "showCheckbox",
        // 指定节点完整标签对应节点数据对象中的属性值
        fullLabel: "label",
        // 指定节点图标对应节点数据对象中的属性值
        icon: "icon",
        // 指定节点级别对应节点数据对象中的属性值
        level: "level",
        // 指定节点编码对应节点数据对象中的属性值
        code: "url",
        // 指定节点数据对象对应响应数据对象中的属性值
        response: "records"
      },
      // 绑定值
      currentValue: this.value,
      // 绑定值文本
      input: this.modelText,
      // 上一次绑定值
      oldValue: "",
      // 树数据
      treeData: [],
      // 树结构根节点数据
      rootData: [],
      // 启用构造数据
      constDataEnabled: true,
      // 构造数据
      constData: [],
      // 多选数据
      multipleData: [],
      // 默认展开首个节点的Key
      defaultFirstNodeKey: null,
      // 默认展开首个节点的子节点数据
      defaultFirstNodeChildData: null,
      // 默认展开的节点的key的数组
      defaultExpandedKeys: [],
      // 父子节点关联时要展开的节点的key的数组
      checkStrictlyExpandedKeys: [],
      // 点击节点时是否选中节点
      checkOnClickNode: false,
      // 点击节点时是否展开或收缩节点
      expandOnClickNode: false,
      // 数据加载完成
      loadComplete: false,
      // 选中回显需要展开的节点数据加载完成
      loadExpandedKeysComplete: false,
      // 显示
      visible: false,
      // 加载中
      loading: false
    };
  },
  computed: {
    activeDefaultExpandedKeys() {
      if (this.multiple && this.checkStrictly) {
        return Array.from(
          new Set(
            this.defaultExpandedKeys.concat(this.checkStrictlyExpandedKeys)
          )
        );
      } else {
        return this.defaultExpandedKeys;
      }
    },
    activeConstDataEnabled() {
      return (
        this.multiple && this.currentValue.length > 0 && this.constDataEnabled
      );
    },
    activeTag() {
      if (this.multiple) {
        return this.multipleData;
      } else {
        return this.input;
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.oldValue = this.value; // 因el-tree是先触发change回调事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
        if (this.$utilStr.isEmpty(val)) {
          if (!this.$utilStr.isEmpty(this.modelText)) {
            this.$emit("update:modelText", val);
          } else if (!this.$utilStr.isEmpty(this.input)) {
            this.input = "";
          }
          if (this.multiple) {
            this.constData = [];
            this.constDataEnabled = true;
            this.clearChecked();
          } else {
            this.clearHighlight();
          }
          this.loadExpandedKeysComplete = true;
        } else {
          this.loadExpandedKeysComplete = false;
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.currentValue = val;
          if (this.activeConstDataEnabled) {
            this.constData = [];
            for (let i = 0; i < val.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.defaultProps["value"],
                val[i]
              );
              this.constData.push(initialValue);
            }
          }
          this.multipleData = this.constData;
        } else {
          this.currentValue = val;
        }
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        if (
          this.$utilStr.isEmpty(val) &&
          !this.$utilStr.isEmpty(this.currentValue)
        ) {
          val = this.currentValue;
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.input = this.$utilStr.arraySplit(val);
          if (this.activeConstDataEnabled) {
            for (let i = 0; i < this.constData.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.defaultProps["value"],
                this.currentValue[i]
              );
              let initialLabel = this.$utilStr.generateDeepObj(
                this.defaultProps["fullLabel"],
                val[i]
              );
              this.constData[i] = this.$utilStr.deepObjMerge(
                initialValue,
                initialLabel
              );
            }
            this.multipleData = this.constData;
          }
        } else {
          this.input = val;
        }
      },
      immediate: true
    },
    multiple: {
      handler(val) {
        if (this.checkInfluentially) {
          this.handleInputClear();
        } else {
          if (val) {
            if (!Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit("input", [this.value]);
              } else {
                this.$emit("input", []);
              }
            }
            if (!Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit("update:modelText", [this.modelText]);
              } else {
                this.$emit("update:modelText", []);
              }
            }
          } else {
            if (Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit("input", this.value[0]);
              } else {
                this.$emit("input", "");
              }
            }
            if (Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit("update:modelText", this.modelText[0]);
              } else {
                this.$emit("update:modelText", "");
              }
            }
          }
        }
      },
      immediate: false
    },
    limit: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    clientType: {
      handler() {
        this.rootData = [];
        this.loadComplete = false;
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    filterStrong: {
      handler() {
        this.rootData = [];
        this.loadComplete = false;
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    showLevel: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    checkLevel: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    checkFinalLevel: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    },
    checkStrictly: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    }
  },
  methods: {
    // input获得焦点
    async handleInputFocus() {
      if (!this.readonly) {
        this.visible = true;
        this.$emit("currentOpening", this);
        if (!this.loadExpandedKeysComplete) {
        }
        if (!this.loadComplete && !this.loading) {
          if (this.lazy) {
            this.loadRootNodeList();
          } else {
            this.loadList();
          }
        } else {
          if (this.multiple) {
            this.setChecked();
          } else {
            this.setHighlight();
          }
        }
      }
    },

    // 获取数据列表
    loadList() {
      this.loading = true;
      // 参数
      let dataParams = {
        zxbs: "0"
      };
      showTree(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            this.treeData = this.reconstructData(
              this.$utilStr.getValueOfDeepObj(
                data,
                this.defaultProps["response"]
              )
            );
            if (this.treeData && this.treeData.length > 0) {
              // 设置默认展开首个节点
              if (this.defaultExpandFirst) {
                let firstNodeData = this.treeData[0];
                let firstNodeIsLeaf = this.$utilStr.getValueOfDeepObj(
                  firstNodeData,
                  this.defaultProps["isLeaf"]
                );
                if (!firstNodeIsLeaf) {
                  this.defaultFirstNodeKey = this.$utilStr.getValueOfDeepObj(
                    firstNodeData,
                    this.defaultProps["value"]
                  );
                  if (
                    !this.defaultExpandedKeys.includes(this.defaultFirstNodeKey)
                  ) {
                    this.defaultExpandedKeys.push(this.defaultFirstNodeKey);
                  }
                }
              }
              // 设置默认展开节点
              if (this.multiple && this.checkStrictly) {
                if (!this.$utilStr.isEmpty(this.currentValue)) {
                  this.treeData.forEach((item) => {
                    let currentChildNodeKey = this.$utilStr.getValueOfDeepObj(
                      item,
                      this.defaultProps["value"]
                    );
                    if (this.currentValue.includes(currentChildNodeKey)) {
                      let currentChildNodeIsLeaf =
                        this.$utilStr.getValueOfDeepObj(
                          item,
                          this.defaultProps["isLeaf"]
                        );
                      if (!currentChildNodeIsLeaf) {
                        this.multipleData = this.multipleData.filter(
                          (e) =>
                            this.$utilStr.getValueOfDeepObj(
                              e,
                              this.defaultProps["value"]
                            ) !== currentChildNodeKey
                        );
                        if (
                          !this.checkStrictlyExpandedKeys.includes(
                            currentChildNodeKey
                          )
                        ) {
                          this.checkStrictlyExpandedKeys.push(
                            currentChildNodeKey
                          );
                        }
                      }
                    }
                  });
                }
              }
            }
            this.loadComplete = true;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          if (this.multiple) {
            this.setChecked();
          } else {
            this.setHighlight();
          }
          this.loading = false;
        });
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level > 0) {
        if (
          node.level === 1 &&
          this.$utilStr.getValueOfDeepObj(
            node.data,
            this.defaultProps["value"]
          ) === this.defaultFirstNodeKey &&
          this.defaultFirstNodeChildData
        ) {
          return resolve(this.defaultFirstNodeChildData);
        }
        this.loadChildNodeList(node, resolve);
      }
    },
    // 加载根节点
    loadRootNodeList(node) {
      this.loading = true;
      // 参数
      let dataParams = {
        zxbs: "0"
      };
      showTree(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            this.rootData = this.reconstructData(
              this.$utilStr.getValueOfDeepObj(
                data,
                this.defaultProps["response"]
              ),
              node
            );
            if (this.rootData && this.rootData.length > 0) {
              // 设置默认展开首个节点
              if (this.defaultExpandFirst) {
                let firstNodeData = this.rootData[0];
                let firstNodeIsLeaf = this.$utilStr.getValueOfDeepObj(
                  firstNodeData,
                  this.defaultProps["isLeaf"]
                );
                if (!firstNodeIsLeaf) {
                  this.defaultFirstNodeKey = this.$utilStr.getValueOfDeepObj(
                    firstNodeData,
                    this.defaultProps["value"]
                  );
                  if (
                    !this.defaultExpandedKeys.includes(this.defaultFirstNodeKey)
                  ) {
                    this.defaultExpandedKeys.push(this.defaultFirstNodeKey);
                  }
                  let firstNodeChildData = this.$utilStr.getValueOfDeepObj(
                    firstNodeData,
                    this.defaultProps["children"]
                  );
                  if (firstNodeChildData && firstNodeChildData.length > 0) {
                    this.defaultFirstNodeChildData = this.reconstructData(
                      firstNodeChildData,
                      node
                    );
                  }
                }
              }
              // 设置默认展开节点
              if (this.multiple && this.checkStrictly) {
                if (!this.$utilStr.isEmpty(this.currentValue)) {
                  this.rootData.forEach((item) => {
                    let currentChildNodeKey = this.$utilStr.getValueOfDeepObj(
                      item,
                      this.defaultProps["value"]
                    );
                    if (this.currentValue.includes(currentChildNodeKey)) {
                      let currentChildNodeIsLeaf =
                        this.$utilStr.getValueOfDeepObj(
                          item,
                          this.defaultProps["isLeaf"]
                        );
                      if (!currentChildNodeIsLeaf) {
                        this.multipleData = this.multipleData.filter(
                          (e) =>
                            this.$utilStr.getValueOfDeepObj(
                              e,
                              this.defaultProps["value"]
                            ) !== currentChildNodeKey
                        );
                        if (
                          !this.checkStrictlyExpandedKeys.includes(
                            currentChildNodeKey
                          )
                        ) {
                          this.checkStrictlyExpandedKeys.push(
                            currentChildNodeKey
                          );
                        }
                      }
                    }
                  });
                  if (
                    this.defaultFirstNodeChildData &&
                    this.defaultFirstNodeChildData.length > 0
                  ) {
                    if (
                      this.checkStrictlyExpandedKeys.includes(
                        this.defaultFirstNodeKey
                      )
                    ) {
                      this.defaultFirstNodeChildData.forEach((item) => {
                        let currentChildNodeKey =
                          this.$utilStr.getValueOfDeepObj(
                            item,
                            this.defaultProps["value"]
                          );
                        let currentChildNodeIsLeaf =
                          this.$utilStr.getValueOfDeepObj(
                            item,
                            this.defaultProps["isLeaf"]
                          );
                        if (!currentChildNodeIsLeaf) {
                          this.multipleData = this.multipleData.filter(
                            (e) =>
                              this.$utilStr.getValueOfDeepObj(
                                e,
                                this.defaultProps["value"]
                              ) !== currentChildNodeKey
                          );
                          if (
                            !this.checkStrictlyExpandedKeys.includes(
                              currentChildNodeKey
                            )
                          ) {
                            this.checkStrictlyExpandedKeys.push(
                              currentChildNodeKey
                            );
                          }
                        } else {
                          if (
                            !this.multipleData.find(
                              (e) =>
                                this.$utilStr.getValueOfDeepObj(
                                  e,
                                  this.defaultProps["value"]
                                ) === currentChildNodeKey
                            )
                          ) {
                            this.multipleData.push(item);
                            if (this.validateLimit()) {
                              this.multipleData.splice(-1);
                            }
                          }
                        }
                      });
                    }
                  }
                }
              }
            }
            this.loadComplete = true;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          if (this.multiple) {
            this.setChecked();
          } else {
            this.setHighlight();
          }
          this.loading = false;
        });
    },
    // 加载子节点
    loadChildNodeList(node, resolve) {
      let parentNodeKey = this.$utilStr.getValueOfDeepObj(
        node.data,
        this.defaultProps["value"]
      );
      // 参数
      let dataParams = {
        parentId: parentNodeKey,
        clientType: this.clientType,
        filterStrong: this.filterStrong,
        isLazy: this.lazy
      };
      showTree(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            let childData = this.reconstructData(
              this.$utilStr.getValueOfDeepObj(
                data,
                this.defaultProps["response"]
              ),
              node
            );
            resolve(childData);
            if (childData && childData.length > 0) {
              // 设置默认展开节点
              if (this.multiple && this.checkStrictly) {
                if (this.checkStrictlyExpandedKeys.includes(parentNodeKey)) {
                  childData.forEach((item) => {
                    let currentChildNodeKey = this.$utilStr.getValueOfDeepObj(
                      item,
                      this.defaultProps["value"]
                    );
                    let currentChildNodeIsLeaf =
                      this.$utilStr.getValueOfDeepObj(
                        item,
                        this.defaultProps["isLeaf"]
                      );
                    if (!currentChildNodeIsLeaf) {
                      this.multipleData = this.multipleData.filter(
                        (e) =>
                          this.$utilStr.getValueOfDeepObj(
                            e,
                            this.defaultProps["value"]
                          ) !== currentChildNodeKey
                      );
                      if (
                        !this.checkStrictlyExpandedKeys.includes(
                          currentChildNodeKey
                        )
                      ) {
                        this.checkStrictlyExpandedKeys.push(
                          currentChildNodeKey
                        );
                      }
                    } else {
                      if (
                        !this.multipleData.find(
                          (e) =>
                            this.$utilStr.getValueOfDeepObj(
                              e,
                              this.defaultProps["value"]
                            ) === currentChildNodeKey
                        )
                      ) {
                        this.multipleData.push(item);
                        if (this.validateLimit()) {
                          this.multipleData.splice(-1);
                        }
                      }
                    }
                  });
                } else if (!this.$utilStr.isEmpty(this.currentValue)) {
                  childData.forEach((item) => {
                    let currentChildNodeKey = this.$utilStr.getValueOfDeepObj(
                      item,
                      this.defaultProps["value"]
                    );
                    if (this.currentValue.includes(currentChildNodeKey)) {
                      let currentChildNodeIsLeaf =
                        this.$utilStr.getValueOfDeepObj(
                          item,
                          this.defaultProps["isLeaf"]
                        );
                      if (!currentChildNodeIsLeaf) {
                        this.multipleData = this.multipleData.filter(
                          (e) =>
                            this.$utilStr.getValueOfDeepObj(
                              e,
                              this.defaultProps["value"]
                            ) !== currentChildNodeKey
                        );
                        if (
                          !this.checkStrictlyExpandedKeys.includes(
                            currentChildNodeKey
                          )
                        ) {
                          this.checkStrictlyExpandedKeys.push(
                            currentChildNodeKey
                          );
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          if (this.multiple) {
            this.setChecked();
          } else {
            this.setHighlight();
          }
        });
    },
    // 重构数据
    reconstructData(data, node) {
      if (data && data.length > 0) {
        for (let i = data.length - 1; i >= 0; i--) {
          // 设置节点级别
          if (
            !this.$utilStr.isNum(
              this.$utilStr.getValueOfDeepObj(
                data[i],
                this.defaultProps["level"]
              )
            )
          ) {
            let initialLevel = this.$utilStr.generateDeepObj(
              this.defaultProps["level"],
              (node ? node.level : 0) + 1
            );
            this.$utilStr.deepObjMerge(data[i], initialLevel);
          }
          // 设置是否显示当前级别
          if (!this.$utilStr.isEmpty(this.showLevel)) {
            let currentLevel = Number(
              this.$utilStr.getValueOfDeepObj(
                data[i],
                this.defaultProps["level"]
              )
            );
            let showLevel = Number(this.showLevel);
            if (currentLevel === showLevel) {
              if (
                !this.$utilStr.getValueOfDeepObj(
                  data[i],
                  this.defaultProps["isLeaf"]
                )
              ) {
                let initialLeaf = this.$utilStr.generateDeepObj(
                  this.defaultProps["isLeaf"],
                  true
                );
                this.$utilStr.deepObjMerge(data[i], initialLeaf);
              }
            } else if (currentLevel > showLevel) {
              data.splice(i, 1);
            }
          }
          // 设置是否显示复选框
          if (this.multiple && data[i]) {
            let initialShowCheckbox = this.$utilStr.generateDeepObj(
              this.defaultProps["showCheckbox"],
              this.validateCheck(data[i])
            );
            this.$utilStr.deepObjMerge(data[i], initialShowCheckbox);
          }
        }
      }
      return data;
    },
    // 多选回显
    setChecked() {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.setCheckedKeys(
          this.$utilStr.objArrayToArray(
            this.multipleData,
            this.defaultProps["value"]
          )
        );
      }
    },
    // 多选清空
    clearChecked() {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.setCheckedKeys([]);
        if (!this.$utilStr.isEmpty(this.multipleData)) {
          this.triggerClearValidate();
        }
      }
    },
    // 多选
    handleCheck(data, checked) {
      let currentKey = this.$utilStr.getValueOfDeepObj(
        data,
        this.defaultProps["value"]
      );
      let currentIsChecked = checked.checkedKeys.includes(currentKey);
      let currentMultipleData = this.$refs.treeRef.getCheckedNodes();
      if (this.checkStrictly) {
        currentMultipleData = currentMultipleData.filter((e) =>
          this.$utilStr.getValueOfDeepObj(e, this.defaultProps["isLeaf"])
        );
        let currentCheckedNodes = checked.checkedNodes;
        let currentCheckedIsNotLeafNodeKeys = [];
        if (currentCheckedNodes && currentCheckedNodes.length > 0) {
          for (let i = 0, iLen = currentCheckedNodes.length; i < iLen; i++) {
            let currentCheckedNodeIsLeaf = this.$utilStr.getValueOfDeepObj(
              currentCheckedNodes[i],
              this.defaultProps["isLeaf"]
            );
            if (!currentCheckedNodeIsLeaf) {
              currentCheckedIsNotLeafNodeKeys.push(
                this.$utilStr.getValueOfDeepObj(
                  currentCheckedNodes[i],
                  this.defaultProps["value"]
                )
              );
            }
          }
        }
        if (
          this.checkStrictlyExpandedKeys &&
          this.checkStrictlyExpandedKeys.length > 0
        ) {
          for (let i = this.checkStrictlyExpandedKeys.length - 1; i >= 0; i--) {
            if (
              !currentCheckedIsNotLeafNodeKeys.includes(
                this.checkStrictlyExpandedKeys[i]
              )
            ) {
              this.checkStrictlyExpandedKeys.splice(i, 1);
            }
          }
        }
        if (
          currentCheckedIsNotLeafNodeKeys &&
          currentCheckedIsNotLeafNodeKeys.length > 0
        ) {
          for (
            let i = 0, iLen = currentCheckedIsNotLeafNodeKeys.length;
            i < iLen;
            i++
          ) {
            if (
              !this.checkStrictlyExpandedKeys.includes(
                currentCheckedIsNotLeafNodeKeys[i]
              )
            ) {
              this.checkStrictlyExpandedKeys.push(
                currentCheckedIsNotLeafNodeKeys[i]
              );
            }
          }
        }
      }
      if (currentIsChecked) {
        if (this.validateLimit(currentMultipleData)) {
          if (this.checkStrictly) {
            let currentIsLeaf = this.$utilStr.getValueOfDeepObj(
              data,
              this.defaultProps["isLeaf"]
            );
            if (!currentIsLeaf) {
              currentMultipleData.forEach((item) => {
                if (
                  !this.multipleData.find(
                    (e) =>
                      this.$utilStr.getValueOfDeepObj(
                        e,
                        this.defaultProps["value"]
                      ) ===
                      this.$utilStr.getValueOfDeepObj(
                        item,
                        this.defaultProps["value"]
                      )
                  )
                ) {
                  if (this.multipleData.length + 1 <= this.limit) {
                    this.multipleData.push(item);
                  }
                }
              });
            }
          }
          this.setChecked();
        } else {
          this.multipleData = currentMultipleData;
        }
      } else {
        this.multipleData = currentMultipleData;
      }
      if (
        !this.$utilStr.isEmpty(this.currentValue) ||
        !this.$utilStr.isEmpty(this.multipleData)
      ) {
        this.triggerClearValidate();
      }
    },
    // 单选回显
    setHighlight() {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.setCurrentKey(this.currentValue);
      }
    },
    // 单选清空
    clearHighlight() {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.setCurrentKey();
      }
    },
    // 单选
    handleSelect(data) {
      this.visible = false;
      let currentKey = this.$utilStr.getValueOfDeepObj(
        data,
        this.defaultProps["value"]
      );
      let currentLabel = this.$utilStr.getValueOfDeepObj(
        data,
        this.defaultProps["fullLabel"]
      );
      this.input = currentLabel;
      this.$emit("input", currentKey); // 触发 input 事件，并传入新值
      this.$emit("update:modelText", currentLabel);
      if (!this.$utilStr.isEqual(currentKey, this.oldValue)) {
        this.$emit("currentChanged", currentKey, this.oldValue, data);
      }
    },
    // 点击节点事件
    handleNodeClick(data, node, self) {
      if (this.validateCheck(data)) {
        if (!this.multiple) {
          this.handleSelect(data, node);
        }
      } else {
        self.handleExpandIconClick();
      }
    },
    // 验证节点是否可选择
    validateCheck(data) {
      let checked = false;
      let checkFinalLevel = this.checkFinalLevel;
      let checkLevel = this.checkLevel;
      if (checkFinalLevel) {
        if (
          this.$utilStr.getValueOfDeepObj(data, this.defaultProps["isLeaf"])
        ) {
          checked = true;
        }
      } else {
        if (!this.$utilStr.isEmpty(checkLevel)) {
          if (Array.isArray(checkLevel)) {
            let fLevel = checkLevel.find(
              (e) =>
                String(e) ===
                String(
                  this.$utilStr.getValueOfDeepObj(
                    data,
                    this.defaultProps["level"]
                  )
                )
            );
            if (fLevel) {
              checked = true;
            }
          } else {
            if (
              String(checkLevel) ===
              String(
                this.$utilStr.getValueOfDeepObj(
                  data,
                  this.defaultProps["level"]
                )
              )
            ) {
              checked = true;
            }
          }
        } else {
          checked = true;
        }
      }
      return checked;
    },
    // 验证多选是否超过限制数量
    validateLimit(multipleData) {
      multipleData = multipleData || this.multipleData;
      if (Number(this.limit) > 0 && multipleData.length > this.limit) {
        try {
          let currentLimitMessageEls = document.querySelectorAll(
            ".el-message.is-menu-select-limit"
          );
          [].forEach.call(currentLimitMessageEls, (el) => {
            el.classList.add("hdty-hide");
          });
        } catch (e) {}
        this.$message({
          showClose: true,
          customClass: "is-fixed-top is-menu-select-limit",
          message: "超出多选限制，最多选择[" + this.limit + "]项数据",
          type: "error",
          offset: 76
        });
        return true;
      }
      return false;
    },
    // input清空
    handleInputClear(emitEvent) {
      if (this.multiple) {
        this.multipleData = [];
        this.$emit("input", []);
        this.$emit("update:modelText", []);
        if (emitEvent) {
          this.$emit("currentChanged", [], this.oldValue, []);
        }
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        if (emitEvent) {
          this.$emit("currentChanged", "", this.oldValue, null);
        }
      }
    },
    // tag关闭
    handleTagClose() {
      if (this.multiple) {
        this.$refs.treeRef.setChecked(this.multipleData[0], false);
        this.multipleData.splice(0, 1);
      } else {
        this.$refs.treeRef.setCurrentKey();
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        this.$emit("currentChanged", "", this.oldValue, null);
      }
    },
    // dialog打开
    handleDialogOpen() {
      this.$refs.dialogRef.$el.onclick = (evt) => {
        evt.stopPropagation();
      };
      this.$nextTick(() => {
        let popupParentHiddenEl = document.querySelector(
          ".el-popup-parent--hidden"
        );
        if (popupParentHiddenEl) {
          popupParentHiddenEl.onclick = (evt) => {
            evt.stopPropagation();
            popupParentHiddenEl.onclick = null;
          };
        }
      });
    },
    // 提交
    submit() {
      if (!this.validateLimit()) {
        this.visible = false;
        let currentKeys = this.$utilStr.objArrayToArray(
          this.multipleData,
          this.defaultProps["value"]
        );
        let currentLabels = this.$utilStr.objArrayToArray(
          this.multipleData,
          this.defaultProps["fullLabel"]
        );
        this.input = this.$utilStr.arraySplit(currentLabels);
        this.$emit("input", currentKeys);
        this.$emit("update:modelText", currentLabels);
        if (!this.$utilStr.isEqual(currentKeys, this.oldValue)) {
          this.$emit(
            "currentChanged",
            currentKeys,
            this.oldValue,
            this.multipleData
          );
        }
        if (this.constDataEnabled) this.constDataEnabled = false;
        this.constData = this.multipleData;
      }
    },
    // 取消
    cancel() {
      this.visible = false;
      if (this.multiple) {
        this.reset();
      }
    },
    // 重置
    reset() {
      this.multipleData = this.constData;
      this.setChecked();
    },
    // 重新加载
    reload(immediate) {
      if (immediate) {
        if (this.lazy) {
          this.loadRootNodeList();
        } else {
          this.loadList();
        }
      } else {
        this.loadComplete = false;
      }
    }
  }
};
</script>

<style scoped></style>
