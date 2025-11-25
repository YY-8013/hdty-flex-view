/**
 * mqtt插件
 */

import MQTT from "mqtt";
import $utilStr from "@/utils/util-str";

const mqtt = {};
// 保持活跃时长
const keepAlive = 50;
// 重新连接间隔
const reconnect = appEnv.mqttCONNECT.mqttReconnectTime || 2 * 1000;
console.log("mqtt重新连接间隔", reconnect);

// 连接超时
const timeout = 60 * 1000;

let client = null;
let successCallback = null;
let messageArrivedCallback = null;

// 消息类型
mqtt.MQTT_MSG_TYPE_WILL = "-1";
mqtt.MQTT_MSG_TYPE_OFFLINE = "0";
mqtt.MQTT_MSG_TYPE_ONLINE = "1";
mqtt.MQTT_MSG_TYPE_ALIAS_SET = "2";
mqtt.MQTT_MSG_TYPE_ALIAS_REMOVE = "3";
mqtt.MQTT_MSG_TYPE_TAG_ADD = "6";
mqtt.MQTT_MSG_TYPE_TAG_SET = "7";
mqtt.MQTT_MSG_TYPE_TAG_REMOVE = "8";
mqtt.MQTT_MSG_TYPE_SEND_MSG = "9";
mqtt.MQTT_MSG_TYPE_RECEIVED_MSG = "10";
mqtt.MQTT_MSG_TYPE_CLICKED_MSG = "11";

// 初始化插件
mqtt.init = ({ success, messageArrived, ...args }) => {
  successCallback = success;
  messageArrivedCallback = messageArrived;
  init(args);
};

// 订阅主题
mqtt.subscribe = (topic, options) => {
  subscribe(topic, options);
};

// 发送消息
mqtt.publish = (topic, msg, options) => {
  publish(topic, msg, options);
};

// 断开连接
mqtt.disconnect = (force, options, cd) => {
  disconnect(force, options, cd);
};

const init = options => {
  const defaultProps = {
    qos: 1,
    retain: true
  };
  if (options.willMessage)
    options.willMessage = { ...defaultProps, ...options.willMessage };
  // 实例化mqtt
  client = MQTT.connect(appEnv.mqttCONNECT.url, {
    username: appEnv.mqttCONNECT.username,
    password: appEnv.mqttCONNECT.password,
    keepalive: keepAlive,
    reconnectPeriod: reconnect,
    connectTimeout: timeout,
    will: options.willMessage
  });
  // 监听mqtt连接成功
  client.on("connect", connect);
  // 监听mqtt消息
  client.on("message", getMessage);
  // 监听mqtt错误信息
  client.on("error", error);
  // 监听mqtt关闭
  client.on("close", close);
};

const connect = e => {
  console.log("mqtt连接成功");
  successCallback(e);
};

const getMessage = (topic, message, packet) => {
  packet.payload = $utilStr.uint8ArrayToJson(packet.payload);
  messageArrivedCallback(topic, $utilStr.uint8ArrayToJson(message), packet);
};

const error = error => {
  console.error("mqtt连接出错：" + error);
};

const close = () => {
  console.log("mqtt已经关闭");
};

const subscribe = (topic, options) => {
  const defaultProps = {
    qos: 1
  };
  options = {
    ...defaultProps,
    ...options
  };
  client.subscribe(topic, options, err => {
    if (err) {
      console.error("mqtt订阅失败，订阅主题：" + topic, err.message);
    }
  });
};

const publish = (topic, msg, options) => {
  const defaultProps = {
    qos: 1,
    retain: true
  };
  options = {
    ...defaultProps,
    ...options
  };
  client.publish(topic, msg, options, err => {
    if (err) {
      console.log("mqtt发布失败，发布主题：" + topic, err.message);
    }
  });
};

const disconnect = (force, options, cd) => {
  client.end(force, options, cd);
};

export default mqtt;
