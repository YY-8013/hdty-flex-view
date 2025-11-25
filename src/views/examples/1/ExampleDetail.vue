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
        label-width="auto"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item label="表单项1">
          {{ formData.vo.item1 }}
          <hd-map-point
            type="button"
            :value="formData.vo.point"
            :model-text="formData.vox.point">
          </hd-map-point>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="表单项2">
              {{ formData.vo.item2 }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="" label="表单项3">
              {{ formData.vo.item3 }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="表单项4">
            {{ formData.vo.item4 }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="表单项5">
              {{ formData.vo.item5 }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单项6">
              {{ formData.vo.item6 }}
            </el-form-item>
          </el-col>
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
    name: "ExampleDetail",
    moduleName: "ExampleList",
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
        let _this = this;
        // 参数
        let dataParams = {
          id: _this.row.vo.id
        };
        // Lambda写法
        detail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });

        // 数据模拟
        let data = {
          vo: {
            item1: '示例',
            item2: '示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例',
            item3: '示例',
            item4: '示例',
            item5: '示例',
            item6: '示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例示例',
            item7: '',
            item8: '',
            item9: '',
            item10: '',
            point: {
              lng: 111.833126,
              lat: 40.860645
            }
          },
          vox: {
            point: '呼和浩特白塔国际机场'
          }
        };
        _this.formData.vo = data.vo;
        _this.formData.vox = data.vox;
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
