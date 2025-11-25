<template>
  <el-dialog title="详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-document-copy"></i>
            故意犯罪刑满释放不满五年的人员扩展信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <div class="form-row">
                  <!--案件名称-->
                  <div class="form-item-24 form-item">
                    <label class="label">案件名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.ajmc}}</div>
                    </div>
                  </div>
                  <!--案件类别-->
                  <div class="form-item-24 form-item">
                    <label class="label">案件类别</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.ajlbText}}</div>
                    </div>
                  </div>
                </div>
                <!--简要案情-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">简要案情</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jyaql}}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--释放监狱(看守所)省市县(区)-->
                  <div class="form-item-24 form-item">
                    <label class="label">
                      释放监狱(看守所)
                      <br />省市县(区)
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.sfjySsxqText}}</div>
                    </div>
                  </div>
                  <!--释放监狱(看守所)名称-->
                  <div class="form-item-24 form-item">
                    <label class="label">
                      释放监狱(看守所)
                      <br />名称
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.sfjyMc}}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--入狱(入所)时间-->
                  <div class="form-item-24 form-item">
                    <label class="label">入狱(入所)时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ $utilDate.dateFtt(formData.rysj, 'yyyy-MM-dd') }}</div>
                    </div>
                  </div>
                  <!--释放时间-->
                  <div class="form-item-24 form-item">
                    <label class="label">释放时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ $utilDate.dateFtt(formData.sfsj, 'yyyy-MM-dd') }}</div>
                    </div>
                  </div>
                </div>
                <!--服刑期间改造表现-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      服刑期间
                      <br />改造表现
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.fxqjgzbx}}</div>
                    </div>
                  </div>
                </div>
                <!--回归社会危险性评估意见-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      回归社会危险性
                      <br />评估意见
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.hgshwxxpgyj}}</div>
                    </div>
                  </div>
                </div>
                <!--超过5年是否继续纳管0-否 ,1-是-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      超过5年
                      <br />是否继续纳管
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.cgwnsfjxngPdbsText}}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.lrrxm}}</div>
                    </div>
                  </div>
                  <!--修改人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.xgrxm}}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.lrdwmc}}</div>
                    </div>
                  </div>
                  <!--修改单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.xgdwmc}}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.lrsj, 'yyyy-MM-dd HH:mm:ss') }}</div>
                    </div>
                  </div>
                  <!--修改时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.xgsj, 'yyyy-MM-dd HH:mm:ss') }}</div>
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
  name: 'BizGyfzxmsfbmwnDetail',
  provide() {
    return {
      BizGyfzxmsfbmwnDetail: this
    };
  },
  inject: ['bizgyfzxmsfbmwn'],
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
