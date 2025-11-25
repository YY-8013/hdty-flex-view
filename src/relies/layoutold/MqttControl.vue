<template>
  <notifying v-if="mqttNotifyEnabled" ref="notifyRef"></notifying>
</template>

<script>
  import Notifying from "@/mqtt/notify/Notifying";
  export default {
    name: "MqttControl",
    components: {
      Notifying
    },
    data() {
      return {
        // 主题前缀
        topicPrefix: 'AppStatus_',
        // MQTT消息体
        message: {
          id: null,
          type: '',
          msg: '',
          datetime: null,
        },
        // 遗言负载
        willPayload: {
          appId: '',  // 应用标识
          deviceToken: ''  // 设备号
        }
      }
    },
    computed: {
      mqttNotifyEnabled() {
        return this.$app.mqttMessageEnabled && !this.$parent.subpage;
      }
    },
    beforeDestroy() {
      this.$mqtt.disconnect();
    },
    mounted() {
      let _this = this;
      // 动态设置负载
      _this.setPayload();
      // 初始化
      _this.$mqtt.init({
        willMessage: {
          topic: _this.topicPrefix + _this.$utilLogin.getAppId(),
          payload: _this.setMessage(_this.$mqtt.MQTT_MSG_TYPE_WILL, _this.willPayload)
        },
        success: () => {
          // 接收消息之前
          if(this.$refs.notifyRef) this.$refs.notifyRef.beforeReceiveMessage();
        },
        messageArrived: (topic, message) => {
          // 接收消息
          if(this.$refs.notifyRef) this.$refs.notifyRef.receiveMessage(message);
        }
      });
    },
    methods: {
      // 动态设置负载
      setPayload() {
        // 设置遗言负载
        this.willPayload.appId = this.$utilLogin.getAppId();
        this.willPayload.deviceToken = this.$utilLogin.getUserId();
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
      }
    }
  }
</script>

<style scoped>

</style>
