import BasicRoutes from "./router.config";
import Login from "../views/base/login/login";
import Home from "../views/base/home/home.vue";
import NotFound from "../views/base/not-found/not-found.vue";
import Main from "../views/base/main/main.vue";

const baseRoutes = [...BasicRoutes.basicRoutes.map((route) => {
	route.meta = {
		title: route.meta.title,
		requiresAuth: true,
		...route.meta
	};
	return route;
})];

let modulesPath = [];
if (window.env.NODE_ENV === "production") {
	modulesPath = [
		{title: "首页", name: "Home", path: "/", component: Home, children: []},
		...baseRoutes,
		{title: "NotFound", name: "NotFound", component: NotFound, path: "*"}
	]
} else {
	modulesPath = [
		{title: "首页", name: "Home", path: "/", component: Home, children: [
			{title: "Main", name: "Main", component: Main, path: "/"},
			...baseRoutes,
			{title: "NotFound", name: "NotFound", component: NotFound, path: "*"}
		]}
	]
}

const routes = [
	{title: "登录", name: "Login", component: Login, path: "/login"},
	...modulesPath
];

export default routes;
