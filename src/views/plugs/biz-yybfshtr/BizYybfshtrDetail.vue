<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit
      v-loading="handleLoading">

      <!--扬言报复社会他人的人员扩展信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            扬言报复社会他人的人员扩展信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--扬言途径-->
                <div class="form-row">
                  <div class="form-item-12 form-item">
                    <label class="label">扬言途径</label>
                    <div class="p-div">
                      <div class="text-div">
                        {{formData.yytjText}}
                      </div>
                    </div>
                  </div>
                  <div class="form-item-12 form-item">
                    <label class="label">管控措施</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.zygkcsdmText}}
                      </div>
                    </div>
                  </div>
                </div>
                <!--扬言报复社会原因-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">扬言报复社会原因</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.yybfshyy }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--具体言行表现-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">具体言行表现</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{formData.yxnr}}
                      </div>
                    </div>
                  </div>
                </div>
                <!--管控措施-->
                <div class="form-row">

                </div>
                <!--是否涉访-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">是否涉访</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sfsfText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--涉访详细情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">涉访详细情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sfxxqk }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--诉求或矛盾纠纷化解情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">诉求或矛盾纠纷化解情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sqhmdjfhjqk }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--管控措施详细情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">管控措施详细情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.gkcsXxqk }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ $utilDate.dateFtt(formData.lrsj, 'yyyy-MM-dd HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                  <!--修改时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ $utilDate.dateFtt(formData.xgsj, 'yyyy-MM-dd HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.lrdwmc }}
                      </div>
                    </div>
                  </div>
                  <!--修改单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.xgdwmc }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.lrrxm }}
                      </div>
                    </div>
                  </div>
                  <!--修改人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.xgrxm }}
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
  import {hdList, hdForm} from '@/utils/util-framework';

  export default {
    name: 'BizYybfshtrDetail',
    provide() {
      return {
        BizYybfshtrDetail: this
      };
    },
    inject: ['bizYybfshtr'],
    mixins: [hdList, hdForm],
    components: {},
    data() {
      return {
        // 显示
        visible: false,
        // 表单
        formData: {},
        // 行
        row: {},
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
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form-row {
    .label {
      width: 150px !important;
    }
  }
</style>
