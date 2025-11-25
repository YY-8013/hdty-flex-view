<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
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
          <!--人员信息-->
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--人员关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">人员关系</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{ formData.rygxlxText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--人员姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">人员姓名</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{ formData.xm }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">身份证号</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.gmsfhm }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--联系电话-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">联系电话</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.lxdh }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--现住地区-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">现住地区</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.xjzdzSsxqdmText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--现住地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">现住地址</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.xjzdzQhnxxdz }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--备  注-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">备  注</label>
                    <div class="p-div p-divs">
                      <biz-html :value="formData.bz"></biz-html>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">数据来源</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sjlyText }}
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
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizGxrDetail",
  provide() {
    return {
      BizGxrDetail: this
    };
  },
  inject: ["bizGxr"],
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

<style lang="scss" scoped></style>
