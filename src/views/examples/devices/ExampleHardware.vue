<template>
  <div class="hdty-container hdty-scroll">
    <div class="hdty-row hdty-col-space16">
      <div class="hdty-col-md12">
        <div class="hdty-row hdty-col-space16">
          <div class="hdty-col-md3">
            <p class="hdty-label">当前socket连接状态：
              <span
                class="hdty-tag"
                :class="activeConnectClass">
                {{ connect }}
              </span>
            </p>
          </div>
          <div class="hdty-col-md3">
            <p class="hdty-label">当前硬件服务主版本号：
              <span class="hdty-tag hdty-tag-info">
              {{ baseData.svrVersion }}
              </span>
            </p>
          </div>
          <div class="hdty-col-md4">
            <p class="hdty-label">当前操作系统：
              <span
                class="hdty-tag hdty-tag-primary">
                {{ baseData.osName }}
              </span>
            </p>
          </div>
          <div class="hdty-col-md2">
            <p class="hdty-label">当前硬件设备状态：
              <span
                class="hdty-tag"
                :class="deviceState.statuscode===$socket.SOCKET_CODE_SUCCESS?'hdty-tag-success':'hdty-tag-danger'">
                {{ deviceState.statusnote }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="hdty-col-md6">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              调用读卡器
            </div>
          </div>
          <div class="hdty-card-body">
            <el-form
              :model="readFormData"
              ref="formRef"
              label-width="100px"
              border
              stripe>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <el-form-item label="证件号码">
                      {{ readFormData.cardid }}
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="姓  名">
                      {{ readFormData.name }}
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="性  别">
                        {{ readFormData.sexname }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="民  族">
                        {{ readFormData.nationname }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="出  生">
                      {{ $utilDate.dateFtt(readFormData.birthday, 'yyyy年MM月dd日') }}
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8" :offset="0">
                  <el-form-item label-width="0">
                    <hd-image v-model="readFormData.headimage" height="100%"></hd-image>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="住  址">
                {{ readFormData.address }}
              </el-form-item>
              <el-form-item label="签发机关">
                {{ readFormData.visaorgname }}
              </el-form-item>
              <el-form-item label="有效期限">
                {{ $utilDate.dateFtt(readFormData.startvalidity, 'yyyy.MM.dd') }}<span v-if="readFormData.startvalidity">&thinsp;─&thinsp;</span>{{ $utilDate.dateFtt(readFormData.endvalidity, 'yyyy.MM.dd') }}
              </el-form-item>
            </el-form>
          </div>
          <div class="hdty-card-footer">
            <div class="hdty-blockquote">
              智能读卡模式时，只需点击一次操作按钮即可读取不同证件
            </div>
            <el-checkbox
              v-model="readModeChecked"
              @change="handleReaderChange">
              智能读卡模式
            </el-checkbox>
            <hd-dict-select
              v-model="readerTypeSelected.key"
              :model-text.sync="readerTypeSelected.value"
              :dict-code="$global.dictType.deviceType"
              :remove-option="$socket.SOCKET_DEVICE_TYPE_JYHD"
              placeholder="请选择读卡器类型"
              @currentChanged="handleReaderTypeChange">
            </hd-dict-select>
            <el-button
              :loading="readLoading"
              type="primary"
              icon="icon-search"
              @click="handleReader">
              <span v-if="!(readModeChecked && readLoading)">读卡</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="hdty-col-md6">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              调用识别仪
            </div>
          </div>
          <div class="hdty-card-body">
            <el-form
              v-if="$utilStr.isEmpty(identFormData) || identFormData.headimage"
              :model="identFormData"
              ref="formRef"
              label-width="100px"
              border
              stripe>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <el-form-item label="证件号码">
                      {{ identFormData.cardid }}
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="姓  名">
                      {{ identFormData.name }}
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="性  别">
                        {{ identFormData.sexname }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="民  族">
                        {{ identFormData.nationname }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="出  生">
                      {{ $utilDate.dateFtt(identFormData.birthday, 'yyyy年MM月dd日') }}
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8" :offset="0">
                  <el-form-item label-width="0">
                    <hd-image v-model="identFormData.headimage" height="100%"></hd-image>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="住  址">
                {{ identFormData.address }}
              </el-form-item>
              <el-form-item label="签发机关">
                {{ identFormData.visaorgname }}
              </el-form-item>
              <el-form-item label="有效期限">
                {{ $utilDate.dateFtt(identFormData.startvalidity, 'yyyy.MM.dd') }}<span v-if="identFormData.startvalidity">&thinsp;─&thinsp;</span>{{ $utilDate.dateFtt(identFormData.endvalidity, 'yyyy.MM.dd') }}
              </el-form-item>
            </el-form>
            <hd-image
              v-else
              v-model="identFormData.fullimage"
              :height="activeFullImageHeight">
            </hd-image>
          </div>
          <div class="hdty-card-footer">
            <div class="hdty-blockquote">
              设备离线恢复时，点击操作按钮将自动重新连接
            </div>
            <hd-dict-select
              v-model="idTypeSelected.key"
              :model-text.sync="idTypeSelected.value"
              :dict-code="$global.dictType.identIDType"
              placeholder="请选择证件类型">
            </hd-dict-select>
            <el-button
              :loading="identLoading"
              type="primary"
              icon="icon-search"
              @click="handleIdent">
              识别
            </el-button>
            <el-button
              :loading="importLoading"
              type="warning"
              icon="icon-cloud-upload"
              @click="handleImport">
              导入
            </el-button>
            <el-button
              :loading="scanLoading"
              type="success"
              icon="icon-scanning"
              @click="handleScan">
              扫描
            </el-button>
          </div>
        </div>
      </div>
      <div class="hdty-col-md6">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              调用公钥设施
            </div>
          </div>
          <div class="hdty-card-body">
            <el-input v-model="authCode" readonly>
            </el-input>
          </div>
          <div class="hdty-card-footer">
            <div class="hdty-blockquote">
              读数字锁时，如果读取失败将自动读取虚拟锁
            </div>
            <el-button
              :loading="lockLoading"
              type="primary"
              icon="icon-cardreading-o"
              @click="handleLock">
              读数字锁
            </el-button>
            <el-button
              :loading="keyLoading"
              type="warning"
              icon="icon-file"
              @click="handleKey">
              读虚拟锁
            </el-button>
          </div>
        </div>
      </div>
      <div class="hdty-col-md3">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              获取设备信息
            </div>
          </div>
          <div class="hdty-card-body">
            <el-input v-model="deviceInfo.deviceid" readonly>
            </el-input>
          </div>
          <div class="hdty-card-footer" style="height: 144px;">
            <div class="hdty-btn-container">
              <hd-dict-select
                v-model="deviceTypeSelected.key"
                :model-text.sync="deviceTypeSelected.value"
                :dict-code="$global.dictType.deviceType"
                placeholder="请选择设备类型"
                style="width: 120px;">
              </hd-dict-select>
              <el-button
                :loading="upgradeLoading"
                type="success"
                icon="icon-machine"
                @click="handleDevice">
                获取设备编码
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="hdty-col-md3">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              其他功能
            </div>
          </div>
          <div class="hdty-card-body" style="height: 216px;">
            <div class="hdty-btn-container">
              <el-button
                :loading="raLoading"
                type="primary"
                icon="icon-computer"
                @click="handleRa">
                远程协助
              </el-button>
              <el-button
                :loading="upgradeLoading"
                type="warning"
                icon="icon-sync"
                @click="handleUpgrade">
                服务升级
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ExampleHardware",
    data() {
      return {
        // hdSocket实例
        hdSocket: null,
        // 连接状态
        connect: '',
        // 基础数据
        baseData: {},
        // 设备状态
        deviceState: {},
        // 读卡数据
        readFormData: {},
        // 识别数据
        identFormData: {},
        // 设备信息
        deviceInfo: {},
        // 授权码
        authCode: '',
        // 升级程序地址
        upgradeURL: '',
        // 升级程序版本
        upgradeVersion: '',
        // 读卡模式
        readModeChecked: true,
        // 读卡器类型
        readerTypeSelected: {
          key: this.$socket.SOCKET_DEVICE_TYPE_READER,
          value: '通用读卡器'
        },
        // 证件类型
        idTypeSelected: {
          key: this.$socket.SOCKET_ID_TYPE_EDZ,
          value: '二代身份证'
        },
        // 设备类型
        deviceTypeSelected: {
          key: this.$socket.SOCKET_DEVICE_TYPE_READER,
          value: '通用读卡器'
        },
        // 读卡中
        readLoading: false,
        // 识别中
        identLoading: false,
        // 导入中
        importLoading: false,
        // 扫描中
        scanLoading: false,
        // 读数字锁中
        lockLoading: false,
        // 读虚拟锁中
        keyLoading: false,
        // 调用远程协助工具中
        raLoading: false,
        // 服务升级中
        upgradeLoading: false,
        // 获取设备信息中
        deviceLoading: false
      }
    },
    computed: {
      activeConnectClass() {
        if (this.connect === this.$socket.SOCKET_STATE_CONNECTING) {
          return 'hdty-tag-warning';
        } else if (this.connect === this.$socket.SOCKET_STATE_OPEN) {
          return 'hdty-tag-success';
        } else if (this.connect === this.$socket.SOCKET_STATE_LOGIN_SUCCESSFUL) {
          return 'hdty-tag-success';
        } else {
          return 'hdty-tag-warning';
        }
      },
      activeFullImageHeight() {
        let appSize = this.$store.state.app.size;
        if (appSize === 'default') {
          return '288';
        } else if (appSize === 'medium') {
          return '260';
        } else {
          return '232';
        }
      }
    },
    created() {
      // 初始化hdSocket
      this.hdSocket = this.$socket.init(val => {
        this.baseData = val;
      });
      // 监听hdSocket连接
      this.hdSocket.on('connect', val => {
        this.connect = val;
      });
      // 监听hdSocket设备状态
      this.hdSocket.on('devicestate', val => {
        this.deviceState = val.data;
      });
    },
    destroyed () {
      // 停止自动读卡
      if(this.readModeChecked) {
        this.hdSocket.stopidcardloop();
      }
      // 清除识别缓存
      this.hdSocket.clearIdent();
      // 关闭socket
      this.hdSocket.close();
    },
    methods: {
      // 调用读卡
      handleReader() {
        this.readLoading = true;
        this.hdSocket.idcard({
          readerType: this.readerTypeSelected.key,
          readMode: this.readModeChecked
            ? this.$socket.SOCKET_READ_MODE_SERIAL
            : this.$socket.SOCKET_READ_MODE_NORMAL,
          callback: response => {
            let { success, data } = response;
            if(success) {
              this.readFormData = data;
            }
            if(!this.readModeChecked) {
              this.readLoading = false;
            }
          }
        });
      },
      // 切换读卡模式
      handleReaderChange(val) {
        if(!val) {
          // 停止自动读卡
          this.hdSocket.stopidcardloop();
        }
        this.readLoading = false;
      },
      // 切换读卡器类型
      handleReaderTypeChange() {
        if(this.readModeChecked) {
          // 停止自动读卡
          this.hdSocket.stopidcardloop();
        }
        this.readLoading = false;
      },
      // 调用识别
      handleIdent() {
        this.identLoading = true;
        this.hdSocket.ident({
          idType: this.idTypeSelected.key,
          callback: response => {
            let { success, data } = response;
            if(success) {
              this.identFormData = data;
            }
            this.identLoading = false;
          }
        });
      },
      // 导入识别
      handleImport() {
        this.hdSocket.ident({
          identType: this.$socket.SOCKET_IDENT_TYPE_IMPORT,
          idType: this.idTypeSelected.key,
          before: () => {
            this.importLoading = true;
          },
          callback: response => {
            let { success, data } = response;
            if(success) {
              this.identFormData = data;
            }
            this.importLoading = false;
          }
        });
      },
      // 调用扫描
      handleScan() {
        this.scanLoading = true;
        this.hdSocket.scan({
          idType: this.idTypeSelected.key,
          callback: response => {
            let { success, data } = response;
            if(success) {
              this.identFormData = data;
            }
            this.scanLoading = false;
          }
        });
      },
      // 调用数字安全锁
      handleLock() {
        this.lockLoading = true;
        this.hdSocket.lock(response => {
          let { success, data } = response;
          if(success) {
            this.authCode = data.softdogid;
          }
          this.lockLoading = false;
        });
      },
      // 调用虚拟安全锁
      handleKey() {
        this.keyLoading = true;
        this.hdSocket.key(response => {
          let { success, data } = response;
          if(success) {
            this.authCode = data.softdogid;
          }
          this.keyLoading = false;
        });
      },
      // 获取设备信息
      handleDevice() {
        this.deviceLoading = true;
        this.hdSocket.device({
          deviceType: this.deviceTypeSelected.key,
          callback: response => {
            let { success, data } = response;
            if(success) {
              this.deviceInfo = data;
            }
            this.deviceLoading = false;
          }
        });
      },
      // 调用远程协助工具
      handleRa() {
        this.raLoading = true;
        this.hdSocket.ra(response => {
          let { success, msg } = response;
          if(!success) {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error',
              offset: 76
            });
          }
          this.raLoading = false;
        });
      },
      // 调用软件升级程序
      handleUpgrade() {
        this.upgradeLoading = true;
        this.hdSocket.upgrade({
          url: this.upgradeURL,
          version: this.upgradeVersion,
          callback: response => {
            let { success, msg } = response;
            if(!success) {
              this.$message({
                showClose: true,
                message: msg,
                type: 'error',
                offset: 76
              });
            }
            this.upgradeLoading = false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .hdty-label {
    line-height: 28px;
  }
</style>
