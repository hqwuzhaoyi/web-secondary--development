import React, { useCallback, useState } from "react";
import { isEqual } from "lodash";
import { Checkbox, Input, Button, Select } from "antd";
import "./index.css";
function DataConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  console.log(configuration);
  const pluginOptions = JSON.parse(JSON.stringify(configuration ? configuration : {}));
  let [cycleShow, setCycleShow] = useState(pluginOptions ? pluginOptions.cycleShow : false);
  let [provinceShow, setProvinceShow] = useState(pluginOptions ? pluginOptions.provinceShow : false);
  let [cityShow, setCityShow] = useState(pluginOptions ? pluginOptions.cityShow : false);
  let [alertShow, setAlertShow] = useState(pluginOptions ? pluginOptions.alertShow : false);
  let [pointShow, setPointShow] = useState(pluginOptions ? pluginOptions.pointShow : false);
  let [topShow, setTopShow] = useState(pluginOptions ? pluginOptions.topShow : false);
  let [provinceInput, setProvinceInput] = useState(pluginOptions ? pluginOptions.provinceInput : "");
  let [cityInput, setCityInput] = useState(pluginOptions ? pluginOptions.cityInput : "");
  let [alertInput, setAlertInput] = useState(pluginOptions ? pluginOptions.alertInput : "");
  let [pointInput, setPointInput] = useState(pluginOptions ? pluginOptions.pointInput : "");
  let [cycleInputSys, setCycleInputSys] = useState(pluginOptions ? pluginOptions.cycleInputSys : "");
  let [provinceInputSys, setProvinceInputSys] = useState(pluginOptions ? pluginOptions.provinceInputSys : "");
  let [cityInputSys, setCityInputSys] = useState(pluginOptions ? pluginOptions.cityInputSys : "");
  let [alertInputSys, setAlertInputSys] = useState(pluginOptions ? pluginOptions.alertInputSys : "");
  let [pointInputSys, setPointInputSys] = useState(pluginOptions ? pluginOptions.pointInputSys : "");
  let [topInputSys, setTopInputSys] = useState(pluginOptions ? pluginOptions.topInputSys : "");
  let [cycleInCheck, setCycleInCheck] = useState(pluginOptions ? pluginOptions.cycleInCheck : []);
  const handleSubmit = useCallback(() => {
    console.log("配置页", props);
    const newOptions = {
      cycleShow: cycleShow,
      provinceShow: provinceShow,
      cityShow: cityShow,
      alertShow: alertShow,
      pointShow: pointShow,
      topShow: topShow,
      provinceInput: provinceInput,
      cityInput: cityInput,
      alertInput: alertInput,
      pointInput: pointInput,
      cycleInCheck: cycleInCheck,
      cycleInputSys: cycleInputSys,
      provinceInputSys: provinceInputSys,
      cityInputSys: cityInputSys,
      alertInputSys: alertInputSys,
      pointInputSys: pointInputSys,
      topInputSys: topInputSys,
    };
    console.log(newOptions);
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  let message = [];
  if (pluginOptions) {
    if (cycleShow) {
      message.push("统计周期");
    }
    if (provinceShow) {
      message.push("所在省份");
    }
    if (cityShow) {
      message.push("所在市");
    }
    if (alertShow) {
      message.push("告警状态");
    }
    if (pointShow) {
      message.push("站点名称");
    }
    if (topShow) {
      message.push("TOPN");
    }
  }
  let [showCheck, setShowCheck] = useState(message);
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    let cycleFlag = false;
    let provinceFlag = false;
    let cityFlag = false;
    let pointFlag = false;
    let topFlag = false;
    let alertFlag = false;
    checkedValues.forEach((item, index) => {
      item === "统计周期" ? (cycleFlag = true) : (cycleFlag = cycleFlag);
      item === "所在市" ? (cityFlag = true) : (cityFlag = cityFlag);
      item === "站点名称" ? (pointFlag = true) : (pointFlag = pointFlag);
      item === "告警状态" ? (alertFlag = true) : (alertFlag = alertFlag);
      item === "所在省份" ? (provinceFlag = true) : (provinceFlag = provinceFlag);
      item === "TOPN" ? (topFlag = true) : (topFlag = topFlag);
    });
    setCycleShow(cycleFlag);
    setProvinceShow(provinceFlag);
    setCityShow(cityFlag);
    setPointShow(pointFlag);
    setTopShow(topFlag);
    setAlertShow(alertFlag);
  };
  const onChange2 = (checkedValues) => {
    setCycleInCheck(checkedValues);
  };
  const inputSys = (type, e) => {
    switch (type) {
      case "所在省份sys":
        setProvinceInputSys(e.target.value);
        break;
      case "所在市sys":
        setCityInputSys(e.target.value);
        break;
      case "站点名称sys":
        setPointInputSys(e.target.value);
        break;
      case "告警状态sys":
        setAlertInputSys(e.target.value);
        break;
      case "统计周期sys":
        setCycleInputSys(e.target.value);
        break;
      case "TOPNsys":
        setTopInputSys(e.target.value);
        break;
      case "所在省份":
        setProvinceInput(e.target.value);
        break;
      case "所在市":
        setCityInput(e.target.value);
        break;
      case "站点名称":
        setPointInput(e.target.value);
        break;
      case "告警状态":
        setAlertInput(e.target.value);
        break;
      default:
    }
  };
  const plainOptions = ["所在省份", "所在市", "站点名称", "告警状态", "统计周期", "TOPN"];
  const plainOptions2 = ["最近一周", "最近一个月", "最近三个月", "最近一季度", "最近半年", "最近一年", "最近两年"];
  return (
    <div>
      <span>筛选项</span>
      <br />
      <Checkbox.Group className="CheckboxGroup" options={plainOptions} defaultValue={showCheck} onChange={onChange} />
      <br />
      <span>统计周期</span>
      <br />
      <Checkbox.Group className="CheckboxGroup" style={{ display: cycleShow ? "block" : "none" }} options={plainOptions2} defaultValue={cycleInCheck} onChange={onChange2} />
      <br />
      <span>变量绑定</span>
      <br />
      <span>所在省份</span>
      <Input
        onChange={inputSys.bind(this, "所在省份sys")}
        value={provinceInputSys}
        placeholder="输入省份变量名称"
        style={{ display: provinceShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>所在市</span>
      <Input
        onChange={inputSys.bind(this, "所在市sys")}
        value={cityInputSys}
        placeholder="输入市变量名称"
        style={{ display: cityShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>站点名称</span>
      <Input
        onChange={inputSys.bind(this, "站点名称sys")}
        value={pointInputSys}
        placeholder="输入站点变量名称"
        style={{ display: pointShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>告警状态</span>
      <Input
        onChange={inputSys.bind(this, "告警状态sys")}
        value={alertInputSys}
        placeholder="输入告警变量名称"
        style={{ display: alertShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>统计周期</span>
      <Input
        onChange={inputSys.bind(this, "统计周期sys")}
        value={cycleInputSys}
        placeholder="输入统计周期变量名称"
        style={{ display: topShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>TOPN</span>
      <Input onChange={inputSys.bind(this, "TOPNsys")} value={topInputSys} placeholder="输入TOPN变量名称" style={{ display: topShow ? "block" : "none" }} className="selectInput" />
      <br />
      <span>数据绑定</span>
      <br />
      <span>所在省份</span>
      <Input
        onChange={inputSys.bind(this, "所在省份")}
        value={provinceInput}
        placeholder="所在省份资产"
        style={{ display: provinceShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>所在市</span>
      <Input onChange={inputSys.bind(this, "所在市")} value={cityInput} placeholder="所在市资产" style={{ display: cityShow ? "block" : "none" }} className="selectInput" />
      <span>站点名称</span>
      <Input onChange={inputSys.bind(this, "站点名称")} value={pointInput} placeholder="站点名称资产" style={{ display: pointShow ? "block" : "none" }} className="selectInput" />
      <span>告警状态</span>
      <br/>
      <Input onChange={inputSys.bind(this, "告警状态")} value={alertInput} placeholder="告警状态资产" style={{ display: alertShow ? "block" : "none" }} className="selectInput" />
      <Button type="primary" onClick={handleSubmit}>
        执行
      </Button>
    </div>
  );
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
