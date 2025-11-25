<template>
  <el-dialog title="详情" :visible.sync="visible" append-to-body>
    <hd-pane fit>
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm"
      >
        <div class="hdty-card">
          <div class="hdty-card-header">基本信息</div>
          <div class="hdty-card-body">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vo.name" label="菜单名称">{{ detailData.vo.name }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vox.clientType" label="客 户 端">{{ detailData.vox.clientType }}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="detailData.vo.clientType === $global.dictItem.clientType.appTerminal && (detailData.vo.appLinkType === $global.dictItem.appLinkType.pluggable || detailData.vo.appLinkType === $global.dictItem.appLinkType.third || detailData.vo.appLinkType === $global.dictItem.appLinkType.html5)"
              prop="vo.pluggableId"
              label="插件"
            >{{ detailData.vox.pluggableId }}</el-form-item>
            <el-form-item
              v-if="detailData.vo.parentValue"
              prop="vo.parentValue"
              label="父级菜单"
            >{{ detailData.vo.parentValue }}</el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vo.url" label="菜单代码">{{ detailData.vo.url }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vox.type" label="菜单类型">{{ detailData.vox.type }}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="vo.path" label="跳转路径">{{ detailData.vo.path }}</el-form-item>
            <el-form-item prop="vo.redirect" label="重 定 向">{{ detailData.vo.redirect }}</el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vo.icon" label="菜单图标">
                  {{ detailData.vo.icon }}
                  <i
                    v-if="detailData.vo.icon"
                    class="hdty-icon-right"
                    :class="detailData.vo.icon"
                  ></i>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vox.isNavigation" label="菜单性质">{{ detailData.vox.isNavigation }}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="detailData.vo.parentValue"
              prop="vo.parentValue"
              label="父级菜单"
            >{{ detailData.vo.parentValue }}</el-form-item>
            <el-row v-if="detailData.vo.clientType === $global.dictItem.clientType.appTerminal">
              <el-col :span="12">
                <el-form-item
                  prop="vox.isAuthorityHide"
                  label="无权限隐藏"
                >{{ detailData.vox.isAuthorityHide }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vox.order" label="跳转类型">{{ detailData.vox.appLinkType }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="vox.mqttTopic" label="订阅主题">{{ detailData.vox.mqttTopic }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vo.order" label="排  序">{{ detailData.vo.order }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="vox.createUserId"
                  label="添 加 人"
                >{{ detailData.vox.createUserId }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="vo.createTime"
                  label="添加时间"
                >{{ $utilDate.dateFtt(detailData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="vox.updateUserId"
                  label="操 作 人"
                >{{ detailData.vox.updateUserId }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="vo.updateTime"
                  label="更新时间"
                >{{ $utilDate.dateFtt(detailData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="detailData.vo.type === $global.dictItem.menuType.leafNode" class="hdty-card">
          <div class="hdty-card-header">权限信息</div>
          <div class="hdty-card-body">
            <el-table :data="detailData.vo.pageElementList" row-key="id" border>
              <el-table-column
                fixed
                type="index"
                label="序号"
                class-name="is-plain"
                align="center"
                width="40"
              ></el-table-column>
              <el-table-column fixed prop="name" label="名称" header-align="center" width="100"></el-table-column>
              <el-table-column prop="url" label="标识符" header-align="center" width="100"></el-table-column>
              <el-table-column prop="icon" label="图标" header-align="center" width="60">
                <template slot-scope="scope">
                  <i :class="scope.row.icon"></i>
                </template>
              </el-table-column>
              <el-table-column prop="authority" label="权限" header-align="center" min-width="180"></el-table-column>
              <el-table-column
                prop="mqttTopicText"
                label="订阅主题"
                header-align="center"
                min-width="180"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div
          v-if="detailData.vo.url !== 'Home' && detailData.vo.type === $global.dictItem.menuType.leafNode"
          class="hdty-card"
        >
          <div class="hdty-card-header">路由信息</div>
          <div class="hdty-card-body">
            <el-form-item prop="vox.viewType" label="路由视图">{{ detailData.vox.viewType }}</el-form-item>
            <el-form-item prop="vox.linkType" label="跳转方式">{{ detailData.vox.linkType }}</el-form-item>
            <el-form-item
              v-if="detailData.vo.linkType===$global.dictItem.linkType.system"
              prop="vox.subSystemId"
              label="接入系统"
            >{{detailData.vox.subSystemId}}</el-form-item>
            <el-row
              v-if="(detailData.vo.linkType===$global.dictItem.linkType.system || detailData.vo.linkType===$global.dictItem.linkType.website) && detailData.vo.clientType !== $global.dictItem.clientType.appTerminal"
            >
              <el-col :span="12">
                <el-form-item label="请求路径">{{detailData.vo.targetPath}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="请求参数" prop="requestParams">{{detailData.vo.requestParams}}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="detailData.vo.clientType !== $global.dictItem.clientType.appTerminal"
              prop="vo.component"
              label="组件位置"
            >{{ detailData.vo.component }}</el-form-item>
            <el-row v-if="detailData.vo.clientType !== $global.dictItem.clientType.appTerminal">
              <el-col :span="12">
                <el-form-item prop="vox.keepAlive" label="是否缓存">{{ detailData.vox.keepAlive }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="vox.loosened" label="是否放行">{{ detailData.vox.loosened }}</el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="参  数" prop="vo.params">
              <hd-json-editor v-model="detailData.vo.params" readonly></hd-json-editor>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { getDetail } from '@/api/menu';

export default {
  name: 'MenuDetail',
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
        vox: {}
      },
      // 行
      row: {},
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 重置
      this.resetForm();
      // 加载表单
      this.loadForm();
    },
    // 详情
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        id: _this.row.id
      };
      // Lambda写法
      getDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.detailData = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 取消
    cancelForm() {
      this.visible = false;
    },
    // 重置
    resetForm() {
      this.detailData = {
        vo: {},
        vox: {}
      };
    }
  }
};
</script>

<style scoped>
</style>
