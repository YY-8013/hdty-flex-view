<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="fromData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @keyup.enter.native="cancelForm">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.systemName" label="系统名称">
              {{ fromData.vo.systemName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.id" label="系统编号">
              {{ fromData.vo.id }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.systemAppid" label="系统AppId">
              {{ fromData.vo.systemAppid }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.systemAppid" label="使用AppId过滤" label-width="120px">
              {{ fromData.vox.isAppIdFilterData }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.systemServerAddress" label="访问地址">
              {{ fromData.vo.systemServerAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.systemApiAddress" label="系统Api地址">
              {{ fromData.vo.systemApiAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="vox.enableUrlRouters" label="是否地址路由">
            {{ fromData.vox.enableUrlRouters }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.companyName" label="所属企业">
              {{ fromData.vo.companyName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.dutyPerson" label="负 责 人">
              {{ fromData.vo.dutyPerson }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.dutyPhone" label="联系电话">
              {{ fromData.vo.dutyPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.createUsername" label="添 加 人">
              {{ fromData.vo.createUsername }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="添加时间">
              {{ fromData.vo.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="vo.memo" label="备  注">
              {{ fromData.vo.memo }}
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
  import { detail } from '@/api/joinsys-manage';
  export default {
    name: "JoinSysManageDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    data() {
      return {
        // 表单
        fromData: {
          vo: {},
          vox: {}
        },
        // 表单扩展
        extendData: {},
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
          //响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.fromData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        })
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.$nextTick(() => {
          this.$refs.formRef.resetFields();
        });
      }
    }
  }
</script>

<style scoped>

</style>
