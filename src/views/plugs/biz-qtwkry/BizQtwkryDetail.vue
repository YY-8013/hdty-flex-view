<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <!--人员信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            其他稳控人员
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
                    <label class="label">人员类型</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.refTypeText}}</div>
                    </div>
                  </div>
                </div>
                <!--人员姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">人员姓名</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.name}}</div>
                    </div>
                  </div>
                </div>
                <!--身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">身份证号</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.cardId}}</div>
                    </div>
                  </div>
                </div>
                <!--联系电话-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">联系电话</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.phoneNum}}</div>
                    </div>
                  </div>
                </div>
                <!--人员职务-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">人员职务</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.duty}}</div>
                    </div>
                  </div>
                </div>
                <!--备  注-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">备&emsp;&emsp;注</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.memo }}</div>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <!--添加时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">添&ensp;加&ensp;人</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.createUsername }}</div>
                    </div>
                  </div>
                  <!--修改时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">添加时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.createTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--更新时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">更&ensp;新&ensp;人</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.updateUsername }}</div>
                    </div>
                  </div>
                  <!--修改时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">更新时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.updateTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
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
  name: 'BizQtwkryDetail',
  provide() {
    return {
      BizQtwkryDetail: this
    };
  },
  inject: ['bizQtwkry'],
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

<style lang="scss" scoped>
</style>
