import { Message } from "element-ui";

//判断浏览器是否最小化
const IsMinStatus = () => {
	let isMin = false;
	if (window.outerWidth) {
		isMin = window.outerWidth <= 160 && window.outerHeight <= 30;
	} else {
		isMin = window.screenTop < -30000 && window.screenLeft < -30000;
	}
	return isMin;
};

const CheckExp = {
	isTel(tel) {
		if ((/^1[34578]\d{9}$/.test(tel))) {return true;}
		// if((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/.test(tel))) return true
		else {return false;}
	},
	isQQ(qq) {
		const re = /[1-9][0-9]{4,}/;
		if (!re.test(qq)) {return false;}
		return true;
	}
};

const GetExitData = function(params, api) {
	return new Promise(function(resolve, reject) {
		let isEmpty = true, id = "";
		api(params).then(({res, list}) => {
			if (res.data.data.count !== 0) {
				isEmpty = false;
				id = list[0].id;
			}
			resolve({isEmpty, id});
		});
	});
};

/*获取用链接传过来的参数：传参数名即可获取*/
const UrlGet = {
	getQueryString(name) {
		const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		const r = window.location.search.substr(1).match(reg);
		if (r !== null) {return unescape(r[2]);} return null;
	},
	getRequest() {
		const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
			params = window.location.search || (window.location.href.indexOf("?") !== -1 ? window.location.href.substring(window.location.href.indexOf("?"), window.location.href.length) : ""),
			r = params.substr(1).match(reg), select = 2;
		if (r !== null) {
			return unescape(r[select]);
		} else {
			return null;
		}
	}
};


const MessageBox = {
	codeMessage(code, message, fn) {
		return new Promise((resolve, reject) => {
			const errorCode = [{code: 1, msg: "成功"}, {code: 0, msg: "逻辑错误"}, {code: -1, msg: "服务器错误"}, {code: -2, msg: "记录已存在"}, {code: -3, msg: "存在关联数据"}];
			// SystemConfigAPI.getSysConfigList({}).then((res) => {
			//     if(res.data.code==1) Object.assign(errorCode,res.data.data)
			//         let message='';
			//         message=errorCode.find(element => element.code==code).msg;
			//         resolve({message});
			// })
			let message = "";
			message = errorCode.find((element) => element.code === code).msg;
			resolve({message});
		});
	},
	messageBox(res) {
		this.codeMessage(res.data.code).then(({message}) => {
			message = (res.data.msg && "msg" in res.data) ? res.data.msg : message;
			Message({
				message: message,
				type: "error"
			});
		});
	}
};

export {
	IsMinStatus,
	CheckExp,
	GetExitData,
	UrlGet,
	MessageBox
}
