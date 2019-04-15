
//websocket的通知类型枚举
const WebSocketEnum = {
	ONLINE: {code: 1, type: "online", remark: "上线", msgType: "warning"},
	NOTICE: {code: 2, type: "notice", remark: "通知", msgType: "info"},
	PUSH: {code: 3, type: "push", remark: "推送", msgType: "success"},
	ONLINE_TEST: {code: 4, type: "onlineTest", remark: "上线测试", msgType: "warning"},
	NOT_TYPE: {code: -10, type: "notType", remark: "不存在的类型", msgType: "error"},
	ERROR_TYPE: {code: -404, type: "error", remark: "错误", msgType: "error"},
	OFFLINE: {code: -2, type: "offline", remark: "强制下线", msgType: "warning"}
};

const WebSocketEnumList = [
	{code: 1, type: "online", remark: "上线", msgType: "warning"},
	{code: 2, type: "notice", remark: "通知", msgType: "info"},
	{code: 3, type: "push", remark: "推送", msgType: "success"},
	{code: 4, type: "onlineTest", remark: "上线测试", msgType: "warning"},
	{code: -10, type: "notType", remark: "不存在的类型", msgType: "error"},
	{code: -404, type: "error", remark: "错误", msgType: "error"},
	{code: -2, type: "offline", remark: "强制下线", msgType: "warning"}
];

export {
	WebSocketEnum,
	WebSocketEnumList
}
