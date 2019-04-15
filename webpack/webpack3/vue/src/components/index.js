import XtSearch from "./xt-search/search";

const components = [
	XtSearch
];

const install = function (Vue) {
	/* istanbul ignore if */
	if (install.installed) {return;}
	components.map((component) => {
		Vue.component(component.name, component);
	});
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
	install(window.Vue);
}

export default {
	version: "1.0.2",
	install,
	XtSearch
};
