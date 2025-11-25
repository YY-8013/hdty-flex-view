<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit
      v-loading="handleLoading">

      <!--肇事肇祸精神病人扩展信息-->
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            肇事肇祸精神病人扩展信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--确诊精神疾病类型-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">确诊精神疾病类型</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.qzjsjblx }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--确诊医院名称-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">确诊医院名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.qzyyMc }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--确诊医院地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">确诊医院地址</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{formData.qzyyDzmc }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--确诊日期-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">确诊日期</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{$utilDate.dateFtt(formData.qzrq, 'yyyy-MM-dd')}}
                      </div>
                    </div>
                  </div>
                </div>
                <!--卫生管理单位-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">卫生管理单位</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.wsgldw }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--居家监护情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">居家监护情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.jjjhqk }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--是否实行强制医疗-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">是否实行强制医疗</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sfzxqzylPdbsText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--执行强制医疗场所-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">执行强制医疗场所</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.zxqzylcs }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--执行强制医疗时间-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">执行强制医疗时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ $utilDate.dateFtt(formData.zxqzylsj, 'yyyy-MM-dd')}}
                      </div>
                    </div>
                  </div>
                </div>
                <!--解除强制医疗时间-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">解除强制医疗时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ $utilDate.dateFtt(formData.jcqzylsj, 'yyyy-MM-dd') }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--精神障碍危险性评估等级-->
                <!-- <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">精神障碍危险性评估等级</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.jszawxxpgdjdmText }}
                      </div>
                    </div>
                  </div>
                </div> -->
                <!--监护人姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">监护人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.jhrXm }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--监护人身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">监护人身份证号</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.jhrGmsfhm }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--与患者关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">与患者关系</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.yhzgxText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--监护人手机号码-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">监护人手机号码</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.jhrSjhm }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--现实状态-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">现实状态</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.xsztText }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--数据来源库-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">数据来源库</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        {{ formData.sjlykdmText }}
                      </div>
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
  import {hdList, hdForm} from '@/utils/util-framework';

  export default {
    name: 'BizZszhjsbrDetail',
    provide() {
      return {
        BizYybfshtrDetail: this
      };
    },
    inject: ['bizZszhjsbr'],
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
