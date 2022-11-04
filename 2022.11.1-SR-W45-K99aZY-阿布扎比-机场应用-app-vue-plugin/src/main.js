import Vue from "vue";
import App from "./App.vue";
import { sysVariables, appVariables, customConfig, themeInfo } from "@/components/mockData.js";
import { Button, Dropdown, DropdownItem, DropdownMenu } from "element-ui";
Vue.use(Button);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  };
  let customConfig = {
    componentId: "123",
    appId: "123",
    跳转地址: "http://www.baidu.com",
    资产ID: "3230fb9b-e265-45f1-9ece-59863fc8ff30",
    筛选1展示字段: "task_sites",
    筛选1传递字段: "task_sites",
    筛选2展示字段: "task_sites",
    筛选2传递字段: "http://www.baidu.com",
  };
  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} themeInfo={themeInfo} sysVariables={sysVariables} appVariables={appVariables} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(div);
  });
}
