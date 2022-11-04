<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%; overflow: unset" :ref="id">
    <!-- -->
    <div class="topButton">
      <div class="Logout" @click="Logout">Logout</div>
      <div class="Filter" @click="showFlag">Filter</div>
    </div>
    <div class="bottomButton">
      <div class="Adhoc" @click="Adhoc">Adhoc</div>
    </div>
    <el-dropdown trigger="click" class="dropMenu" v-show="openFlag" @command="handleCommand1">
      <div>Select Inspection<img src="../pluginTemp/images/drop.png" alt="" style="float: right; margin-top: 5px; margin-right: 5px" /></div>
      <el-dropdown-menu slot="dropdown" v-if="customConfig.筛选1展示字段" :append-to-body="false">
        <el-dropdown-item v-for="(item, index) in selectData" :key="index" :command="item">{{ item[customConfig.筛选1展示字段] }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown trigger="click" class="dropMenu" v-show="openFlag" @command="handleCommand2">
      <div>Select Account<img src="../pluginTemp/images/drop.png" alt="" style="float: right; margin-top: 5px; margin-right: 5px" /></div>
      <el-dropdown-menu slot="dropdown" v-if="customConfig.筛选2展示字段" :append-to-body="false">
        <el-dropdown-item v-for="(item, index) in selectData" :key="index" :command="item">{{ item[customConfig.筛选2展示字段] }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import Vue from "vue";
import Utils from "./utils";
import "./index.css";
import { queryAssetById, logout } from "./api/asset.js";

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    history: Function,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style");
          document.head.appendChild(this.styleEle);
          this.styleEle.innerText = style;
        }
      });
      return {
        themeColor,
        textColor,
      };
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      selectData: {},
      openFlag: false,
      selectDataOut: {
        select1: "",
        select2: "",
      },
    };
  },
  mounted() {
    this.findBlock(document.querySelectorAll(".topButton")[0].parentNode);
    let message = this.customConfig.资产ID ? this.customConfig.资产ID : "3230fb9b-e265-45f1-9ece-59863fc8ff30";
    queryAssetById(message).then((res) => {
      this.selectData = Utils.translatePlatformDataToJsonArray(res);
    });
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
    //用于定义接收用户输入
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue;
      this.triggerEvent("valueChange", {
        value: this.defaultValue,
      });
    }
  },
  methods: {
    findBlock(node) {
      if (node.parentNode.className.indexOf("application-block") != -1) {
        node.parentNode.style.overflow = "unset";
      } else {
        this.findBlock(node.parentNode);
      }
    },
    Logout() {
      logout().then((res) => {
        if (res.status == 200) {
          window.location.href = "http://10.15.110.28:18880/application/login/b52217d4-25a4-99fd-6bcc-f487fb871330";
        }
      });
    },
    Adhoc() {
      window.location.href = this.customConfig.跳转地址;
    },
    handleCommand1(command) {
      this.selectDataOut.select1 = command[this.customConfig.筛选1传递字段];
      this.triggerEvent(this.selectDataOut);
    },
    handleCommand2(command) {
      this.selectDataOut.select2 = command[this.customConfig.筛选2传递字段];
      this.triggerEvent(this.selectDataOut);
    },
    showFlag() {
      this.openFlag = !this.openFlag;
    },
    handleValueChange(value) {
      this.triggerEvent("valueChange", {
        value,
      });
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(data) {
      let { componentId, appId } = this.customConfig || {};
      window.eventCenter?.triggerEventNew({
        objectId: appId,
        componentId: componentId,
        type: "app",
        event: "selectChange",
        payload: {
          value: data,
        },
      });
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_selectChange(value) {
      this.setValue(value);
    },
    setValue(value) {
      this.selected = value;
    },
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.topButton {
  width: 100%;
  height: 40px;
  display: flex;
}
.Logout {
  width: 50%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #3b909b;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 5px;
  font-size: 18px;
}
.Filter {
  border-left: 1px solid #969292;
  width: 50%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #3b909b;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 18px;
}
.Adhoc {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #3b909b;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  font-size: 18px;
}
.dropMenu {
  height: 40px;
  width: 100%;
  text-align: center;
  background: #c0bfbf;
  margin-bottom: 1.5px;
  border-radius: 5px;
  div {
    line-height: 40px;
    color: #fff;
    font-weight: 700;
    font-size: 18px;
  }
}
</style>
<style>
.el-dropdown-menu {
  width: 99% !important;
}
.el-dropdown-menu li {
  text-align: center;
}
</style>
