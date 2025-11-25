<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <div class="hdty-card">
        <div class="hdty-card-header">
          基本信息
        </div>
        <div class="hdty-card-body">
          <el-form
            :model="detailData"
            ref="formRef"
            label-width="100px"
            border
            stripe
            @submit.native.prevent
            @keyup.enter.native="cancelForm">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用 户 名" prop="vo.username">
                  {{ detailData.vo.username }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态" prop="vox.enable">
                  {{ detailData.vox.enable }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="真实姓名" prop="vo.xm">
                  {{ detailData.vo.xm }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号" prop="vo.gmsfhm">
                  {{ detailData.vo.gmsfhm }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="vo.telephone">
                  {{ detailData.vo.telephone }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期限" prop="vo.expiredTime">
                  {{ $utilDate.dateFtt(detailData.vo.expiredTime, 'yyyy-MM-dd') }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="管辖机构" prop="vox.orgId">
                  {{ detailData.vox.orgId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行政区划" prop="vox.regionId">
                  {{ detailData.vox.regionId }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="警  号" prop="vo.policeId">
                  {{ detailData.vo.policeId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否边防用户" prop="vox.isBfUser">
                  {{ detailData.vox.isBfUser }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部门" prop="vox.orgSsbm">
                  {{ detailData.vox.orgSsbm }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属警种" prop="vox.jz">
                  {{ detailData.vox.jz }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注 册 人" prop="vox.createUserId">
                  {{ detailData.vox.createUserId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册时间" prop="vo.createTime">
                  {{ $utilDate.dateFtt(detailData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="更 新 人" prop="vox.updateUserId">
                  {{ detailData.vox.updateUserId }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间" prop="vo.updateTime">
                  {{ $utilDate.dateFtt(detailData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="hdty-card">
        <div class="hdty-card-header">
          角色信息
        </div>
        <div class="hdty-card-body">
          <el-table
            :data="detailData.vo.roleList"
            row-key="id"
            border>
            <el-table-column
              fixed
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="角色名"
              sortable
              header-align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="clientTypeList"
              label="客户端"
              sortable
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="其他设置"
              header-align="center"
              align="center"
              width="80">
              <template slot-scope="scope">
                <a
                  v-if="scope.row.cxfwOrgId || scope.row.endDate"
                  href="javascript:;"
                  underline
                  @click="handleSet(scope.$index, scope.row)">
                  <el-tag type="primary">
                    {{ scope.row.cxfwOrgId && scope.row.endDate ? 2 : 1 }}
                  </el-tag>
                </a>
                <el-tag
                  v-else
                  type="primary">
                  0
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="memo"
              label="描述"
              sortable
              header-align="center"
              min-width="180">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
    <user-role-set ref="setRef"></user-role-set>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import UserRoleSet from './UserRoleSet';
  import { getDetail } from '@/api/user';
  export default {
    name: "UserDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    components: {
      UserRoleSet
    },
    data() {
      return {
        // 表单
        detailData: {
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
        getDetail(dataParams).then(response => {
          // 响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.detailData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        })
      },
      // 其他设置
      handleSet(index, row) {
        this.$refs.setRef.visible = true;
        this.$refs.setRef.disabled = true;
        this.$refs.setRef.row = row;
        this.$refs.setRef.beforeLoadForm();
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.detailData = {
          vo: {},
          vox: {}
        };
      }
    }
  }
</script>

<style scoped>

</style>
