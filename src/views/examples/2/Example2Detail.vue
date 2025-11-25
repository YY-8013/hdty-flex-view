<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <div class="hdty-card">
          <div class="hdty-card-header">
            多行合并
          </div>
          <div class="hdty-card-body">
            <el-row>
              <el-col :span="16">
                <el-row>
                  <el-form-item label="表单项1">
                    {{ formData.vo.item1 }}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="表单项2">
                    {{ formData.vo.item2 }}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="表单项3">
                      {{ formData.vo.item3 }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="表单项4">
                      {{ formData.vo.item4 }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="表单项5">
                    {{ formData.vo.item5 }}
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="0">
                  <hd-image :src="formData.vo.photostr" height="100%"></hd-image>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="表单项6">
                {{ formData.vo.item6 }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="表单项7">
                  {{ formData.vo.item7 }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表单项8">
                  {{ formData.vo.item8 }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="表单项9">
                  {{ formData.vo.item9 }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表单项10">
                  {{ formData.vo.item10 }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="hdty-card">
          <div class="hdty-card-header">
            其他信息
            <a href="javascript:;" class="hdty-card-more">更多</a>
          </div>
          <div class="hdty-card-body">
            <el-row>
              <el-form-item label="表单项11">
                {{ formData.vo.item11 }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="表单项12">
                {{ formData.vo.item12 }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="表单项13">
                  {{ formData.vo.item13 }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表单项14">
                  {{ formData.vo.item14 }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="表单项15">
                {{ formData.vo.item15 }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="表单项16">
                {{ formData.vo.item16 }}
              </el-form-item>
            </el-row>
            <el-form-item label="表单项17">
              {{ formData.vo.item17 }}
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
  import { hdForm } from "@/utils/util-framework";
  import { detail } from './api';
  export default {
    name: "Example2Detail",
    moduleName: "Example2List",
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
        formData: {
          vo: {},
          vox: {}
        },
        // 行
        row: {},
        // 显示
        visible: false
      }
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      },
      // 加载表单
      loadForm() {
        // 参数
        let dataParams = {
          id: this.row.vo.id
        };
        // Lambda写法
        detail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.formData.vo = data.vo;
            this.formData.vox = data.vox;
          }
        }).catch(error => {
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
        this.formData = {
          vo: {},
          vox: {}
        };
      }
    }
  }
</script>

<style scoped>

</style>
