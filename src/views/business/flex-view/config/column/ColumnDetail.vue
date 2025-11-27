<template>
  <el-dialog
    title="列配置详情"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="900px"
    @close="handleClose"
  >
    <hd-pane fit v-loading="loading">
      <div class="detail-container">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-document"></i>
            <span>基本信息</span>
          </div>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="12">
              <div class="detail-item">
                <label>列名称:</label>
                <span>{{ detailData.label || "-" }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>数据字段:</label>
                <span>{{ detailData.prop || "-" }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="12">
              <div class="detail-item">
                <label>父节点ID:</label>
                <span>{{ detailData.parentId || "根节点" }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>排序号:</label>
                <span>{{ detailData.sortNum }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="24">
              <div class="detail-item">
                <label>备注:</label>
                <span>{{ detailData.memo || "-" }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 显示配置 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-setting"></i>
            <span>显示配置</span>
          </div>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="8">
              <div class="detail-item">
                <label>列宽:</label>
                <span>{{
                  detailData.columnWidth
                    ? detailData.columnWidth + "px"
                    : "自适应"
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>对齐方式:</label>
                <el-tag
                  v-if="detailData.align"
                  size="small"
                  :type="getAlignType(detailData.align)"
                >
                  {{ getAlignText(detailData.align) }}
                </el-tag>
                <span v-else>-</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>固定列:</label>
                <el-tag v-if="detailData.fixed" size="small" type="warning">
                  {{ detailData.fixed === "left" ? "左侧固定" : "右侧固定" }}
                </el-tag>
                <span v-else>-</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="8">
              <div class="detail-item">
                <label>是否可排序:</label>
                <el-tag
                  size="small"
                  :type="detailData.sortable === 'true' ? 'success' : 'info'"
                >
                  {{ detailData.sortable === "true" ? "是" : "否" }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>默认展开:</label>
                <el-tag
                  size="small"
                  :type="
                    detailData.defaultExpand === 'true' ? 'success' : 'info'
                  "
                >
                  {{ detailData.defaultExpand === "true" ? "是" : "否" }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>关联表单:</label>
                <el-tag v-if="detailData.formName" size="small" type="primary">
                  {{ detailData.formName }}
                </el-tag>
                <span v-else>-</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 列前端配置 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-edit"></i>
            <span>列前端配置 (JSON)</span>
          </div>

          <el-row class="detail-row">
            <el-col :span="24">
              <div class="detail-item">
                <label>列配置JSON:</label>
                <div class="json-display">
                  <pre v-if="detailData.columnConfig">{{
                    formatJSON(detailData.columnConfig)
                  }}</pre>
                  <span v-else class="empty-text">未配置</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 状态信息 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-info"></i>
            <span>状态信息</span>
          </div>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="8">
              <div class="detail-item">
                <label>启用状态:</label>
                <el-tag
                  :type="detailData.status === '1' ? 'success' : 'info'"
                  size="small"
                  effect="dark"
                >
                  {{ detailData.status === "1" ? "启用" : "停用" }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>注销状态:</label>
                <el-tag
                  :type="detailData.zxbs === '0' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ detailData.zxbs === "0" ? "未注销" : "已注销" }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>状态备注:</label>
                <span>{{ detailData.statusRemark || "-" }}</span>
              </div>
            </el-col>
          </el-row>

          <!-- 启用/停用信息 -->
          <template v-if="detailData.status === '1' && detailData.enableTime">
            <el-divider></el-divider>
            <div class="status-info">
              <div class="info-title">
                <el-tag type="success" size="mini">启用信息</el-tag>
              </div>
              <el-row :gutter="20" class="detail-row">
                <el-col :span="8">
                  <div class="detail-item">
                    <label>启用人:</label>
                    <span>{{ detailData.enableUsername || "-" }}</span>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="detail-item">
                    <label>启用时间:</label>
                    <span v-html="formatDatetime(detailData.enableTime)"></span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>

          <template v-if="detailData.status === '0' && detailData.disableTime">
            <el-divider></el-divider>
            <div class="status-info">
              <div class="info-title">
                <el-tag type="info" size="mini">停用信息</el-tag>
              </div>
              <el-row :gutter="20" class="detail-row">
                <el-col :span="8">
                  <div class="detail-item">
                    <label>停用人:</label>
                    <span>{{ detailData.disableUsername || "-" }}</span>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="detail-item">
                    <label>停用时间:</label>
                    <span
                      v-html="formatDatetime(detailData.disableTime)"
                    ></span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>

          <!-- 注销信息 -->
          <template v-if="detailData.zxbs === '1'">
            <el-divider></el-divider>
            <div class="status-info cancel-info">
              <div class="info-title">
                <el-tag type="danger" size="mini">注销信息</el-tag>
              </div>
              <el-row :gutter="20" class="detail-row">
                <el-col :span="8">
                  <div class="detail-item">
                    <label>注销人:</label>
                    <span>{{ detailData.zxrUsername || "-" }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="detail-item">
                    <label>注销机构:</label>
                    <span>{{ detailData.zxdw || "-" }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="detail-item">
                    <label>注销时间:</label>
                    <span v-html="formatDatetime(detailData.zxsj)"></span>
                  </div>
                </el-col>
              </el-row>
              <el-row class="detail-row">
                <el-col :span="24">
                  <div class="detail-item">
                    <label>注销原因:</label>
                    <span>{{ detailData.zxyy || "-" }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>

        <!-- 系统信息 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-time"></i>
            <span>系统信息</span>
          </div>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="12">
              <div class="detail-item">
                <label>创建人:</label>
                <span>{{ detailData.createUsername || "-" }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>创建时间:</label>
                <span v-html="formatDatetime(detailData.createTime)"></span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="detail-row">
            <el-col :span="12">
              <div class="detail-item">
                <label>修改人:</label>
                <span>{{ detailData.updateUsername || "-" }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>修改时间:</label>
                <span v-html="formatDatetime(detailData.updateTime)"></span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </hd-pane>

    <!-- 底部按钮 -->
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getColumnDetail } from "../../api/column";

export default {
  name: "ColumnDetail",
  data() {
    return {
      // 弹窗显示状态
      visible: false,
      // 加载状态
      loading: false,
      // 当前行数据
      row: {},
      // 详情数据
      detailData: {}
    };
  },
  methods: {
    /**
     * 加载表单前的准备工作
     */
    beforeLoadForm() {
      this.loadForm();
    },

    /**
     * 加载详情数据
     */
    loadForm() {
      this.loading = true;

      getColumnDetail(this.row.id)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.detailData = data.vo || {};
          }
        })
        .catch((error) => {
          console.error("加载详情失败:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 关闭弹窗
     */
    handleClose() {
      this.visible = false;
      this.detailData = {};
    },

    /**
     * 获取对齐方式标签类型
     * @param {String} align - 对齐方式
     * @returns {String} 标签类型
     */
    getAlignType(align) {
      const typeMap = {
        left: "primary",
        center: "success",
        right: "warning"
      };
      return typeMap[align] || "";
    },

    /**
     * 获取对齐方式文本
     * @param {String} align - 对齐方式
     * @returns {String} 文本
     */
    getAlignText(align) {
      const textMap = {
        left: "左对齐",
        center: "居中",
        right: "右对齐"
      };
      return textMap[align] || align;
    },

    /**
     * 格式化JSON显示
     * @param {String} json - JSON字符串
     * @returns {String} 格式化后的JSON
     */
    formatJSON(json) {
      try {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return json;
      }
    },

    /**
     * 格式化日期时间
     * @param {String} datetime - 日期时间字符串(YYYYMMDDHHmmss)
     * @returns {String} 格式化后的字符串
     */
    formatDatetime(datetime) {
      if (!datetime) return "-";
      // 格式: 20251126100000 => 2025-11-26 10:00:00
      const str = datetime.toString();
      if (str.length < 14) return datetime;

      const date = str.substring(0, 8);
      const time = str.substring(8, 14);
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(
        6,
        8
      )} ${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(
        4,
        6
      )}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-container {
  /* 详情分组样式 */
  .detail-section {
    margin-bottom: 25px;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 6px;

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #409eff;
      font-size: 16px;
      font-weight: bold;
      color: #303133;

      i {
        margin-right: 10px;
        color: #409eff;
        font-size: 18px;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 详情行样式 */
  .detail-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 详情项样式 */
  .detail-item {
    display: flex;
    align-items: flex-start;
    line-height: 24px;
    font-size: 14px;

    label {
      flex-shrink: 0;
      min-width: 100px;
      font-weight: 600;
      color: #606266;
      margin-right: 10px;

      &::after {
        content: "";
      }
    }

    span {
      flex: 1;
      color: #303133;
      word-break: break-all;
    }
  }

  /* JSON显示样式 */
  .json-display {
    flex: 1;

    pre {
      margin: 0;
      padding: 15px;
      background-color: #f4f4f5;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
      color: #303133;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .empty-text {
      color: #909399;
      font-style: italic;
    }
  }

  /* 状态信息样式 */
  .status-info {
    padding: 15px;
    background-color: #fff;
    border-radius: 4px;
    margin-top: 10px;

    .info-title {
      margin-bottom: 15px;
    }

    &.cancel-info {
      border: 1px solid #f56c6c;
      background-color: #fef0f0;
    }
  }

  /* 分割线样式 */
  ::v-deep .el-divider--horizontal {
    margin: 15px 0;
  }
}
</style>
