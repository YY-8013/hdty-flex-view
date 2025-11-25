<template>
  <el-dialog title="添加" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
        @submit.native.prevent
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-form-item label="输 入 框" prop="input">
            <el-input v-model="formData.input" placeholder="请输入表单项1" maxlength="30" underline></el-input>
          </el-form-item>
          <el-form-item label="文 本 域" prop="textarea">
            <el-input
              type="textarea"
              v-model="formData.textarea"
              :rows="3"
              placeholder="请输入表单项2"
              maxlength="200"
              underline
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="单 选 框" prop="radio">
                <hd-dict-radio
                  v-model="formData.radio"
                  :dict-code="$global.dictType.gender"
                  underline
                ></hd-dict-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="复 选 框" prop="checkbox">
                <hd-dict-checkbox
                  v-model="formData.checkbox"
                  :dict-code="$global.dictType.gender"
                  underline
                ></hd-dict-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="下拉选择" prop="select">
                <hd-dict-select
                  v-model="formData.select"
                  :dict-code="$global.dictType.gender"
                  placeholder="请选择表单项5"
                  filterable
                  underline
                ></hd-dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="级联选择" prop="cascade">
                <hd-dict-cascader
                  v-model="formData.cascade"
                  :dict-code="$global.dictType.msgTopic"
                  placeholder="请选择表单项7"
                  filterable
                  underline
                ></hd-dict-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="级联多选" prop="cascade2">
              <hd-dict-cascader
                v-model="formData.cascade2"
                :dict-code="$global.dictType.msgTopic"
                placeholder="请选择表单项8"
                :checkStrictly="false"
                :strictSelectChilds="true"
                filterable
                multiple
                underline
              ></hd-dict-cascader>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="机  构" prop="organ">
                <hd-organ v-model="formData.organ" placeholder="请选择机构" underline></hd-organ>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地  区" prop="region">
                <hd-region v-model="formData.region" placeholder="请选择地区" underline></hd-region>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表格选择" prop="table">
                <hd-table-select
                  :data="[{
                    id: '00001',
                    name: '模拟数据00001'
                  }]"
                  :api="tableSelectOptions.api"
                  :props="tableSelectOptions.props"
                  :columns="tableSelectOptions.columns"
                  :searches="tableSelectOptions.searches"
                  v-model="formData.table"
                  placeholder="请选择表单项8"
                  underline
                ></hd-table-select>
                <!-- 另一种方式-单独业务单独编写表格选择组件
                <biz-table-select-example
                  v-model="formData.table"
                  placeholder="请选择表单项8"
                  underline>
                </biz-table-select-example>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="坐标拾取" prop="point">
                <hd-map-point
                  v-model="formData.point"
                  drawing-mode="marker"
                  placeholder="请拾取坐标"
                  underline
                ></hd-map-point>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计 数 器" prop="number">
                <hd-input-number
                  v-model="formData.number"
                  :min="1"
                  :max="100"
                  controls-position="right"
                  underline
                ></hd-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量范围" prop="numberRange">
                <hd-number-range
                  v-model="formData.numberRange"
                  :optional-range="[1, 100]"
                  underline
                ></hd-number-range>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年份选择" prop="year">
                <hd-date-picker type="year" v-model="formData.year" placeholder="请选择年份" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年份多选" prop="years">
                <hd-date-picker type="years" v-model="formData.years" placeholder="请选择年份" underline></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="月份选择" prop="month">
                <hd-date-picker type="month" v-model="formData.month" placeholder="请选择月份" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="月份多选" prop="months">
                <hd-date-picker
                  type="months"
                  v-model="formData.months"
                  placeholder="请选择月份"
                  underline
                ></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="周 选 择" prop="week">
                <hd-date-picker type="week" v-model="formData.week" placeholder="请选择周" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="月份范围" prop="monthRange">
                <hd-date-picker type="monthrange" v-model="formData.monthRange" underline></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期选择" prop="date">
                <hd-date-picker type="date" v-model="formData.date" placeholder="请选择日期" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期选择" prop="realDate">
                <hd-date-picker
                  type="date"
                  v-model="formData.realDate"
                  :keep-time="new Date().getTime()"
                  placeholder="请选择日期"
                  underline
                ></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期多选" prop="dates">
                <hd-date-picker type="dates" v-model="formData.dates" placeholder="请选择日期" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期范围" prop="dateRange">
                <hd-date-picker type="daterange" v-model="formData.dateRange" underline></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期时间范围新" prop="dateRangeNew">
                <hd-date-range-picker v-model="formData.dateRangeNew" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期时间范围独立" prop="dateRangeNew2">
                <hd-datetime-range v-model="formData.dateRangeNew2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期时间选择" prop="datetime">
                <hd-date-picker
                  type="datetime"
                  v-model="formData.datetime"
                  placeholder="请选择日期时间"
                  underline
                ></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期时间选择" prop="realDatetime">
                <hd-date-picker
                  type="datetime"
                  v-model="formData.realDatetime"
                  :keep-time="new Date().getTime()"
                  placeholder="请选择日期时间"
                  underline
                ></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时刻选择" prop="moment">
                <hd-date-picker
                  type="moment"
                  v-model="formData.moment"
                  placeholder="请选择时刻"
                  underline
                ></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期时间范围" prop="datetimeRange">
                <hd-date-picker type="datetimerange" v-model="formData.datetimeRange" underline></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间选择" prop="time">
                <hd-date-picker type="time" v-model="formData.time" placeholder="请选择时间" underline></hd-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间范围" prop="timeRange">
                <hd-date-picker type="timerange" v-model="formData.timeRange" underline></hd-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { add, addBefore } from './api';

