import React, { Component } from "react";
import msgCompConfig from "./msgCompConfig";
import Utils from "../../utils";
import "./index.less";
import { getAssets } from "../../api/asset";
import { Select, Button } from "antd";
const { Option } = Select;
export default class Main extends Component {
  state = {
    nameColor: "black",
    id: "",
    provinceAsset: [],
    cityAsset: [],
    alertAsset: [],
    pointAsset: [],
    provinceOption: [],
    cityOption: [],
    alertOption: [],
    cycleOption: [],
    pointOption: [],
    provinceInSelect: {
      value: "",
      label: "",
    },
    cityInSelect: { value: "", label: "" },
    alertInSelect: { value: "", label: "" },
    pointInSelect: { value: "", label: "" },
    cycleInSelect: { value: "", label: "" },
    topInSelect: { value: "", label: "" },
    pluginOptions: {},
  };

  componentDidMount() {
    this.initComData();
    window.componentCenter?.register && window.componentCenter.register(this.props?.componentId, "searchSelect", this, msgCompConfig);
    this.props?.updateProcess && this.props.updateProcess();
  }
  //获取当前日期
  getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    return targetday_milliseconds;
  }
  //获取当前月份
  doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }
  changeProvince = (value) => {
    this.setState({
      provinceInSelect: value,
      cityInSelect: {
        value: "",
        label: "",
      },
      pointInSelect: {
        value: "",
        label: "",
      },
    });
    let message = [];
    // let message2 = [];
    if (this.state.pluginOptions.cityShow) {
      this.state.cityAsset.forEach((item, index) => {
        if (item.parentOne == value.value) {
          message.push(item);
        }
      });
      this.setState({
        cityOption: message,
      });
    } else {
      this.state.pointAsset.forEach((item, index) => {
        if (item.parentTwo == value.value) {
          message.push(item);
        }
      });
      this.setState({
        pointOption: message,
      });
    }
    // if (this.state.pluginOptions.pointShow) {

    // }
  };
  changeCity = (value) => {
    this.setState({
      cityInSelect: value,
      pointInSelect: {
        value: "",
        label: "",
      },
    });
    let message = [];
    if (this.state.pluginOptions.pointShow) {
      this.state.pointAsset.forEach((item, index) => {
        if (item.parentOne == value.value) {
          message.push(item);
        }
      });
    }
    this.setState({
      pointOption: message,
    });
  };
  changePoint = (value) => {
    this.setState({
      pointInSelect: value,
    });
  };
  changeCycle = (value) => {
    this.setState({
      cycleInSelect: value,
    });
  };
  changeTop = (value) => {
    this.setState({
      topInSelect: value,
    });
  };
  changeAlert = (value) => {
    this.setState({
      alertInSelect: value,
    });
  };
  search = () => {
    let data = {};
    if (this.state.pluginOptions.cycleInputSys) {
      switch (this.state.cycleInSelect.label) {
        case "最近一周":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-7),
            end: this.getDay(0),
          };
          break;
        case "最近一个月":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-31),
            end: this.getDay(0),
          };
          break;
        case "最近三个月":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-93),
            end: this.getDay(0),
          };
          break;
        case "最近一季度":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-93),
            end: this.getDay(0),
          };
          break;
        case "最近半年":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-183),
            end: this.getDay(0),
          };
          break;
        case "最近一年":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-365),
            end: this.getDay(0),
          };
          break;
        case "最近两年":
          data[this.state.pluginOptions.cycleInputSys] = {
            start: this.getDay(-730),
            end: this.getDay(0),
          };
          break;
      }
    }
    if (this.state.pluginOptions.provinceInputSys) {
      data[this.state.pluginOptions.provinceInputSys] = this.state.provinceInSelect.label;
    }
    if (this.state.pluginOptions.cityInputSys) {
      data[this.state.pluginOptions.cityInputSys] = this.state.cityInSelect.label;
    }
    if (this.state.pluginOptions.alertInputSys) {
      data[this.state.pluginOptions.alertInputSys] = this.state.alertInSelect.label;
    }
    if (this.state.pluginOptions.pointInputSys) {
      data[this.state.pluginOptions.pointInputSys] = this.state.pointInSelect.label;
    }
    if (this.state.pluginOptions.topInputSys) {
      data[this.state.pluginOptions.topInputSys] = this.state.topInSelect.label;
    }
    console.log(data);
    this.triggerEvent(data);
    this.handleClickBigscreen(data);
  };
  Event_Center_getName() {
    return this.state.id;
  }

  reSelect = () => {
    this.setState({
      cityInSelect: { value: "", label: "" },
      provinceInSelect: { value: "", label: "" },
      alertInSelect: { value: "", label: "" },
      pointInSelect: { value: "", label: "" },
      cycleInSelect: { value: "", label: "" },
      topInSelect: { value: "", label: "" },
    });
  };
  handleClickBigscreen = (data) => {
    let bigscreenData = [];
    for (let k in data) {
      bigscreenData.push({
        id: k,
        value: data[k],
      });
    }
    console.log(bigscreenData, "bigscreenData");
    const { bigscreen = {}, notifyVariable } = this.props;
    // 获取大屏变量数组
    const { variableList = [] } = bigscreen;
    // // 假设我们要修改名为 variableA 的变量
    // const targetVariableName = "variableA";

    const params = [];
    // 在此处找到第一个符合name是variableA的变量
    //也可以根据业务情况查找多个修改多个，
    bigscreenData.forEach((Info, index) => {
      let targetVariableIndex = variableList.findIndex((item) => {
        return item.name === Info.id;
      });
      // 如果找到，构造params参数
      if (targetVariableIndex > -1) {
        params.push({
          id: variableList[targetVariableIndex].id,
          value: Info.value, // 目标值
        });
      }
    });

    // 触发变量改变
    notifyVariable && notifyVariable(params);
  };
  triggerEvent = (data) => {
    window.eventCenter?.triggerEvent &&
      window.eventCenter.triggerEvent(this.props.componentId, "searchSelect", {
        value: data,
      });
  };
  initComData = () => {
    //pluginOptions为组件式配置项数据
    const pluginOptions = JSON.parse(JSON.stringify(this.props?.block?.dataConfig?.pluginOptions));
    this.setState({
      pluginOptions: pluginOptions,
    });
    //options为传统的输入框形式的配置项
    const options = this.props.options?.externalVariables;
    const id = options?.id ? `secondary_bigscreen_${options.id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.setState({ id });
    console.log(this.props, options, "main");
    if (pluginOptions.provinceInput && pluginOptions.provinceShow) {
      getAssets({ id: pluginOptions.provinceInput }).then((res) => {
        this.setState({
          provinceAsset: Utils.translatePlatformDataToJsonArray(res),
          provinceOption: Utils.translatePlatformDataToJsonArray(res),
        });
      });
    }
    if (pluginOptions.cityInput && pluginOptions.cityShow) {
      getAssets({ id: pluginOptions.cityInput }).then((res) => {
        this.setState({
          cityAsset: Utils.translatePlatformDataToJsonArray(res),
          cityOption: Utils.translatePlatformDataToJsonArray(res),
        });
      });
    }
    if (pluginOptions.alertInput && pluginOptions.alertShow) {
      getAssets({ id: pluginOptions.alertInput }).then((res) => {
        this.setState({
          alertAsset: Utils.translatePlatformDataToJsonArray(res),
          alertOption: Utils.translatePlatformDataToJsonArray(res),
        });
      });
    }
    if (pluginOptions.pointInput && pluginOptions.pointShow) {
      getAssets({ id: pluginOptions.pointInput }).then((res) => {
        this.setState({
          pointAsset: Utils.translatePlatformDataToJsonArray(res),
          pointOption: Utils.translatePlatformDataToJsonArray(res),
        });
      });
    }
    if (pluginOptions.cycleShow) {
      let message = [];
      pluginOptions.cycleInCheck.forEach((item, index) => {
        message.push({
          name: item,
          value: item,
        });
      });
      this.setState({
        cycleOption: message,
      });
    }
  };

  render() {
    const pluginOptions = JSON.parse(JSON.stringify(this.props?.block?.dataConfig?.pluginOptions));
    const { id } = this.state;
    return (
      <>
        {/*大屏定义外层容器百分百，不可删除*/}
        <div id={id} style={{ width: "100%", height: "100%" }}>
          <div className="HYtop">
            <div className="selectBox" style={{ display: pluginOptions.provinceShow ? "block" : "none" }}>
              <span>所在省份：</span>
              <Select
                labelInValue
                value={this.state.provinceInSelect}
                placeholder={"请选择"}
                size="large"
                onChange={this.changeProvince}
                style={{ width: 120 }}
                options={this.state.provinceOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.cityShow ? "block" : "none" }}>
              <span>所在市：</span>
              <Select
                labelInValue
                value={this.state.cityInSelect}
                placeholder={"请选择"}
                onChange={this.changeCity}
                size="large"
                style={{ width: 120 }}
                options={this.state.cityOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.pointShow ? "block" : "none" }}>
              <span>站点名称：</span>
              <Select
                labelInValue
                value={this.state.pointInSelect}
                placeholder={"请选择"}
                onChange={this.changePoint}
                size="large"
                style={{ width: 120 }}
                options={this.state.pointOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.cycleShow ? "block" : "none" }}>
              <span>统计方式：</span>
              <Select
                labelInValue
                value={this.state.cycleInSelect}
                placeholder={"请选择"}
                onChange={this.changeCycle}
                size="large"
                style={{ width: 120 }}
                options={this.state.cycleOption.map((item) => ({ label: item.name, value: item.value }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.topShow ? "block" : "none" }}>
              <span>TOPN：</span>
              <Select
                labelInValue
                value={this.state.topInSelect}
                placeholder={"请选择"}
                onChange={this.changeTop}
                size="large"
                style={{ width: 120 }}
                options={[
                  {
                    value: "5",
                    label: "5",
                  },
                  {
                    value: "10",
                    label: "10",
                  },
                ]}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.alertShow ? "block" : "none" }}>
              <span>告警状态：</span>
              <Select
                labelInValue
                value={this.state.alertInSelect}
                placeholder={"请选择"}
                onChange={this.changeAlert}
                size="large"
                style={{ width: 120 }}
                options={this.state.alertOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="bottomBox">
              <Button type="primary" onClick={this.search}>
                查询
              </Button>
              <Button type="primary" onClick={this.reSelect}>
                重置
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
