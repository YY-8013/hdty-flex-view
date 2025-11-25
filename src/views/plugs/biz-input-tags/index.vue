<template>
  <div class="passport-tag-input">
    <!-- 已有 tag 列表 -->
    <el-form
      :model="formData"
      :rules="formRules"
      ref="formRef"
      label-width="0"
      @submit.native.prevent
    >
      <el-tag
        v-for="(tag, index) in value"
        :key="index"
        closable
        :type="tagType"
        @close="remove(index)"
        style="cursor: pointer; margin: 5px 5px 0 0"
      >
        {{ tag }}
      </el-tag>

      <!-- 新增 tag 的输入框 -->
      <el-form-item prop="newValue">
        <el-input
          v-model.trim="formData.newValue"
          size="mini"
          class="tag-input-add"
          :maxlength="maxlength"
          :placeholder="`${placeholder}（支持添加多个，输入后按回车、点击追加或点击空白处可添加）`"
          @keyup.enter.native.stop.prevent="addTag"
          @blur="addTag"
        />
        <el-button
          v-if="showZjBtn"
          style="position: absolute; top: 7px; right: 0"
          type="primary"
          @click="addTag"
          >追加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BizInputTags",
  props: {
    /* v-model -> value */
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: "请输入"
    },
    tagType: {
      type: String,
      default: "primary"
    },
    rules: {
      type: Array,
      default: () => []
    },
    maxlength: {
      type: [String, Number],
      dafult: ""
    },
    showZjBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 自定义校验规则 - 检查是否重复
    const validateUnique = (rule, value, callback) => {
      if (value && this.value.includes(value)) {
        callback(new Error("已存在，不能重复添加"));
      } else {
        callback();
      }
    };
    return {
      newValue: "",
      errorMsg: "",
      formData: {
        newValue: ""
      },
      formRules: {
        newValue: [
          ...this.rules, // 保留原有的规则
          { validator: validateUnique, trigger: ["blur"] }
        ]
      }
    };
  },
  methods: {
    emit(list) {
      this.$emit("input", list);
      this.$emit("validate");
    },
    addTag() {
      let _this = this;
      if (!_this.formData.newValue) {
        return;
      }
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          let res = [..._this.value, _this.formData.newValue];
          _this.emit(res);
          _this.$nextTick(() => {
            _this.$refs.formRef.resetFields();
          });
        }
      });
    },
    remove(index) {
      const list = [...this.value];
      list.splice(index, 1);
      this.emit(list);
      this.errorMsg = "";
    }
  }
};
</script>

<style lang="scss" scoped></style>