export default {
  name: 'ExampleAdd',
  moduleName: 'ExampleList',
  components: {},
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      dateRange: [],
      dateTimeRange: [],
      // 表格选择器配置项
      tableSelectOptions: this.hdList.tableSelectOptions,
      // 表单
      formData: {
        input: '',
        textarea: '',
        radio: '',
        checkbox: [],
        select: '',
        cascade: '',
        cascade2: [],
        organ: '',
        region: '',
        table: '',
        point: null,
        number: 1,
        numberRange: [],
        year: '',
        years: [],
        month: '',
        months: [],
        monthRange: [],
        week: [],
        date: '',
        realDate: '',
        dates: [],
        dateRange: [],
        datetime: '',
        realDatetime: '',
        datetimeRange: [],
        dateRangeNew: [],
        dateRangeNew2: [],
        time: '',
        timeRange: [],
        moment: ''
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        input: [{ required: true, message: '请输入表单项1', trigger: 'blur' }],
        textarea: [
          { required: true, message: '请输入表单项2', trigger: 'blur' }
        ],
        radio: [
          { required: true, message: '请选择表单项3', trigger: 'change' }
        ],
        checkbox: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个表单项4',
            trigger: 'change'
          }
        ],
        select: [
          { required: true, message: '请选择表单项5', trigger: 'change' }
        ],
        cascade: [
          { required: true, message: '请选择表单项7', trigger: 'change' }
        ],
        cascade2: [
          { required: true, message: '请选择表单项8', trigger: 'change' }
        ],
        organ: [{ required: true, message: '请选择机构', trigger: 'change' }],
        region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        table: [
          { required: true, message: '请选择表单项9', trigger: 'change' }
        ],
        point: [{ required: true, message: '请拾取坐标', trigger: 'change' }],
        number: [
          { required: true, message: '请选择表单项11', trigger: 'change' }
        ],
        numberRange: [
          { required: true, message: '请选择表单项12', trigger: 'change' }
        ],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        years: [
          { required: true, message: '请至少选择一个年份', trigger: 'change' }
        ],
        month: [{ required: true, message: '请选择月份', trigger: 'change' }],
        months: [
          { required: true, message: '请至少选择一个月份', trigger: 'change' }
        ],
        monthRange: [
          { required: true, message: '请选择月份范围', trigger: 'change' }
        ],
        week: [{ required: true, message: '请选择周', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        dates: [
          { required: true, message: '请至少选择一个日期', trigger: 'change' }
        ],
        dateRange: [
          { required: true, message: '请选择日期范围', trigger: 'change' }
        ],
        datetime: [
          { required: true, message: '请选择日期时间', trigger: 'change' }
        ],
        datetimeRange: [
          { required: true, message: '请选择日期时间范围', trigger: 'change' }
        ],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        timeRange: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ],
        moment: [{ required: true, message: '请选择时刻', trigger: 'change' }]
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 加载表单
      this.loadForm();
    },
    // 加载表单
    loadForm() {
      // 参数
      let dataParams = {};
      // Lambda写法
      addBefore(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 提交
    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.submitting = true;
          // 参数
          let dataParams = {
            ...this.formData
          };
          // Lambda写法
          add(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.resetForm();
                this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
