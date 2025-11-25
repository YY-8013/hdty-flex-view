<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :underline="underline"
      @focus="handleInputFocus"
      @clear="handleInputClear">
    </el-input>
    <el-dialog
      :visible.sync="visible"
      custom-class="hdty-dialog-fit"
      append-to-body>
      <slot slot="title">
        <span class="el-dialog__title">{{ title }}</span>
        <i v-if="refreshed" class="hdty-dialog-refresh icon-refresh" title="点击刷新" @click="updateNode">
        </i>
      </slot>
      <hd-pane
        fit>
        <div class="hdty-card">
          <div class="hdty-card-body">
            <el-tree
              v-if="lazy"
              v-loading="loading"
              ref="tree"
              class="filter-tree"
              :props="props"
              :lazy="lazy"
              :load="loadNode"
              :data="rootList"
              node-key="id"
              accordion
              highlight-current
              :expand-on-click-node="expandOnClickNode"
              :default-expanded-keys="expandedKeys"
              @node-click="handleNodeClick">
              <span class="hdty-space-between" slot-scope="{ node, data }">
                <div :title="node.data.name"><span v-if="showCode" class="hdty-icon-left">{{ node.data.id }}</span>{{ node.data.name }}</div>
              </span>
            </el-tree>
          </div>
        </div>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <cite class="hdty-float-left">当前选择：<el-tag v-if="input" type="success" :closable="clearable" @close="handleTagClose">{{ input }}</el-tag></cite>
        <el-button @click="cancelForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { hdComponent, hdMethod } from '@/utils/util-framework';
  import { getTree } from '@/api/organ';
  export default {
    name: "index",
    provide() {
      return {
        hdOrgan: this
      };
    },
    mixins: [hdComponent, hdMethod],
    props: {
      prop: String,
      // 绑定值
      value: {
        type: [Number, String],
        default: ''
      },
      // 绑定值文本
      modelText: {
        type: String,
        default: ''
      },
      // 开启懒加载
      lazy: {
        type: Boolean,
        default: true
      },
      // 尺寸
      size: {
        type: String,
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 清空
      clearable: {
        type: Boolean,
        default: true,
      },
      // 显示边框
      underline: {
        type: Boolean,
        default: false
      },
      // 显示编码
      showCode: {
        type: Boolean,
        default: false
      },
      // 过滤机构
      filterOrg: {
        type: [Number, String],
        default: ''
      },
      // 选择机构的级别 5 就是只能选择派出所 默认 ''
      selectLevel: {
        type: [Number, String],
        default: ''
      },
      // 选择最后一级机构 true 就是选择最后一个级别 默认 false
      selectLastLevel: {
        type: Boolean,
        default: false
      },
      // 显示部门机构( 显示1/不显示0 )
      isShowDept: {
        type: String,
        default: '0'
      },
      // 是否过滤显示到市一级
      isFilterCity: {
        type: Boolean,
        default: false
      },
      // 会话标题
      title: {
        type: String,
        default: '管辖机构'
      },
      // 显示刷新
      refreshed: {
        type: Boolean,
        default: true
      },
      // 只能显示到的级别
      showLevel: {
        type: [Number, String],
        default: ''
      },
    },
    data() {
      return {
        // 当前选择节点的文字信息
        input: this.modelText,
        // 是否显示dialog
        visible: false,
        // 点击节点是否自动展开节点
        expandOnClickNode: false,
        // 展开节点keys 就是id的值
        expandedKeys: [],
        // 根节点数据
        rootList: [],
        // 懒加载子节点数组
        childrenList: [],
        // 父窗体传递的参数
        parentParams: {
          selectLevel: this.selectLevel,
          selectLastLevel: this.selectLastLevel,
        },
        // 向后台请求的参数
        params: {
          isFirstLoad: true,
          parentId: '',
          filterOrg: this.filterOrg,
          isFilterCity: this.isFilterCity,
          isShowDept: this.isShowDept
        },
        // 更新懒加载
        updateLazy: false,
        // 加载
        loading: false,
        // 绑定值的字段名
        valueField: 'id',
        // 绑定值文本的字段名
        labelField: 'name',
        // 级别的字段名
        levelField: 'level',
        // 配置选项
        props: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf',
          showCheckbox: 'showCheckbox'
        },
        // 级别配置
        levelOptions: [
          {
            key: '1',
            value: '公安部'
          },
          {
            key: '2',
            value: '省厅'
          },
          {
            key: '3',
            value: '市局'
          },
          {
            key: '4',
            value: '分局'
          },
          {
            key: '5',
            value: '派出所'
          },
          {
            key: '6',
            value: '责任区'
          }
        ],
      }
    },
    watch: {
      value: {
        handler(val) {
          if (!val) {
            this.input = '';
          }
        },
        immediate: true
      },
      modelText: {
        handler(val) {
          this.input = val;
        },
        immediate: true
      }
    },
    methods: {
      // 重构数据
      reconstructData(data) {
        let _this = this;
        if(data && data.length > 0) {
          // 是否显示当前级别
          if(!_this.$utilStr.isEmpty(_this.showLevel)) {
            let dataHasDelete = false;
            data.forEach((e, i) => {
              let currentLevel = Number(e[_this.levelField]);
              let showLevel = Number(_this.showLevel);
              if(currentLevel === showLevel) {
                if(!e[_this.props.isLeaf]) e[_this.props.isLeaf] = true;
              } else if(currentLevel > showLevel) {
                if(!dataHasDelete) dataHasDelete = true;
                delete data[i];
              }
            });
            if(dataHasDelete) data = data.filter(e => e);
          }
        }
        return data;
      },
      // input获得焦点
      handleInputFocus() {
        let _this = this;
        _this.visible = true;
        _this.$emit('currentOpening', _this);
        if(_this.updateLazy){
          _this.updateNode();
        }
      },
      // 懒加载时触发
      loadNode(node, resolve) {
        // 加载根节点
        if (node.level === 0) {
          if (this.params.isFirstLoad) {
            return this.getNodeList();
          }
        }
        // 加载第二级节点
        if (node.level === 1) {
          if (this.rootList.length > 0) {
            return resolve(this.rootList[0].children);
          } else {
            return resolve([]);
          }
        }
        // 加载其他级别节点
        if (node.level > 1) {
          this.getChildrenNode(node, resolve);
        }
      },
      // 更新节点
      updateNode() {
        this.rootList = [];
        this.params.isFirstLoad = true;
        this.getNodeList();
      },
      // 懒加载下级节点
      getChildrenNode(node, resolve) {
        let _this = this;
        _this.params.parentId = node.data.id;
        // 参数
        let dataParams = {
          ..._this.params
        };
        getTree(dataParams).then(response => {
          _this.childrenList = _this.reconstructData(response.data.data) ;
          resolve(_this.childrenList);
        }).catch(error => {
          console.error(error);
        });
      },
      // 获取一级节点
      getNodeList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.params
        };
        getTree(dataParams).then(response => {
          _this.rootList = _this.reconstructData(response.data.data) ;
          // 取消最小可显示级别前的+号
          if (!_this.$utilStr.isEmpty(_this.showLevel)) {
            if (_this.rootList) {
              _this.rootList.forEach(item => {
                if (item.children) {
                  item.children.forEach(i => {
                    if (Number(_this.showLevel) === Number(i.level)) {
                      i.isLeaf = true;
                    }
                  });
                }
              });
            }
          }
          // 设置展开节点
          if (_this.rootList.length > 0 && !_this.rootList[0].isLeaf) {
            _this.expandedKeys[0] = _this.rootList[0].id;
          }
          // 首次加载属性修改
          _this.params.isFirstLoad = false;
        }).catch(error => {
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      },
      // 点击节点事件
      handleNodeClick(data, node, vueComponent) {
        let _this = this;
        let ok = false;
        if (_this.parentParams.selectLastLevel) {
          if (!node.isLeaf) {
            // 调用原生element ui tree 图标懒加载函数
            vueComponent.handleExpandIconClick(data, node, vueComponent);
          } else {
            ok = true;
          }
        } else if (_this.parentParams.selectLevel) {
          if (_this.parentParams.selectLevel === data.level) {
            ok = true;
          } else {
            // 调用原生element ui tree 图标懒加载函数
            vueComponent.handleExpandIconClick(data, node, vueComponent);
          }
        } else {
          ok = true;
        }
        if (ok) {
          this.visible = false;
          this.input = data.name;
          // 触发 input 事件，并传入新值
          this.$emit('input', data.id);
          this.$emit('update:modelText', data.name);
          this.$emit('currentChanged', data);
          this.triggerValidate();
        }
      },
      // input清空
      handleInputClear() {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        this.$emit('currentChanged', {});
        this.triggerValidate();
      },
      // tag关闭
      handleTagClose() {
        this.$refs.tree.setCheckedKeys([]);
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        this.$emit('currentChanged', {});
        this.triggerValidate();
      },
      // 触发校验
      triggerValidate() {
        let validateElement = this.queryComponentParent(this, 'ElForm');
        let validateFieldElement = this.queryComponentParent(this, 'ElFormItem');
        this.$nextTick(()=> {
          if(validateFieldElement) {
            validateElement.validateField(validateFieldElement.prop);
          }
        });
      },
      // 取消
      cancelForm() {
        this.visible = false;
      }
    }
  }
</script>

<style scoped>

</style>
