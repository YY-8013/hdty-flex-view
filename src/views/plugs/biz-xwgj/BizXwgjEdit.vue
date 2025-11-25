<template>
  <el-dialog
    title="编辑流动轨迹"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
    width="60%"
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <biz-form-card title="流动轨迹信息">
          <biz-form>
            <!-- 流动日期 -->
            <biz-form-row>
              <biz-form-item label="流动日期" :required="true" :span="24">
                <el-form-item prop="petitionDate">
                  <hd-date-picker
                    type="date"
                    v-model="formData.petitionDate"
                    value-format="yyyyMMdd"
                    placeholder="请选择流动日期"
                  ></hd-date-picker>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流出地区 -->
            <biz-form-row>
              <biz-form-item label="流出地区" :required="true" :span="24">
                <el-form-item prop="outRegion">
                  <hd-region
                    v-model="formData.outRegion"
                    :model-text.sync="formData.outRegionText"
                    placeholder="请选择流出地区"
                    @currentChanged="(val, old, data)=>updateRegionAddress( data,'formData','outAddress')"
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流出地址 -->
            <biz-form-row>
              <biz-form-item label="流出地址" :required="true" :span="24" pClass="p-divs">
                <el-form-item prop="outAddress">
                  <el-input v-model="formData.outAddress" placeholder="请输入流出详细地址" maxlength="200"></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流入地区 -->
            <biz-form-row>
              <biz-form-item label="流入地区" :required="true" :span="24">
                <el-form-item prop="inRegion">
                  <hd-region
                    v-model="formData.inRegion"
                    :model-text.sync="formData.inRegionText"
                    placeholder="请选择流入地区"
                    @currentChanged="(val, old, data)=>updateRegionAddress( data,'formData','inAddress')"
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流入地址 -->
            <biz-form-row>
              <biz-form-item label="流入地址" :required="true" :span="24" pClass="p-divs">
                <el-form-item prop="inAddress">
                  <el-input v-model="formData.inAddress" placeholder="请输入流入详细地址" maxlength="200"></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 流动原因 -->
            <biz-form-row>
              <biz-form-item label="流动原因" :required="true" :span="24" pClass="p-divs">
                <el-form-item prop="petitionReason">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.petitionReason"
                    placeholder="请输入流动原因"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <!-- 备注 -->
            <biz-form-row>
              <biz-form-item label="备  注" :required="false" :span="24" pClass="p-divs">
                <el-form-item prop="bz">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="formData.bz"
                    placeholder="请输入备注"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
          </biz-form>
        </biz-form-card>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';

export default {
  name: 'BizXwgjEdit',
  provide() {
    return {
      BizXwgjEdit: this
    };
  },
  inject: ['bizXwgj'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        petitionDate: '', // 流动日期
        outRegion: '', // 流出地区
        outRegionText: '', // 流出地区
        outAddress: '', // 流出地址
        inRegion: '', // 流入地区
        inRegionText: '', // 流入地区
        inAddress: '', // 流入地址
        petitionReason: '', // 流动原因
        bz: '' // 备注
      },
      // 验证
      rules: {
        petitionDate: [
          { required: true, message: '请选择流动日期', trigger: 'change' }
        ],
        outRegion: [
          { required: true, message: '请选择流出地区', trigger: 'change' }
        ],
        outAddress: [
          { required: true, message: '请输入流出地址', trigger: 'blur' }
        ],
        inRegion: [
          { required: true, message: '请选择流入地区', trigger: 'change' }
        ],
        inAddress: [
          { required: true, message: '请输入流入地址', trigger: 'blur' }
        ],
        petitionReason: [
          { required: true, message: '请输入流动原因', trigger: 'blur' }
        ]
      },
      // 行
      row: {},
      index: ''
    };
  },
  methods: {
    // 加载之前
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
      this.formData = JSON.parse(JSON.stringify(this.row));
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          let formDataNew = {
            ..._this.formData,
            index: this.index
          };
          _this.$emit('currentChange', formDataNew);
          _this.cancelForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
