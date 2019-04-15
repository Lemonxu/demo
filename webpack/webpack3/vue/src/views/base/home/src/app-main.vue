<template>
  <section class="app-main">
    <!--<transition name="fade" mode="out-in">-->
    <keep-alive>
      <router-view v-if="isKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!isKeepAlive"></router-view>
    <!--</transition>-->
  </section>
</template>
<script>

/*#region 导入函数*/
import {IsMinStatus} from "../../../../utils/utils.js";
import {WebSocketEnumList, WebSocketEnum} from "../../../../modules/enums/web-socket"

/*#endregion*/

export default{
  name: "AppMain",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    // 初始化webSocket
    initWebSocket() {
      try {
        const oauth = sessionStorage.getItem(window.TOKEN_KEY) || localStorage.getItem(window.TOKEN_KEY) || null;
        if (!oauth) {
          this.$router.push({path: "/login"});
          return false;
        }
        this.wsUri = `ws://${window.APP_SETTING_WEB.SERVER_HOST}:${window.APP_SETTING_WEB.SERVER_PORT}/web-socket/myWebSocket?oauth=${oauth}`;
        if ("WebSocket" in window) {
          this.webSocket = new WebSocket(this.wsUri);
          this.webSocket.onopen = this.webSocketOnOpen;

          this.webSocket.onerror = this.webSocketOnError;

          this.webSocket.onmessage = this.webSocketOnMessage;
          this.webSocket.onclose = this.webSocketOnClose;
        } else {
          console.error("该浏览器不支持WebSocket!");
        }
      } catch (e) {
        return false;
      }
    },
    //发送测试消息,避免长时间未响应断开
    testSendMsg() {
      this.clearInterval(this.testSendInterval);
      const _this = this;
      _this.testSendInterval = setInterval(() => {
        if (this.webSocket) {
          this.webSocketSend(new Date().Format("yyyy-MM-dd hh:mm:ss"), this.WebSocketEnum.ONLINE_TEST.type);
        } else {
          this.clearInterval(this.testSendInterval);
        }
      }, _this.testSendTime);
    },
    //连接关闭,然后重新连接
    scrollWebSocketRetry() {
      this.reconnectCount = this.reconnectCount + 1;
      if (this.reconnectCount <= 12) {
        setTimeout(() => {
          this.initWebSocket();
        }, 1000 * 10);
      } else {
        //当超过重试连接次数，退出到登录界面
        this.$router.push({path: "/login"});
      }
    },
    webSocketOnOpen() {
      this.closeFlag = true;
      this.reconnectCount = 0;
      //打开发送测试消息，保持连接
      this.testSendMsg();
      console.log("WebSocket连接成功");
    },
    //错误
    webSocketOnError(e) {
      this.reconnect = true;
      if (this.webSocket) {
        this.webSocket.close();
        this.webSocket = null;
      }
      console.log("WebSocket连接发生错误" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
    },
    //关闭
    webSocketOnClose() {
      this.clearInterval(this.testSendInterval);
      console.log("connection closed " + new Date().Format("yyyy-MM-dd hh:mm:ss"));
      if (this.closeFlag || this.reconnect) {
        //重试连接
        this.scrollWebSocketRetry();
      }
    },
    //数据接收
    webSocketOnMessage(e) {
      const _this = this;
      const redata = JSON.parse(e.data);
      //注意：长连接我们是后台直接1秒推送一条数据，
      //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      let messageType = "info";
      const WebSocketEnumExit = this.WebSocketEnumList.find((element) => element.type === redata.messageType);
      if (WebSocketEnumExit) {
        messageType = WebSocketEnumExit.msgType;
      }
      console.log("webSocketOnMessage:", redata);
      if (["notice", "push", "error", "offline"].includes(redata.messageType)) {
        const urlClick = function(params, status) {
          _this.handleClick(this, params, status);
        };
        this.$store.dispatch("getMenuOperation", redata.url).then(({operation}) => {
          if (operation) {
            this.$notify({
              title: redata.title || "通知",
              dangerouslyUseHTMLString: true,
              message: `<div>${redata.content || redata.msg || ""}</div>
${redata.url ? "<label class=\"message-click\">点击进入</label>" : ""}`,
              duration: 0,
              onClick: urlClick.bind(redata.url, {params: redata.params || null}, true),
              type: messageType,
              position: "bottom-right"
            });
          } else {
            this.$notify({
              title: redata.title || "通知",
              dangerouslyUseHTMLString: true,
              message: `<div>${redata.content || redata.msg || ""}</div>`,
              duration: 0,
              onClick: urlClick.bind(redata.url, {params: redata.params || null}, false),
              type: messageType,
              position: "bottom-right"
            });
          }
        });
        //判断浏览器是不是最小化
        if (IsMinStatus()) {
          this.isSupportNotify(redata.url, redata, {params: redata.params || null});
        }
      }
      //当通知类型为强制下线类型时,关闭重试
      if (redata.messageType && redata.messageType === this.WebSocketEnum.OFFLINE.type) {
        //关闭,关闭重试连接
        this.closeFlag = false;
        this.reconnect = false;
      }
      return true;
    },
    handleClick(url, params, status) {
      if (status) {
        this.$router.push({path: url, params: {...params || ""}});
      }
    },
    sendMag(sendText) {
      this.webSocketSend(sendText, this.WebSocketEnum.ONLINE.type);
      this.sendText = "";
    },
    //数据发送
    webSocketSend(sendText, messageType) {
      if (sendText) {
        const params = {content: sendText, messageType: messageType};
        this.webSocket.send(JSON.stringify(params));
      }
    },
    //关闭
    webSocketClose() {
      this.closeFlag = false;
      this.reconnect = false;
      if (this.webSocket) {
        this.webSocket.close();
        this.webSocket = null;
      }
      // 路由跳转时结束websocket链接
      /*this.$router.afterEach(function () {
        this.webSocket.close();
      });*/
    },
    clearInterval(_obj) {
      if (_obj) {
        clearTimeout(_obj);
      }
    },
    getMsgType(messageType) {
      if (messageType) {
        for (const item in this.WebSocketEnum) {
          if (item) {
            const temp = this.WebSocketEnum[item];
            if (temp.type === messageType) {
              return temp.msgType;
            }
          }
        }
      }
      return "error";
    },
    //浏览器是否支持显示通知   需要注意的是 只有 HTTPS 协议才能浏览器才能通过通知的功能，否则浏览器是强制关闭改功能的
    isSupportNotify(url, data, params) {
      if (window.Notification) {
        // 支持
        // console.log("支持"+"Web Notifications API");
        this.isAllowNotify(url, data, params);
      } else {
        // 不支持
        console.log("不支持Web Notifications API");
      }
    },
    //通知功能 有骚扰用户的嫌疑，让用户根据自己喜好选择是否开启通知权限
    isAllowNotify: function(url, data, params) {
      const _this = this;
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
          if (status === "granted") {
            _this.setNotification(url, data, params);
          } else {
            const n = new Notification("拒绝通知就看不到系统消息了哦！如要接受请在设置中选择允许接收通知。");
          }

        });
      }
    },
    //编辑通知内容并加上各个点击事件等  后期控制点击通知跳转到文章
    setNotification: function(url, data, params) {
      const path = `http://${window.APP_SETTING_WEB.SERVER_HOST}:${window.APP_SETTING_WEB.SERVER_PORT}/xtp/#/${url}/`;
      const notify = new Notification(data.title || "通知", {
        body: data.content || data.msg || "",
        lang: "zh-CN",
        icon: path
      });
      notify.onshow = function() {
        console.log("Notification showning!");
      };
      notify.onclick = function() {
        window.focus();
        console.log("Notification have be click!");
      };
      notify.onerror = function() {
        console.log("error!");
        // 手动关闭
        notify.close();
      };
      notify.onclose = function() {
        console.log("close");
      };
    }

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  beforeDestroy() {
    this.webSocketClose();
    this.clearInterval(this.testSendInterval);
    console.log(this.closeFlag, this.reconnect);
  },
  created() {
    this.enableWebSocket = window.WEBSOCKET ? window.WEBSOCKET.ENABLE : true;
    if (this.enableWebSocket) {
      this.$notify.closeAll();
      this.wsUri = `ws://${window.APP_SETTING_WEB.SERVER_HOST}:${window.APP_SETTING_WEB.SERVER_PORT}/web-socket/myWebSocket?oauth=${localStorage.getItem(window.TOKEN_KEY) || sessionStorage.getItem(window.TOKEN_KEY) || null}`;
      this.initWebSocket();
    }
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    isKeepAlive() {
      const route = this.$store.state.tagsView.cachedViews.find((cachedItem) => cachedItem === this.$route.name);
      return !!route;
    }
  },
  data() {
    return {
      webSocket: null,
      wsUri: "",
      sendText: "",
      oauth: "",
      closeFlag: true,
      reconnect: true,
      testSendInterval: null,
      testSendTime: 1000 * 60 * 10,
      reconnectCount: 0,
      WebSocketEnum: WebSocketEnum,
      WebSocketEnumList: WebSocketEnumList,
      enableWebSocket: window.WEBSOCKET ? window.WEBSOCKET.ENABLE : true
    }
  }

  /*#endregion */

}
</script>
<style scoped></style>
