<template>
  <el-dialog title="详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <!--人员信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            人员信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">姓 名</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.name}}</div>
                    </div>
                  </div>
                </div>
                <!--身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">身份证号</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.cardId}}</div>
                    </div>
                  </div>
                </div>
                <!--人员标签-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">人员标签</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{$utilStr.splitArray(formData.zdrylxText)}}</div>
                    </div>
                  </div>
                </div>
                <!--管控单位类型-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">管控单位类型</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.gkdwlxText}}</div>
                    </div>
                  </div>
                </div>
                <!--地区-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">地 区</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.regionIdText}}</div>
                    </div>
                  </div>
                </div>
                <!--地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">地 址</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.regionAddress}}</div>
                    </div>
                  </div>
                </div>
                <!--机构-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">机 构</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.orgIdText}}</div>
                    </div>
                  </div>
                </div>

                <div v-if="['01','03'].includes(batchIssueType)" class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">待核实通用标签</label>
                    <div class="p-div p-divs">
                      <div class="text-div tags-box">
                        <el-tag
                          v-for="(tybqItem,index) in formData.tybqListText"
                          :key="`tybq-${index}`"
                          type="warning"
                          style="margin-right:2px;margin-bottom:2px;"
                        >{{tybqItem}}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';

export default {
  name: 'BizPersonDetail',
  provide() {
    return {
      PersonDetail: this
    };
  },
  inject: ['bizTunnelPerson', 'ZdryTnnnelManage'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      // 行
      row: {}
    };
  },
  computed: {
    // 批次通道下发类型
    batchIssueType() {
      return this.ZdryTnnnelManage.formData.issueType || '00';
    }
  },
  methods: {
    // 初始化执行的方法
    beforeLoadForm() {
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      _this.formData = _this.row;
      _this.handleLoading = false;
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {};
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
