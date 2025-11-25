<template>

</template>

<script>
  import { getMqttTopic, handleHistoryMsg, handleMsg } from '@/api/msg';

  export default {
    name: "Notifying",
    data() {
      return {
        // 主题前缀
        topicPrefix: this.$parent.topicPrefix,
        // 本系统+子系统Id
        appIds: [],
        // 订阅主题
        topics: [],
        // MQTT消息体
        message: this.$parent.message,
        // 通知当前系统上线负载
        currentOnlinePayload: {
          appId: '',  // 应用标识
          deviceToken: '',  // 设备号
          hardwareManufacture: '',  // 硬件厂商
          hardwareModel: '',  // 硬件型号
          softwareVersion: '',  // 软件版本
          softwareCoreVersion: '',  // 软件核心组件版本
          tags: '',  // 用户标签
          aliasType: '',  // 用户别名类型
          alias: '',  // 用户别名
          appVersion: '',  // 应用版本号
          fetchOfflineMessageTotal: 0  // 获取离线消息的数量
        },
        // 通知接入系统上线负载
        subOnlinePayload: {
          appId: '',  // 应用标识
          deviceToken: '',  // 设备号
          hardwareManufacture: '',  // 硬件厂商
          hardwareModel: '',  // 硬件型号
          softwareVersion: '',  // 软件版本
          softwareCoreVersion: '',  // 软件核心组件版本
          tags: '',  // 用户标签
          aliasType: '',  // 用户别名类型
          alias: '',  // 用户别名
          appVersion: '',  // 应用版本号
          fetchOfflineMessageTotal: 0  // 获取离线消息的数量
        },
        // 通知消息送达负载
        arrivedPayload: {
          appId: '',  // 应用标识
          messageId: '',  // 消息标识
          deviceToken: '',  // 设备号
          alias: '',  // 用户别名
          aliasType: ''  // 用户别名类型
        },
        // 消息通知提示音设置
        notifyAudioSet: [{
          key: this.$global.dictItem.msgTopic.alarmType,
          value: 'alarm'
        }, {
          key: this.$global.dictItem.msgTopic.applyType,
          value: 'apply'
        }, {
          key: this.$global.dictItem.msgTopic.remindType,
          value: 'remind'
        }, {
          key: this.$global.dictItem.msgTopic.notifyType,
          value: 'notify'
        }]
      }
    },
    computed: {
      activeNotifyEnabled() {
        return !this.$utilStr.isEmpty(this.$store.state.app.notify)
          ? this.$store.state.app.notify
          : this.$app.notifyEnabled;
      },
      activeNotifyBeepEnabled() {
        return !this.$utilStr.isEmpty(this.$store.state.app.beep)
          ? this.$store.state.app.beep
          : this.$app.notifyBeepEnabled;
      }
    },
    mounted() {
      // 动态设置负载
      this.setPayload();
    },
    methods: {
      // 动态设置负载
      setPayload() {
        // 设置当前系统上线通知负载
        this.currentOnlinePayload.appId = this.$utilLogin.getAppId();
        this.currentOnlinePayload.deviceToken = this.$utilLogin.getUserId();
        this.currentOnlinePayload.aliasType = this.$utilLogin.getAppId();
        this.currentOnlinePayload.alias = this.$utilLogin.getUserGmsfhm() + '_' + appEnv.clientTYPE;

        // 设置接入系统上线通知负载
        this.subOnlinePayload.deviceToken = this.$utilLogin.getUserId();
        this.subOnlinePayload.alias = this.$utilLogin.getUserGmsfhm() + '_' + appEnv.clientTYPE;
      },
      // 动态设置消息体
      setMessage(type, msg) {
        let _this = this;
        let payload = {
          ..._this.message
        };
        payload.type = type;
        payload.msg = JSON.stringify(msg);
        return JSON.stringify(payload);
      },
      // 获取用户订阅主题
      getMqttTopic() {
        return getMqttTopic();
      },
      // 处理实时消息
      dealActiveMsg(message) {
        return handleMsg(message);
      },
      // 处理历史消息
      dealHistoryMsg() {
        handleHistoryMsg();
      },
      // 接收消息之前
      async beforeReceiveMessage() {
        let _this = this;
        // 获取用户订阅主题
        await _this.getMqttTopic().then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.topics = data.topics;
            _this.currentOnlinePayload.tags = data.tags;
            _this.subOnlinePayload.tags = data.tags;
            _this.appIds = data.appIds;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
        // 订阅主题
        if(_this.topics && _this.topics.length > 0) {
          _this.topics.forEach(item => {
            _this.$mqtt.subscribe(item);
          });
        }
        // 通知系统上线
        if(_this.appIds && _this.appIds.length > 0) {
          _this.appIds.forEach(appId => {
            _this.subOnlinePayload.appId = appId;
            _this.subOnlinePayload.aliasType = appId;
            _this.$mqtt.publish(
              _this.topicPrefix + appId,
              _this.setMessage(_this.$mqtt.MQTT_MSG_TYPE_ONLINE, _this.subOnlinePayload)
            );
          });
        }
        // 历史消息处理
        _this.dealHistoryMsg();
      },
      // 接收消息
      receiveMessage(message) {
        // 实时消息
        if (message.type === this.$mqtt.MQTT_MSG_TYPE_SEND_MSG) {
          this.triggerActiveData(message);
        }
        // 历史消息
        if(message === 'HistoryMsgDealOk') {
          this.triggerHistoryData();
        }
      },
      // 接收到实时消息
      async triggerActiveData(message) {
        let _this = this;
        // 消息内容
        let msgInfo = JSON.parse(message.msg);
        // 数据源AppId
        let sourceAppId = msgInfo.sourceAppId;
        // 验证是否为本系统数据源AppId
        if(!sourceAppId) {
          return;
        }
        if (sourceAppId) {
          if(_this.$utilLogin.getAppId() !== sourceAppId) {
            let subsystem = _this.appIds.find(appId => appId === sourceAppId);
            if(!subsystem) {
              return;
            }
          }
        }

        // 发送接收通知
        _this.arrivedPayload.messageId = message.id;
        _this.arrivedPayload.appId = msgInfo.appId;
        _this.arrivedPayload.aliasType = msgInfo.appId;
        let topic = _this.topicPrefix + msgInfo.appId;
        _this.$mqtt.publish(
          topic,
          _this.setMessage(_this.$mqtt.MQTT_MSG_TYPE_RECEIVED_MSG, _this.arrivedPayload)
        );

        // 接收消息处理
        await _this.dealActiveMsg(message).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            appMessage.$emit('mqtt-message', {
              type: 'insert',
              data: {
                count: 1,
                ...data
              }
            });
            // 弹出消息提示窗体
            if(_this.activeNotifyEnabled) {
              _this.handleMessageNotify(msgInfo, data);
            }
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 接收到历史消息
      triggerHistoryData() {
        appMessage.$emit('mqtt-message', {
          type: 'reload'
        });
      },
      // 弹出消息提示窗体
      handleMessageNotify(message, data) {
        let audio;
        if (this.activeNotifyBeepEnabled) {
          let msgCategory = message.msgCategory || message.msgType.substr(0, 2);
          let audioSet = this.notifyAudioSet.find(e => e.key === msgCategory);
          if (audioSet) {
            audio = audioSet.value;
          }
        } else {
          audio = '';
        }
        if (message.notifyType === this.$global.dictItem.msgNotifyType.autoClose) {
          this.$notify({
            title: message.title,
            message: message.description,
            audio: audio,
            onclick: () => {
              appMessage.$emit('mqtt-message', {
                type: 'jump',
                data: data.vo
              });
            }
          });
        } else if (message.notifyType === this.$global.dictItem.msgNotifyType.manualClose) {
          this.$notify({
            title: message.title,
            message: message.description,
            timeout: 0,
            audio: audio,
            onclick: () => {
              appMessage.$emit('mqtt-message', {
                type: 'jump',
                data: data.vo
              });
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
