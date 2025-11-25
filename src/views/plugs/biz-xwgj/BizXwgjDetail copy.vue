<template>
  <el-dialog title="详情" :visible.sync="visible" custom-class=" new-form" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-user-solid"></i>
            流动轨迹信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!-- 流动人员 -->
                <biz-form-row>
                  <biz-form-item label="人员姓名" :required="false" :span="12">
                    <span>{{ formData.vo.gzryXm }}</span>
                  </biz-form-item>
                  <biz-form-item label="身份证号" :required="false" :span="12">
                    <span>{{ formData.vo.gzrySfzhm}}</span>
                  </biz-form-item>
                </biz-form-row>
                <!--流动类型-->
                <div class="form-row">
                  <div class="form-item-12 form-item">
                    <label class="label">流动类型</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.vox.ldType }}</div>
                    </div>
                  </div>
                  <div class="form-item-12 form-item">
                    <label class="label">审批状态</label>
                    <div class="p-div p-divs">
                      <div class="text-div">
                        <span
                          v-if="formData.vo.spzt  === '0'"
                          class="text-color-1"
                        >{{formData.vox.spzt}}</span>
                        <span
                          v-if="formData.vo.spzt  === '1'"
                          class="text-color-6"
                        >{{formData.vox.spzt}}</span>
                        <span
                          v-if="formData.vo.spzt  === '2'"
                          class="text-color-4"
                        >{{formData.vox.spzt}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!--流动时间-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流动时间</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.vox.ldsj }}</div>
                    </div>
                  </div>
                </div>
                <!--详细地址-->
                <!-- <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流出地区</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vox.lcdq }}</div>
                    </div>
                  </div>
                </div>-->
                <!--详细地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流出地址</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vo.lcdz }}</div>
                    </div>
                  </div>
                </div>
                <!--详细地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流出地机构</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vox.lcdOrgId }}</div>
                    </div>
                  </div>
                </div>
                <!--详细地址-->
                <!-- <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流入地区</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vox.lrdq }}</div>
                    </div>
                  </div>
                </div>-->
                <!--详细地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流入地址</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vo.lrdz }}</div>
                    </div>
                  </div>
                </div>
                <!--详细地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流入地机构</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vox.lrdOrgId }}</div>
                    </div>
                  </div>
                </div>
                <!--流动原因-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">流动原因</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vo.ldyy }}</div>
                    </div>
                  </div>
                </div>

                <!--备  注-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">备&emsp;&emsp;注</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.vo.memo }}</div>
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
import { detail } from './api';

export default {
  name: 'BizXwgjDetail',
  provide() {
    return {
      BizXwgjDetail: this
    };
  },
  inject: ['bizXwgj'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: { vo: {}, vox: {} },
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
      this.formData = { vo: {}, vox: {} };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
