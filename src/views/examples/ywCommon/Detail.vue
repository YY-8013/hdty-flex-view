<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <div class="con-form-anchor">
      <div class="con-anchor">
        <div class="inner">
          <div v-for="anchorItem in anchorList" :key="anchorItem.id">
            <div
              v-if="anchorItem.show"
              class="anchor-item anchor-item-menu"
              :class="{'is-active': activeAnchor === anchorItem.id}"
            >
              <a href="javascript:;" @click.prevent="handleAnchor(anchorItem.id)">
                <i :class="anchorItem.iconClass"></i>
                <p>{{anchorItem.label}}</p>
              </a>
            </div>
          </div>
          <!--回到顶部-->
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>
      <div class="con-form">
        <hd-pane fit v-loading="handleLoading" :id="formId">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            label-width="0"
            @keyup.enter.native="submitForm"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基础信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="姓&emsp;&emsp;名" :required="false" :span="12">
                      <el-form-item prop="vo.name">{{ formData.vo.name }}</el-form-item>
                    </biz-form-item>
                    <biz-form-item label="身份证号" :required="false" :span="12">
                      <el-form-item prop="vo.cardid">
                        <biz-big-data class="hdty-main-color" :cardId="formData.vo.cardid"></biz-big-data>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>

                  <biz-form-row>
                    <biz-form-item label="备&emsp;&emsp;注" :required="false" pClass="p-divs">
                      <el-form-item prop="memo">{{ formData.vo.memo }}</el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
              <biz-form-card title="操作信息" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="添加人" :required="false" :span="12">
                      <el-form-item prop="cjrxm">{{ formData.vo.cjrxm }}</el-form-item>
                    </biz-form-item>
                    <biz-form-item label="添加时间" :required="false" :span="12">
                      <el-form-item prop="cjsj">{{ formData.vox.cjsj }}</el-form-item>
                    </biz-form-item>
                  </biz-form-row>

                  <biz-form-row>
                    <biz-form-item label="操作人" :required="false" :span="12">
                      <el-form-item prop="czrxm">{{ formData.vo.czrxm }}</el-form-item>
                    </biz-form-item>
                    <biz-form-item label="更新时间" :required="false" :span="12">
                      <el-form-item prop="czsj">{{ formData.vox.czsj }}</el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from '@/utils/util-framework';
import anchorScroll from '@/views/global/mixin/anchorScroll.js'; // 路径根据你的项目实际调整

// import { detail } from './api';

export default {
  name: 'Detail',
  provide() {
    return {
      ZdmbAdd: this
    };
  },
  components: {},
  inject: ['hdList'],
  mixins: [hdList, hdForm, anchorScroll],

  data() {
    return {
      // 表单
      formData: {
        vo: {},
        vox: {}
      },
      // 行
      row: {},
      // 显示
      visible: false,
      imgurl: '',
      // 表单id
      formId: 'form' + this.$utilStr.uuid(32),
      anchorIds: [],
      // 当前滚动选中的锚点
      activeAnchor: '',
      // 是否为点击锚点操作
      clickAnchor: false,
      // 动态为锚点添加id
      anchorList: [
        {
          label: '基础信息',
          id: 'ref' + this.$utilStr.uuid(32),
          iconClass: 'el-icon-tickets',
          show: true
        },
        {
          label: '操作信息',
          id: 'ref' + this.$utilStr.uuid(32),
          iconClass: 'el-icon-document-copy',
          show: true
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      let _this = this;
      _this.updateAnchorList();
      _this.$nextTick(() => {
        // 初始化滚动区域;
        _this.initScrollBox();
        _this.resetForm();
        // 加载表单
        _this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      detail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
            _this.imgurl = appEnv.baseURL + data.vo.photoUrl;
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
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };
    },
    updateAnchorList() {
      this.anchorList = this.anchorList.map((item) => {
        switch (item.label) {
          case '基本信息':
            item.show = true; // 根据条件，动态设置是否展示
            break;
          default:
            item.show = true;
        }
        return item;
      });
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
