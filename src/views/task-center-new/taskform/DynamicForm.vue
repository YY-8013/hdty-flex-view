<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
      <div
        class="con-dynamic-from"
        v-for="(item, index) in ParentPage.rwFormItemConfigList"
        :key="index"
      >
        <div v-if="showPropAndOr(item, index)">
          <div
            slot="header"
            class="dynamic-from-title clearfix"
            v-if="item.type === 'title'"
          >
            <span class="base">
              <i v-if="!item.hideIcon" class="el-icon-document"></i>
              <div class="form-title">{{ dynamicLabel(item) }}</div>
            </span>
          </div>
          <div
            :class="[
              'dynamic-form-item',
              `label-position-${item.position || 'top'}`
            ]"
            v-else
          >
            <label
              class="label"
              v-if="item.type !== 'tip' && item.type !== 'linkButton'"
            >
              <span
                :class="
                  !(item.disabled || isForbid) && item.rules.required
                    ? 'required'
                    : ''
                "
                >{{ dynamicLabel(item) }}</span
              >

              <div
                v-if="
                  item.hasTitleButton &&
                  item.titleButtonContent &&
                  !(item.disabled || isForbid)
                "
                class="label-right-button"
              >
                <el-button
                  :type="item.buttonType"
                  size="mini"
                  @click="handleTitleButton(item)"
                  >{{ item.titleButtonContent }}</el-button
                >
              </div>
            </label>
            <!--输入框-->
            <div class="p-div p-divs" v-if="item.type === 'input'">
              <div class="text-div text-div-fill">
                <el-form-item :prop="item.prop" :rules="propRules(item)">
                  <el-input
                    v-model="formData[item.prop]"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxlength"
                    :disabled="item.disabled || isForbid"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <!--输入框-->
            <div class="p-div p-divs" v-if="item.type === 'number'">
              <div class="text-div text-div-fill">
                <el-form-item :prop="item.prop" :rules="propRules(item)">
                  <el-input-number
                    v-model="formData[item.prop]"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxlength"
                    :precision="item.precision"
                    :min="item.min"
                    :disabled="item.disabled || isForbid"
                    style="width: 260px"
                  ></el-input-number>
                </el-form-item>
              </div>
            </div>
            <!--文本框-->
            <div class="p-div p-divs" v-if="item.type === 'textarea'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 20 }"
                    v-model="formData[item.prop]"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxlength"
                    :disabled="item.disabled || isForbid"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <!--单选框-->
            <div class="p-div p-divs" v-if="item.type === 'radio'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <hd-dict-radio
                    v-model="formData[item.prop]"
                    :dictCode="item.typeId"
                    :disabled="item.disabled || isForbid"
                    type="button"
                    :removeOption="getDictItemRemoveOption(item)"
                  ></hd-dict-radio>
                </el-form-item>
              </div>
            </div>
            <!--多选框-->
            <div class="p-div p-divs" v-if="item.type === 'checkbox'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <hd-dict-checkbox
                    v-model="formData[item.prop]"
                    :dict-code="item.typeId"
                    :disabled="item.disabled || isForbid"
                    :show-all-button="item.showAll"
                    :removeOption="getDictItemRemoveOption(item)"
                  ></hd-dict-checkbox>
                </el-form-item>
              </div>
            </div>
            <!--下拉框-->
            <div class="p-div p-divs" v-if="item.type === 'select'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <span v-if="item.disabled || isForbid">{{
                    formData[item.prop + "Text"]
                  }}</span>
                  <hd-dict-select
                    v-else
                    v-model="formData[item.prop]"
                    :model-text.sync="formData[item.prop + 'Text']"
                    :placeholder="item.placeholder"
                    :parentId="item.parentId"
                    :dictCode="item.typeId"
                    :multiple="item.multiple"
                    :disabled="item.disabled || isForbid"
                    :removeOption="getDictItemRemoveOption(item)"
                  ></hd-dict-select>
                </el-form-item>
              </div>
            </div>
            <!--级联选择框-->
            <div class="p-div p-divs" v-if="item.type === 'selectTree'">
              <div
                v-if="
                  item.prop &&
                  (item.prop.startsWith('hdArray') ||
                    $utilStr.parseBoolean(item.multiple)) &&
                  (item.disabled || isForbid)
                "
                class="prop-content"
                style="padding: 4px 0"
              >
                <el-tag
                  v-for="(itemTag, index) in formData[item.prop + 'Text']"
                  style="margin-right: 3px"
                  type="danger"
                  effect="plain"
                  size="mini"
                  :key="`${item.prop}-${index}`"
                  >{{ itemTag }}</el-tag
                >
              </div>
              <div v-else class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required || false,
                      message: item.rules.requiredMsg || '',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <hd-dict-cascader
                    v-model="formData[item.prop]"
                    :model-text.sync="formData[item.prop + 'Text']"
                    :multiple="
                      item.prop &&
                      (item.prop.startsWith('hdArray') ||
                        $utilStr.parseBoolean(item.multiple))
                    "
                    :dictCode="item.typeId"
                    :placeholder="item.placeholder"
                    :removeOption="getDictItemRemoveOption(item)"
                    :disabled="item.disabled || isForbid"
                    bigCascaderPane7
                  ></hd-dict-cascader>
                </el-form-item>
              </div>
            </div>
            <!--日期选择框-->
            <div class="p-div p-divs" v-if="item.type === 'date'">
              <div class="text-div text-div-fill">
                <el-form-item :prop="item.prop" :rules="datePropRules(item)">
                  <el-date-picker
                    :type="item.type"
                    v-model="formData[item.prop]"
                    value-format="yyyyMMdd"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled || isForbid"
                    :picker-options="getPickerOptions(item)"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <!--日期时间选择框-->
            <div class="p-div p-divs" v-if="item.type === 'datetime'">
              <div class="text-div text-div-fill">
                <el-form-item :prop="item.prop" :rules="datePropRules(item)">
                  <el-date-picker
                    :type="item.type"
                    v-model="formData[item.prop]"
                    value-format="yyyyMMddHHmmss"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled || isForbid"
                    :picker-options="getPickerOptions(item)"
                    :default-time="item.defaultTime"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <!--图片附件-->
            <div class="p-div p-divs" v-if="item.type === 'file'">
              <!--上传-->
              <div class="text-div text-div-fill" v-if="!isForbid">
                <el-form-item :prop="item.prop" :rules="propRules(item)">
                  <biz-upload-url
                    v-model="formData[item.prop]"
                    :oldFileList.sync="formData[`${item.prop}FileList`]"
                    :action="baseURL + '/web/rwNtask/fileUpload'"
                    :disabled="item.disabled || isForbid"
                  ></biz-upload-url>
                </el-form-item>
              </div>
              <!--查看-->
              <div class="text-div text-div-fill" v-else>
                <div
                  v-if="formData && formData[item.prop]"
                  style="display: flex; flex-wrap: wrap"
                >
                  <div
                    style="
                      width: 160px;
                      height: 160px;
                      padding: 8px;
                      display: flex;
                    "
                    v-for="(fileItem, index) in formData[item.prop] || []"
                    :key="index"
                  >
                    <viewer
                      style="
                        width: 100%;
                        height: 100%;
                        border: solid 1px #cfd6e4;
                        border-radius: 3px;
                      "
                    >
                      <img
                        :src="fileItem.fileUrl"
                        style="
                          object-fit: contain;
                          width: 100%;
                          height: 100%;
                          cursor: pointer;
                        "
                      />
                    </viewer>
                  </div>
                </div>
              </div>
            </div>

            <!--所有类型附件-->
            <div class="p-div p-divs" v-if="item.type === 'allFile'">
              <!--上传-->
              <div class="text-div text-div-fill" v-if="!isForbid">
                <el-form-item :prop="item.prop" :rules="propRules(item)">
                  <biz-file-upload
                    v-model="formData[item.prop]"
                    :uploadApi="fileApi.upload"
                    :detailApi="fileApi.detail"
                    :disabled="item.disabled || isForbid"
                    value-type="obj"
                  ></biz-file-upload>
                </el-form-item>
              </div>
              <!--附件详情-->
              <div class="text-div text-div-fill" v-else>
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <biz-file-list
                    :fileList="formData[item.prop] || []"
                  ></biz-file-list>
                </el-form-item>
              </div>
            </div>
            <!-- 按钮-->
            <div class="p-div p-divs" v-if="item.type === 'linkButton'">
              <div class="text-div text-div-fill">
                <el-button
                  :type="
                    item.buttonType === 'error' ? 'danger' : item.buttonType
                  "
                  size="mini"
                  :icon="item.buttonIcon"
                  :class="item.buttonClass"
                  :disabled="linkButtonDisabled(item)"
                  @click="handleBtnClick(item)"
                  >{{ item.buttonLabel }}</el-button
                >
              </div>
            </div>

            <!-- 责任区民警选择 -->
            <div class="p-div p-divs" v-if="item.type === 'customSelect'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <biz-form-zrqmj-select
                    v-if="item.webSelectType === 'zdrymj'"
                    v-model="formData[item.prop]"
                    width="100%"
                    :currentText="formData[item.prop]"
                    :disabled="item.disabled || isForbid"
                    :queryOrgId="
                      $utilPublic.getUserInfo().orgId.substring(0, 8) + '0000'
                    "
                    :title="item.placeholder"
                    :underline="false"
                    :placeholder="item.placeholder"
                    @currentChanged="updateZrqmjInfo($event, item)"
                  ></biz-form-zrqmj-select>
                  <biz-form-zrqmj-select-sq
                    v-if="item.webSelectType === 'sqmj'"
                    v-model="formData[item.prop]"
                    width="100%"
                    :currentText="formData[item.prop]"
                    :disabled="item.disabled || isForbid"
                    :queryOrgId="
                      $utilPublic.getUserInfo().orgId.substring(0, 8) + '0000'
                    "
                    :title="item.placeholder"
                    :underline="false"
                    :placeholder="item.placeholder"
                    @currentChanged="updateZrqmjInfoSq($event, item)"
                  ></biz-form-zrqmj-select-sq>
                  <biz-form-zrld-select
                    v-if="item.webSelectType === 'zrld'"
                    :disabled="item.disabled || isForbid"
                    v-model="formData[item.prop]"
                    :title="item.placeholder"
                    width="100%"
                    :underline="false"
                    :currentText="formData[item.prop]"
                    :placeholder="item.placeholder"
                    @currentChanged="updateZrqmjInfoSq($event, item)"
                  ></biz-form-zrld-select>
                  <biz-form-ybss-jlxxq-select
                    v-if="item.webSelectType === 'bzdzxq'"
                    :disabled="item.disabled || isForbid"
                    v-model="formData[item.prop]"
                    :placeholder="item.placeholder"
                    :model-text.sync="formData[`${item.prop}Text`]"
                    style="width:100%'"
                  ></biz-form-ybss-jlxxq-select>

                  <biz-bzdz-new
                    v-if="item.webSelectType === 'bzdz'"
                    :disabled="item.disabled || isForbid"
                    v-model="formData[item.prop]"
                    :model-text.sync="
                      formData[item.propText] || formData[`${item.prop}Text`]
                    "
                    :ywName="item[item.ywName]"
                    :isYw="item[item.isYw]"
                    @handleGlbzdz="(info) => handleGlbzdz(info, item)"
                  ></biz-bzdz-new>
                </el-form-item>
              </div>
            </div>

            <!-- 地区选择 -->
            <div class="p-div p-divs" v-if="item.type === 'region'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <hd-region
                    v-model="formData[item.prop]"
                    width="100%"
                    :disabled="item.disabled || isForbid"
                    :placeholder="item.placeholder"
                    :model-text.sync="formData[`${item.prop}Text`]"
                    @currentChanged="
                      (currentKey, oldValue, multipleData) =>
                        updateRegion(currentKey, oldValue, multipleData, item)
                    "
                  ></hd-region>
                </el-form-item>
              </div>
            </div>

            <!-- 机构选择 -->
            <div class="p-div p-divs" v-if="item.type === 'organ'">
              <div class="text-div text-div-fill">
                <el-form-item
                  :prop="item.prop"
                  :rules="[
                    {
                      required: item.rules.required,
                      message: item.rules.requiredMsg,
                      trigger: 'change'
                    }
                  ]"
                >
                  <hd-organ
                    v-model="formData[item.prop]"
                    width="100%"
                    :disabled="item.disabled || isForbid"
                    :checkLevel="item.checkLevel || []"
                    :filterCode="organFilterCode(item)"
                    :showLevel="item.showLevel || ''"
                    :placeholder="item.placeholder"
                    :model-text.sync="formData[`${item.prop}Text`]"
                  ></hd-organ>
                </el-form-item>
              </div>
            </div>

            <!--比对照片组件-->
            <div v-if="item.type === 'bdPhoto'" class="con-compare-img">
              <div v-for="(val, valIndex) in item.listProp" :key="valIndex">
                <div class="con-img" v-if="val.type === 'image'">
                  <hd-image
                    :src="baseURL + '/web' + formData[item.prop][0][val.prop]"
                    :large="
                      val.propText
                        ? baseURL +
                          '/web' +
                          formData[item.prop][0][val.propText]
                        : null
                    "
                    width="100%"
                    height="95%"
                  ></hd-image>
                  <div>{{ val.label }}</div>
                </div>
                <div class="con-score" v-if="val.type === 'bfb'">
                  <div class="con-circle">
                    <img class="circle-img" src="./images/circle-back.png" />
                    <img
                      class="circle-img"
                      src="./images/circle-0.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-0.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-10.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-10.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-20.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-20.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-30.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-30.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-40.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-40.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-50.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-50.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-60.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-60.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-70.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-70.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-80.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-80.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-90.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-90.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-93.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-93.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-95.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-95.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-98.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-98.png'
                      "
                    />
                    <img
                      class="circle-img"
                      src="./images/circle-100.png"
                      v-show="
                        getScoreCircle(formData[item.prop][0][val.prop]) ===
                        'circle-100.png'
                      "
                      alt
                    />
                    <div class="circle-text">
                      <div class="text">相似度</div>
                      <div class="score">
                        {{ formData[item.prop][0][val.prop] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示类 -->
            <div
              v-if="item.type === 'tip'"
              :style="
                'padding: 5px 20px;border-bottom:1px solid #cfd6e4;font-weight: bolder;font-size: 17px;color:' +
                item.color
              "
            >
              <el-form-item
                :prop="item.prop"
                :rules="[
                  {
                    required: item.rules.required,
                    message: '请根据提示操作，前往列表操作【移交】',
                    trigger: 'change'
                  }
                ]"
              >
                <span style="font-size: 17px">{{ item.content }}</span>
              </el-form-item>
            </div>
            <!-- 动态表格 -->
            <div class="p-div p-divs" v-if="item.type === 'tableList'">
              <div class="text-div text-div-fill">
                <el-table
                  v-if="item.disabled || isForbid"
                  class="new-table"
                  :data="formData[item.prop] || []"
                  ref="tableDetailRef"
                  border
                  :span-method="
                    ({ row, column, rowIndex, columnIndex }) =>
                      objectSpanMethod({
                        row,
                        column,
                        rowIndex,
                        columnIndex,
                        info: item
                      })
                  "
                >
                  <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    row-key="id"
                    :index="setIndex"
                    align="center"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    v-for="tablePropItem in tableListProps(item.tableProps)"
                    :key="tablePropItem.prop"
                    :prop="tablePropItem.prop"
                    :label="tablePropItem.label"
                    :min-width="tablePropItem.colWidth || 160"
                    header-align="center"
                    :align="tablePropItem.align || 'left'"
                  >
                    <template slot-scope="scope">
                      <div v-if="tablePropItem.type === 'date'">
                        {{
                          $utilDate.dateFtt(
                            scope.row[tablePropItem.prop],
                            "yyyy-MM-dd"
                          )
                        }}
                      </div>
                      <div v-else-if="tablePropItem.type === 'datetime'">
                        {{
                          $utilDate.dateFtt(
                            scope.row[tablePropItem.prop],
                            "yyyy-MM-dd HH:mm:ss"
                          )
                        }}
                      </div>
                      <div v-else-if="tablePropItem.type === 'button'">
                        <el-button
                          :type="tablePropItem.buttonType"
                          @click="
                            handleTableListButton(
                              scope.$index,
                              item,
                              tablePropItem
                            )
                          "
                          >{{ tablePropItem.buttonText }}</el-button
                        >
                      </div>
                      <div v-else>
                        {{
                          scope.row[`${tablePropItem.prop}Text`] ||
                          scope.row[tablePropItem.prop]
                        }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  v-else
                  class="new-table"
                  :data="formData[item.prop]"
                  row-key="id"
                  ref="tableRef"
                  border
                >
                  <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    :index="setIndex"
                    align="center"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    v-for="tablePropItem in tableListProps(item.tableProps)"
                    :key="tablePropItem.prop"
                    :prop="tablePropItem.prop"
                    :label="tablePropItem.label"
                    :min-width="tablePropItem.colWidth || 160"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`${item.prop}.${scope.$index}.${tablePropItem.prop}`"
                        :rules="propRules(tablePropItem, item.prop)"
                      >
                        <div
                          v-if="['text'].includes(tablePropItem.type)"
                          class="table-text"
                        >
                          {{
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          }}
                        </div>
                        <el-input
                          v-if="['input'].includes(tablePropItem.type)"
                          v-model="
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          "
                          :placeholder="tablePropItem.placeholder"
                        ></el-input>

                        <el-input
                          v-if="['textarea'].includes(tablePropItem.type)"
                          v-model="
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          "
                          :placeholder="tablePropItem.placeholder"
                          type="textarea"
                          :autosize="{ minRows: 1, maxRows: 20 }"
                          :maxlength="tablePropItem.maxlength"
                        ></el-input>

                        <!--下拉选择框-->
                        <hd-dict-select
                          style="width: 100%"
                          v-if="tablePropItem.type === 'select'"
                          :disabled="tablePropItem.disabled"
                          v-model="
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          "
                          :model-text.sync="
                            formData[item.prop][scope.$index][
                              `${tablePropItem.prop}Text`
                            ]
                          "
                          :dict-code="tablePropItem.typeId"
                          filterable
                          :placeholder="tablePropItem.placeholder"
                        ></hd-dict-select>

                        <!--日期-->
                        <hd-date-picker
                          type="date"
                          v-if="tablePropItem.type === 'date'"
                          :disabled="tablePropItem.disabled"
                          :placeholder="tablePropItem.placeholder"
                          v-model="
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          "
                          value-format="yyyyMMdd"
                        ></hd-date-picker>

                        <hd-date-picker
                          type="datetime"
                          v-if="tablePropItem.type === 'datetime'"
                          :disabled="tablePropItem.disabled"
                          :placeholder="tablePropItem.placeholder"
                          v-model="
                            formData[item.prop][scope.$index][
                              tablePropItem.prop
                            ]
                          "
                          value-format="yyyyMMddHHmmss"
                        ></hd-date-picker>
                        <!--人员-->
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="
                      formData[item.prop] &&
                      formData[item.prop].length > Number(item.rowLength)
                    "
                    label="操作"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <hd-button
                        type="danger"
                        @click="handleDeleteRow(scope.$index, scope.row, item)"
                        >删除</hd-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="!(item.disabled || isForbid) && !item.manualDisabled"
                  class="con-empty-task-table"
                >
                  <a href="javascript:;" @click="handleAddRow(item)">
                    <i class="el-icon-circle-plus-outline"></i>
                    <span style="margin-left: 8px">点击此处添加数据</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <biz-btn-diag
      ref="diagRef"
      @currentChanged="setLinkButtonResult"
    ></biz-btn-diag>
    <!-- 督导检查详情 -->
    <!-- <ddjc-detail ref="ddjcDetailRef" /> -->
  </div>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import { uploadFile, fileDetail } from "./api";

import yw from "./yw.js";
export default {
  name: "DynamicForm",
  provide() {
    return {
      DynamicForm: this
    };
  },
  inject: ["ParentPage"],
  mixins: [hdForm, hdList, yw],
  components: {
    // DdjcDetail: () =>
    //   import("@/views/business/actualunit/ddjc/DdjcDetail.vue").then(
    //     (c) => c.default
    //   ),
  },
  props: {
    prop: String,
    // 是否禁用
    isForbid: {
      type: Boolean,
      default: true
    },
    // 是否详情
    isDetail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileApi: {
        upload: uploadFile,
        detail: fileDetail
      },
      isPreview: false,
      isBj: false,
      // 表单
      formData: {},
      // 验证
      rules: {},
      // 基础地址
      baseURL: appEnv.baseURL,
      // 按钮对象
      btnItem: null,
      // 任务row
      taskRow: null,
      // 时间配置
      datePickerConfig: {
        afterToday: {
          disabledDate: (date) => {
            const now = new Date();
            return date.getTime() > now.getTime();
          }
        }
      }
    };
  },
  mounted() {},
  methods: {
    // tableList 动态表格添加数据
    handleAddRow(propInfo) {
      let _this = this;
      let tableItem = {
        id: _this.$utilStr.uuid(32)
      };
      propInfo.tableProps.forEach((propItem) => {
        _this.$set(tableItem, propItem.prop, "");
      });
      _this.formData[propInfo.prop].push(tableItem);
    },
    handleDeleteRow(index, row, propInfo) {
      let _this = this;
      _this.formData[propInfo.prop].splice(index, 1);
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    // 动态根据其他字段判断是否显示
    showProp(propInfo) {
      if (propInfo && propInfo.isShow === "0") {
        return false;
      }
      if (propInfo && propInfo.vIf && propInfo.vIf.length > 0) {
        // 遍历vIf动态判断数组，动态判断是否显示字段,只要有1个不满足，就返回false
        let isShow = propInfo.vIf.every((vIfItem) => {
          if (typeof this.formData[vIfItem.label] === "string") {
            return vIfItem.value.includes(this.formData[vIfItem.label]);
          } else if (Array.isArray(this.formData[vIfItem.label])) {
            return this.checkArrays(
              this.formData[vIfItem.label],
              vIfItem.value
            );
          } else {
            // 处理属性值为null的情况
            return false;
          }
        });
        return isShow;
      }
      return true;
    },
    checkArrays(a, b) {
      // 如果b的长度为0，返回true
      if (b.length === 0) {
        return true;
      }
      // 如果b的长度大于0，检查a中是否包含b中的任意一个元素
      for (let i = 0; i < b.length; i++) {
        if (a.includes(b[i])) {
          return true;
        }
      }
      // 如果a中没有包含b中的任何一个元素，返回false
      return false;
    },

    // 动态根据其他字段判断是否显示  与和或 所有逻辑关系都兼容
    showPropAndOr(propInfo, index) {
      if (this.isPreview) {
        // 预览状态，展示除isShow等于0的字段
        return propInfo.isShow !== "0";
      }
      // isShow为 0，  直接隐藏 : 该字段一般用于传唯一标识，页面不展示，提交时候要传
      if (propInfo && propInfo.isShow === "0") {
        if (propInfo.vIf) {
          let fIsShow = this.evaluateCondition(propInfo.vIf);
          this.$set(
            this.ParentPage.rwFormItemConfigList[index],
            "isSubmit",
            fIsShow
          );
        } else {
          this.$set(
            this.ParentPage.rwFormItemConfigList[index],
            "isSubmit",
            true
          );
        }

        return false;
      }

      // 添加了动态判断规则，进行判断
      if (propInfo && propInfo.vIf && propInfo.vIf.logic) {
        let isShow = this.evaluateCondition(propInfo.vIf);
        this.$set(
          this.ParentPage.rwFormItemConfigList[index],
          "isSubmit",
          isShow
        );
        return isShow;
      }
      this.$set(this.ParentPage.rwFormItemConfigList[index], "isSubmit", true);
      return true;
    },
    // 递归调用
    evaluateCondition(data) {
      // 如果data是null则返回true , 说明没有判断条件
      if (!data) {
        return true;
      }
      const { logic, vIfList, vIfObj } = data;

      // 处理异常数据， 无效判断，仍返回true
      if (!logic || !["single", "&&", "||"].includes(logic)) {
        return true;
      }

      if (logic === "single") {
        // 处理vIfObj为null的情况
        if (!vIfObj) {
          return true; // 如果vIfObj为空，返回false，无效判断
        }
        const { prop, value, logicType } = vIfObj;
        // 未设置相关判断属性，无效判断
        if (!prop) {
          return true;
        }
        const formValue = this.formData[prop];

        if (typeof formValue === "string") {
          // 如果获取回来的值是字符串，那判断value是否存在
          return value.includes(formValue);
        } else if (Array.isArray(formValue)) {
          return this.checkArray(formValue, value, logicType);
        } else {
          return false; // 处理属性值为null的情况
        }
      }

      // 处理vIfList为null或空数组的情况
      if (!vIfList || vIfList.length === 0) {
        return true; // 如果vIfList为空，返回true，无效判断
      }

      if (logic === "&&") {
        // 所有子条件必须都为true
        return vIfList.every((subCondition) =>
          this.evaluateCondition(subCondition)
        );
      } else if (logic === "||") {
        // 任一子条件为true即可
        return vIfList.some((subCondition) =>
          this.evaluateCondition(subCondition)
        );
      }
      // 默认返回false，处理其他未定义的情况
      return false;
    },
    checkArray(a, b, logicType) {
      if (!logicType || logicType === "||") {
        if (b.length === 0) {
          return true;
        }
        for (let i = 0; i < b.length; i++) {
          if (a.includes(b[i])) {
            return true;
          }
        }
        return false;
      } else if (logicType === "&&") {
        for (let i = 0; i < b.length; i++) {
          if (!a.includes(b[i])) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    // 表单项校验规则
    propRules(propInfo, parentProp) {
      let _this = this;
      let rules = [
        {
          required: propInfo.rules ? propInfo.rules.required : false,
          message: propInfo.rules ? propInfo.rules.requiredMsg : "",
          trigger:
            propInfo.rules && propInfo.rules.trigger
              ? propInfo.rules.trigger
              : ["file", "allFile"].includes(propInfo.type)
              ? "change"
              : "blur"
        }
      ];
      // 如果存在自定义校验项，添加到校验规则当中，目前自定义校验有3种：姓名、身份证号码、联系方式、多个联系方式用逗号隔开
      if (propInfo.rules && propInfo.rules.custom) {
        // 自定义校验规则,如果是validateIdcard的话,则替换为validateIdcardRw
        let customValidator = propInfo.rules.custom;
        if (customValidator === "validateIdcard") {
          customValidator = `validateIdcardRw`;
        }
        let rule = {
          validator: this.$utilValidate[customValidator],
          message: propInfo.rules.customMsg,
          trigger: "blur"
        };
        rules.push(rule);
      }
      if (propInfo.rules && propInfo.rules.fileRule) {
        let fileRule = {
          validator: this.$utilValidate[propInfo.rules.fileRule](
            propInfo.rules.minCount,
            propInfo.rules.fileRuleMsg
          ),
          trigger: "change"
        };

        rules.push(fileRule);
      }
      // 添加唯一性校验规则
      if (propInfo.isUnique) {
        let uniqueRule = {
          validator: (rule, value, callback) => {
            const isUnique = _this.isUnique(value, propInfo, parentProp);
            if (!isUnique) {
              callback(new Error(`${propInfo.label}不能重复`));
            } else {
              callback();
            }
          },
          trigger: "blur"
        };
        rules.push(uniqueRule);
      }
      return rules;
    },
    datePropRules(propInfo) {
      let _this = this;
      let rules = [
        {
          required: propInfo.rules ? propInfo.rules.required : false,
          message: propInfo.rules ? propInfo.rules.requiredMsg : "",
          trigger:
            propInfo.rules && propInfo.rules.trigger
              ? propInfo.rules.trigger
              : "blur"
        }
      ];
      // 添加时间校验方法
      if (propInfo.rules.startTimeCompareField) {
        // 校验结束时间是否大于开始时间
        rules.push({
          validator: (rule, value, callback) => {
            const isValid = _this.isStartTimeCompareField(
              value,
              propInfo.rules.startTimeCompareField
            );
            if (!isValid) {
              callback(new Error(`结束时间必须大于开始时间`));
            } else {
              callback();
            }
          },
          trigger: "change"
        });
      }
      return rules;
    },
    isStartTimeCompareField(value, startTimeField) {
      let startTimeValue = this.formData[startTimeField];
      if (value && startTimeValue) {
        return value >= startTimeValue;
      }
      return true;
    },
    // 唯一性校验
    isUnique(value, propInfo, parentProp) {
      const allValues = this.formData[parentProp].map(
        (row) => row[propInfo.prop]
      );
      const occurrences = allValues.filter((v) => v === value).length;
      return occurrences <= 1;
    },
    // 动态根据字符串解析多层次对象属性值
    getNestedValue(obj, field) {
      const keys = field.split(".");
      return keys.reduce((acc, key) => acc && acc[key], obj);
    },
    // 地区、地址级联更新
    updateRegion(currentKey, oldValue, multipleData, item) {
      // 判断是否配置了地区关联地址的字段
      if (item.syncAddressField) {
        this.$set(
          this.formData,
          item.syncAddressField,
          multipleData ? multipleData.nameAll : ""
        );
      }
    },
    // 同步关注人员责任区民警信息
    updateZrqmjInfo(row, info) {
      //  动态根据配置同步字段
      if (info && info.result) {
        for (let key in info.result) {
          if (info.result.hasOwnProperty(key)) {
            this.$set(
              this.formData,
              key,
              this.getNestedValue(row, info.result[key])
            );
          }
        }
      }
    },
    // 同步社区责任区民警信息
    updateZrqmjInfoSq(row, info) {
      if (info && info.result) {
        for (let key in info.result) {
          if (info.result.hasOwnProperty(key)) {
            this.$set(
              this.formData,
              key,
              this.getNestedValue(row, info.result[key])
            );
          }
        }
      }
    },
    handleBtnClick(item) {
      this.btnItem = item;
      if (item && item.customFn && this[item.customFn]) {
        let wybsKey = item.wybsKey || "wybs";
        let wybs = this.formData[wybsKey];
        this[item.customFn](wybs);
        return;
      }
      if (item && item.menuUrl === "/pages/real-unit/check/unit-check") {
        this.$refs.sydwhcRef.visible = true;
        this.$refs.sydwhcRef.isDetail = this.isDetail;
        this.$refs.sydwhcRef.row.vo.id = this.formData[item.params.taskYwbm];
        this.$refs.sydwhcRef.isTaskCenter = true;
        this.$refs.sydwhcRef.taskForm = item;
        this.$refs.sydwhcRef.beforeLoadForm();
      } else if (
        this.isDetail &&
        item &&
        item.menuUrl === "/pages/real-person/task-check"
      ) {
        let routeData = this.$router.resolve({
          path: "/ybss/person/detail",
          query: {
            gmsfhm: this.$crypto.base64(this.formData[item.params.taskYwbm]),
            id: this.$crypto.base64(this.formData[item.params.rybm])
          }
        });
        window.open(routeData.href, "_blank");
      } else {
        this.$refs.diagRef.visible = true;
        this.$refs.diagRef.title = item.buttonLabel;
        if (this.taskRow && this.taskRow.vo) {
          item.taskId = this.taskRow.vo[item.params.taskUserRecodeId];
        }
        if (this.formData[item.params.taskYwbm]) {
          this.$set(
            this.formData,
            "taskYwbm",
            this.formData[item.params.taskYwbm]
          );
        }
        // 添加是否默认展示子系统的详情页
        this.$refs.diagRef.row = item;
        this.$refs.diagRef.isDetail = this.isDetail;
        this.$refs.diagRef.formData = this.formData;
        this.$refs.diagRef.handleParams();
      }
    },
    // tableList列表按钮点击 - 详情
    handleTableListButton(index, propInfo, tablePropItem) {
      if (
        propInfo &&
        tablePropItem &&
        tablePropItem.customFn &&
        this[tablePropItem.customFn]
      ) {
        let wybsKey = tablePropItem.wybsKey || "wybs";
        let wybs = this.formData[propInfo.prop][index][wybsKey];
        this[tablePropItem.customFn](wybs);
        return;
      }
    },
    setLinkButtonResult(item) {
      if (item.row && item.row.result) {
        for (let name in item.row.result) {
          this.$set(this.formData, name, item.data[item.row.result[name]]);
        }
      } else {
        if (this.btnItem && this.btnItem.result) {
          for (let name in this.btnItem.result) {
            this.$set(this.formData, name, item[this.btnItem.result[name]]);
          }
        }
      }
    },
    // 分数比例图片
    getScoreCircle(score) {
      score = score.replace("%");
      let res = "circle-0.png";
      if (score) {
        if ("0" < score && score <= "10") {
          res = "circle-10.png";
        } else if ("10" < score && score <= "20") {
          res = "circle-20.png";
        } else if ("20" < score && score <= "30") {
          res = "circle-30.png";
        } else if ("30" < score && score <= "40") {
          res = "circle-40.png";
        } else if ("40" < score && score <= "50") {
          res = "circle-50.png";
        } else if ("50" < score && score <= "60") {
          res = "circle-60.png";
        } else if ("60" < score && score <= "70") {
          res = "circle-70.png";
        } else if ("70" < score && score <= "80") {
          res = "circle-80.png";
        } else if ("80" < score && score <= "90") {
          res = "circle-90.png";
        } else if ("90" < score && score <= "93") {
          res = "circle-93.png";
        } else if ("93" < score && score <= "95") {
          res = "circle-95.png";
        } else if ("95" < score && score <= "98") {
          res = "circle-98.png";
        } else if ("98" < score) {
          res = "circle-100.png";
        }
        if (score === "0" || score === "0.0" || score === "0.00") {
          res = "circle-0.png";
        }
      }
      return res;
    },
    // 获取字典组件的移除项
    getDictItemRemoveOption(info) {
      let excludeKeys = [];
      // 如果排除项是需要特殊处理的，比如说关注人员
      if (
        info.excludeConfig &&
        info.excludeConfig.excludeEnabled &&
        info.excludeConfig.excludeFn
      ) {
        excludeKeys = this[info.excludeConfig.excludeFn](info);
        return excludeKeys;
      }
      if (info.excludeKeys) {
        excludeKeys = info.excludeKeys || [];
      }

      return excludeKeys;
    },
    // 动态判断关注人员类型对应的现状标签（特定标签）
    // 获取当前人员类型需要排除的特定标签
    getZdrylxTdbq(info) {
      let rylx = this.formData[info.excludeConfig.relateKey];
      return this.$utilZdry.getRyxzRemoveOptions(rylx);
    },
    // 获取当前时间选择器配置
    getPickerOptions(item) {
      let options = {};
      if (item.timePickerConfig && item.timePickerConfig.disabledDate) {
        // 禁用今天之后的日期
        return this.datePickerConfig[item.timePickerConfig.disabledDate];
      }
      return options;
    },
    // 链接按钮的禁用状态
    linkButtonDisabled(item) {
      if (!this.isDetail) return this.isForbid;
      return !item.detailShow;
    },
    // 动态设置organ机构选择组件的属性
    organFilterCode(item) {
      // 如果是fj,默认获取当前用户的分局以上
      let res = item.filterCode || "";
      if (item.filterCode === "st") {
        res = this.$utilPublic.getUserOrgId().substr(0, 2) + "0000000000";
      } else if (item.filterCode === "sj") {
        res = this.$utilPublic.getUserOrgId().substr(0, 4) + "00000000";
      } else if (item.filterCode === "fj") {
        res = this.$utilPublic.getUserOrgId().substr(0, 6) + "000000";
      } else if (item.filterCode === "pcs") {
        res = this.$utilPublic.getUserOrgId().substr(0, 8) + "0000";
      } else if (item.filterCode === "zrq") {
        res = this.$utilPublic.getUserOrgId().substr(0, 10) + "00";
      }
      return res;
    },
    // 标准地址字段同步
    handleGlbzdz(jzwinfo, itemInfo) {
      let {
        dzbm,
        jzwlx,
        jzwbm,
        label,
        ssjlxxqDzbm,
        bdLat,
        bdLon,
        gpsLat,
        gpsLon
      } = jzwinfo;
      let dzInfo = {
        Dzbm: dzbm, //地址编码
        Qhnxxdz: label, //地址翻译

        Ssjlxdzbm: ssjlxxqDzbm, // 所属街路巷地址编码
        Ssjzwdzbm: jzwbm, // 所属建筑物地址编码
        Jzwlx: jzwlx, // 建筑物类型

        PointBdLat: bdLat,
        PointBdLon: bdLon,
        PointGpsLat: gpsLat,
        PointGpsLon: gpsLon
      };

      let preField = itemInfo.preField || "";

      for (const key in dzInfo) {
        this.$set(this.formData, `${preField}${key}`, dzInfo[key]);
      }
    },
    // 动态设置label
    dynamicLabel(info) {
      if (
        info &&
        info.labelDynamic &&
        info.labelDynamic.relateProp &&
        this.formData[info.labelDynamic.relateProp]
      ) {
        let v = this.formData[info.labelDynamic.relateProp];
        let o = info.labelDynamic.valueMap.find((e) => e.value === v);
        if (o) {
          return o.label;
        }
      }
      return info.label;
    },
    tableListProps(tableProps) {
      return tableProps.filter((item) => item.isShow !== "0");
    },
    // tableList合并 // 动态合并单元格方法
    objectSpanMethod({ row, column, rowIndex, columnIndex, info }) {
      // 跳过序号列（第一列）
      if (columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 1
        };
      }

      // 获取当前列的配置（columnIndex - 1 是因为有索引列）
      const tableProps = this.tableListProps(info.tableProps);
      const columnConfig = tableProps[columnIndex - 1];

      // 如果该列配置了需要合并
      if (columnConfig && columnConfig.merge) {
        const currentValue = row[column.property];
        const data = this.formData[info.prop] || [];

        // 如果是第一行或者与前一行值不同，则计算合并的行数
        if (
          rowIndex === 0 ||
          currentValue !== data[rowIndex - 1][column.property]
        ) {
          let spanCount = 1;

          // 计算相同值的连续行数
          for (let i = rowIndex + 1; i < data.length; i++) {
            if (data[i][column.property] === currentValue) {
              spanCount++;
            } else {
              break;
            }
          }

          // 返回合并的行数和列数
          if (spanCount > 1) {
            return {
              rowspan: spanCount,
              colspan: 1
            };
          }
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          // 如果与前一行值相同，则隐藏当前单元格
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }

      // 默认不合并
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.dynamic-from-title {
  &.clearfix {
    background-color: #e7f3fd;
  }
}
.dynamic-form-item {
  .label {
    width: 150px !important;
  }
  &.label-position-top {
    display: flex;
    flex-direction: column;
    .label {
      width: 100% !important;
      text-align: left !important;
      justify-content: flex-start !important;
      padding: 8px 16px !important;
      // font-weight: bold;
      line-height: 1.5 !important;
      letter-spacing: 1px;
    }
  }
}
.con-empty-task-table {
  color: #878d99;
  border-bottom: 1px solid #cfd6e4;
  border-left: 1px solid #cfd6e4;
  border-right: 1px solid #cfd6e4;
  height: 40px;
  a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    &:hover {
      color: #409eff;
    }
  }
}
.con-compare-img {
  display: flex;
  justify-content: center;
  height: 300px;
  margin: 20px 0;
  //padding: 20px;
  //width: 500px;
  div {
    //width: 190px;
    height: 300px;
    .con-img {
      width: 250px;
      border: solid 2px #1194fc;
      border-radius: 8px;
      padding: 12px;
      div {
        width: 100%;
        text-align: center;
      }
    }

    .con-score {
      width: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &:before {
        content: "";
        width: 100%;
        height: 2px;
        background-color: #1194fc;
        position: absolute;
        left: 0;
        top: 149px;
      }

      .con-circle {
        position: relative;
        width: 190px;
        height: 190px;
        border: solid 2px #1194fc;
        border-radius: 190px;
        z-index: 10;
        background-color: #f5f6f6;
        display: flex;
        align-items: center;
        justify-content: center;

        .circle-img {
          width: 150px;
          height: 150px;
          position: absolute;
          left: 18px;
          top: 18px;
        }

        .circle-text {
          text-align: center;
          color: #005ea6;
          font-weight: bold;
          margin-top: 140%;
          .text {
            font-size: 17px;
            margin-bottom: 5px;
            margin-top: -5px;
            height: auto;
          }

          .score {
            font-size: 26px;
            height: auto;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.viewer-container {
  z-index: 9999999 !important;
}
.el-radio-button {
  margin-bottom: 3px;
}

.table-text {
  line-height: 1.2 !important;
}
</style>
<style lang="scss" scoped>
// 变量定义（根据页面主色调调整）
$primary-color: #2e9fdf; // 主色调（示例蓝色，需替换为页面实际主色）
$primary-dark: #258acd; // 主色加深（hover状态）
$secondary-color: #f0f0f0; // 次要按钮背景色
$secondary-text: #333333; // 次要按钮文字色
$border-light: #dddddd; // 边框色
$shadow-base: 0 4px 8px rgba($primary-color, 0.2); // 基础阴影
$shadow-hover: 0 6px 12px rgba(0, 0, 0, 0.1); // 悬停阴影

// 基础按钮混合宏（复用逻辑）
@mixin btn-base {
  min-width: 180px; // 最小宽度，确保按钮足够大
  height: 40px; // 固定高度，提升视觉占比
  padding: 0 16px; // 左右内边距，扩展点击区域
  font-size: 15px; // 字体放大，增强可读性
  font-weight: 600; // 加粗文字，突出按钮层级
  border-radius: 8px; // 圆角设计，优化视觉柔和度
  border: none;
  cursor: pointer;
  transition: all 0.3s ease; // 统一过渡动画
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.buttonBig {
  @include btn-base; // 引入基础样式
  background-color: $primary-color;
  color: white;
  box-shadow: $shadow-base;

  &:hover {
    background-color: $primary-dark; // 主色加深，反馈明确
    transform: translateY(-2px); // 轻微上浮，增强交互感
    box-shadow: $shadow-hover;
  }

  &:active {
    transform: translateY(0); // 点击复位，模拟按压效果
  }
}

.btn-staff {
  @include btn-base; // 引入基础样式
  background-color: $secondary-color;
  color: $secondary-text;
  border: 1px solid $border-light; // 边框区分次要按钮

  &:hover {
    background-color: darken($secondary-color, 5%); // 背景色加深5%
    transform: translateY(-2px);
    box-shadow: $shadow-hover;
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
