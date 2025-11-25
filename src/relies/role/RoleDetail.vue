<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="loading">
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="vo.name">
              {{ detailData.vo.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客 户 端" prop="clientTypeList">
              {{ detailData.clientTypeList.join('，') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="共享机构" prop="vox.orgId">
          {{ detailData.vox.orgId }}
        </el-form-item>
        <el-form-item label="描  述" prop="vo.memo">
          {{ detailData.vo.memo }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="添 加 人" prop="vox.createUserId">
              {{ detailData.vox.createUserId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="添加时间" prop="vo.createTime">
              {{ $utilDate.dateFtt(detailData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更 新 人" prop="vox.updateUserId">
              {{ detailData.vox.updateUserId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" prop="vo.updateTime">
              {{ $utilDate.dateFtt(detailData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="hdty-card">
        <div class="hdty-card-body">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(value, key) in treeData"
              :title="handleMatchName(key)"
              :name="key"
              :key="key">
              <el-tree
                key="key"
                :data="value"
                ref="menuTree"
                node-key="id"
                default-expand-all>
                <span class="hdty-space-between" slot-scope="{ data }">
                  <span><i :class="data.icon" class="hdty-icon-left"></i>{{ data.name }}</span>
                  <span>{{ data.type === $global.dictItem.menuType.branchNode || data.type === $global.dictItem.menuType.leafNode ? data.clientType + ' / ' + (data.isNavigation ? data.isNavigation : '未知') : '操作' }}</span>
                </span>
              </el-tree>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { getDetail } from '@/api/role';
  import { getList } from "@/api/dict-item";
  export default {
    name: "RoleDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        detailData: {
          vo: {},
          vox: {},
          clientTypeList: [],
          menuIdList: []
        },
        // 行
        row: {},
        // 显示
        visible: false,
        // 菜单树数据集合
        treeData: null,
        // 客户端数据
        clientData: [],
        // 要展示的name集合
        activeNames: [],
      }
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 重置
        this.resetForm();
        // 加载客户端数据
        this.loadClientData();
      },
      // 加载客户端数据
      loadClientData() {
        let _this = this;
        // 参数
        let dataParams = {
          typeId: _this.$global.dictType.clientType
        };
        getList(dataParams).then(response => {
          let { success, data } = response.data;
          if (success) {
            _this.clientData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loadForm();
        });
      },
      // 加载表单
      loadForm() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getDetail(dataParams).then(response => {
          // 响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.detailData.vo = data.vo;
            _this.detailData.vox = data.vox;
            _this.detailData.clientTypeList = data.vo.clentTypeList;
            let activeList = [];
            for (let k in data.vo.menuTreeList) {
              if (data.vo.menuTreeList.hasOwnProperty(k)) {
                activeList.push(k);
              }
            }
            _this.activeNames = activeList;
            _this.treeData = data.vo.menuTreeList;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      },
      // 匹配客户端名称
      handleMatchName(val) {
        let name = 'Web';
        let obj = this.clientData.find(e => e.key === val);
        if(obj && obj.value) {
          name = obj.value;
        }
        return name;
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.detailData = {
          vo: {},
          vox: {},
          clientTypeList: [],
          menuIdList: []
        };
        this.treeData = null;
      }
    }
  }
</script>

<style scoped>

</style>
