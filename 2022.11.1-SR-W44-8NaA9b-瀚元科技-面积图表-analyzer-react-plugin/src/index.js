/*
 * @Author: wangchengyuan
 * @Email: wangchengyuan@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-04-06 09:58:34
 * @LastEditTime: 2021-10-19 17:43:29
 * @FilePath: \om-app-plugin-react-boilerplate\src\index.js
 * @Description: 请描述文件作用
 */
/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");

  // 资产数据
  const dataSource = [
    ["月份", "紧急", "重要", "一般", "提示"],
    ["1月", "20", "50", "70", "50"],
    ["2月", "30", "40", "50", "60"],
    ["3月", "35", "30", "30", "70"],
    ["4月", "40", "20", "10", "80"],
    ["5月", "20", "40", "20", "70"],
    ["6月", "25", "60", "40", "60"],
    ["7月", "30", "70", "60", "50"],
    ["8月", "45", "50", "80", "40"],
    ["9月", "50", "30", "60", "30"],
    ["10月", "50", "20", "40", "20"],
    ["11月", "40", "10", "20", "20"],
    ["12月", "30", "10", "20", "20"],
  ];

  // 配置项
  const options = {
    externalVariables: {
      系列颜色配置: "#FF6969-#FF9E75-#FFD03B-#30D994",
      线条颜色渐变: "#ff6969",
    },
  };

  ReactDOM.render(<App dataSource={dataSource} options={options} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
