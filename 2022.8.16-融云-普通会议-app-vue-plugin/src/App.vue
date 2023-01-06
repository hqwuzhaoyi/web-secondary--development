<template>
  <div id="ry_mettingAll" class="metting_all">
    <!-- 会议位置标题 -->
    <div class="metting_title">
      <div>位置:{{ mettingTitle }}</div>
      <div v-if="!mettingSwitch" class="metting_type" style="color: red">(未录播)</div>
      <div v-if="mettingSwitch" class="metting_type" style="color: green">(录播中)</div>
      <el-switch v-model="mettingSwitch" @change="changeSwitch" active-color="#13ce66" inactive-color="#ff4949" class="metting_switch"></el-switch>
      <img @click="closeDialog = true" src="./assets/quit.png" alt="" title="结束会议" />
    </div>
    <!-- 会议 -->
    <div class="metting">
      <!-- 左侧 -->
      <div class="metting_left">
        <!-- 会场终端 -->
        <div class="metting_table">
          <div class="table_title">
            <img src="./assets/ico_dw.png" alt="" />
            <div>会场终端</div>
            <img style="margin-left: 50%" src="./assets/ico_ty.png" alt="" />
          </div>
          <!-- 搜索 -->
          <div class="metting_searchTip">
            <div class="metting_search">
              <el-input v-model="searchData" placeholder="请输入搜索关键字" clearable></el-input>
              <el-button icon="el-icon-search" @click="searchTabelData">查询</el-button>
              <el-button icon="el-icon-document-add" @click="addSourcesData">增加</el-button>
            </div>
            <div>
              <i class="el-icon-refresh refreshIcon" @click="getTableDataList('refresh')"></i>
            </div>
          </div>
          <!-- 表格 -->
          <el-table :data="tableDataShow" height="77%" @selection-change="tableDataChange" :row-style="tableRowClassName" :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657' }">
            <el-table-column type="selection" header-align="center" align="center" width="60"> </el-table-column>
            <el-table-column prop="name" label="会场名称" :show-overflow-tooltip="true" header-align="center" align="center" width="230"></el-table-column>
            <el-table-column prop="hw_addr" label="会场标识" :show-overflow-tooltip="true" header-align="center" align="center" width="250"></el-table-column>
            <el-table-column prop="local_venue_name" label="观看会场" :show-overflow-tooltip="true" header-align="center" align="center" width="300"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1" title="发言" src="./assets/handle.png" @click="handleTabelIcon(scope.row, 'handleSay')" />
                      <img v-if="scope.row.status == 0" title="呼叫" src="./assets/call_2.png" @click="handleTabelIcon(scope.row, 'recall')" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img title="主席" v-if="scope.row.status == 1 && !scope.row.is_main" src="./assets/user_1.png" @click="handleTabelIcon(scope.row, 'isMain')" />
                      <img title="主席" v-if="scope.row.status == 1 && scope.row.is_main == true" src="./assets/user_2.png" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1 && scope.row.mic_status == 'on'" title="麦克风" src="./assets/mic_1.png" @click="handleTabelIcon(scope.row, 'micCall', 0)" />
                      <img v-if="scope.row.status == 1 && scope.row.mic_status == 'off'" title="麦克风" src="./assets/mic_2.png" @click="handleTabelIcon(scope.row, 'micCall', 1)" />
                      <img v-if="scope.row.status == 1 && !scope.row.mic_status" title="麦克风" src="./assets/mic_3.png" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1 && scope.row.mic_status == 'on'" title="远端麦克风" src="./assets/mic_4.png" />
                      <img v-if="scope.row.status == 1 && scope.row.mic_status == 'off'" title="远端麦克风" src="./assets/mic_5.png" />
                      <img v-if="scope.row.status == 1 && !scope.row.mic_status" title="远端麦克风" src="./assets/mic_6.png" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1 && scope.row.vol_status == 'on'" src="./assets/horn_1.png" title="扬声器" @click="handleTabelIcon(scope.row, 'loudspeaker', 0)" />
                      <img v-if="scope.row.status == 1 && scope.row.vol_status == 'off'" src="./assets/horn_2.png" title="扬声器" @click="handleTabelIcon(scope.row, 'loudspeaker', 1)" />
                      <img v-if="scope.row.status == 1 && !scope.row.vol_status" title="扬声器" src="./assets/horn_3.png" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1" title="预监" src="./assets/camera_1.png" @click="handleTabelIcon(scope.row, 'preview')" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="table_img">
                      <img v-if="scope.row.status == 1" title="离会" src="./assets/leave_1.png" @click="handleTabelIcon(scope.row, 'handup')" />
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 主会场-发言-预监 -->
        <div class="metting_live">
          <div class="live_col">
            <div class="live_title">
              <img src="./assets/ico_dw.png" alt="" />
              <div>主会场</div>
              <img src="./assets/ico_ty.png" alt="" />
            </div>
            <div class="live_vedio">
              <iframe id="rtsp_player_local" width="445" height="270" frameborder="0" allowfullscreen src=""></iframe>
            </div>
          </div>
          <div class="live_col">
            <div class="live_title">
              <img src="./assets/ico_dw.png" alt="" />
              <div>发言</div>
              <img src="./assets/ico_ty.png" alt="" />
            </div>
            <div class="live_vedio">
              <iframe id="rtsp_player_handle" width="445" height="270" frameborder="0" allowfullscreen src=""></iframe>
            </div>
          </div>
          <div class="live_col">
            <div class="live_title">
              <img src="./assets/ico_dw.png" alt="" />
              <div>预监</div>
              <img src="./assets/ico_ty.png" alt="" />
            </div>
            <div class="live_vedio">
              <iframe id="rtsp_player_watch" width="445" height="270" frameborder="0" allowfullscreen src=""></iframe>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="metting_right">
        <!-- 工具栏 -->
        <div class="metting_tool">
          <div class="tool_title">
            <img src="./assets/ico_dw.png" alt="" />
            <div>工具栏</div>
            <img style="margin-left: 28%" src="./assets/ico_ty.png" alt="" />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" class="tool_col">
              <span>呼叫/挂断</span>
              <div class="tool_icon">
                <div class="icon_div" @click="handleToolIcon('recall')">
                  <img title="呼叫" src="./assets/call_1.png" alt="" />
                </div>
                <div class="icon_div" @click="handleToolIcon('hangup')">
                  <img title="挂断" src="./assets/Hangup.png" alt="" />
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="tool_col">
              <span>单页面轮询</span>
              <div class="tool_icon">
                <div class="icon_div" @click="openLoopDialog">
                  <img title="轮询设置" src="./assets/loop_1.png" alt="" />
                </div>
                <div v-if="!oneLoopType" class="icon_div" @click="handleToolIcon('oneLoop')">
                  <img title="播放" src="./assets/start_1.png" alt="" />
                </div>
                <div v-if="oneLoopType" class="icon_div" @click="handleToolIcon('stopOneLoop')">
                  <img title="暂停" src="./assets/stop.png" alt="" />
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="8" class="tool_col">
              <span>多页面轮询</span>
              <div class="tool_icon">
                <div class="icon_div">
                  <img src="./assets/loop_2.png" alt="" />
                </div>
                <div class="icon_div">
                  <img src="./assets/start_1.png" alt="" />
                </div>
              </div>
            </el-col> -->
            <!-- <el-col :span="8" class="tool_col">
              <span>锁定/解锁视频源</span>
              <div class="tool_icon">
                <div class="icon_div">
                  <img src="./assets/lock_1.png" alt="" />
                </div>
                <div class="icon_div">
                  <img src="./assets/unlock_1.png" alt="" />
                </div>
              </div>
            </el-col> -->
            <el-col :span="8" class="tool_col">
              <span>锁定/解锁会议</span>
              <div class="tool_icon">
                <div class="icon_div" @click="handleToolIcon('lock')">
                  <img title="锁定" src="./assets/lock_2.png" alt="" />
                </div>
                <div class="icon_div" @click="handleToolIcon('unLock')">
                  <img title="解锁" src="./assets/unlock_2.png" alt="" />
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 任务提醒 -->
        <div class="metting_task">
          <div class="task_title">
            <img src="./assets/ico_dw.png" alt="" />
            <div>任务提醒</div>
            <img style="margin-left: 25%" src="./assets/ico_ty.png" alt="" />
          </div>
          <div class="task_list" v-if="pdfPath">
            <iframe :src="pdfPath + '#toolbar=0'" frameborder="0" scrolling="no" class="task_iframe"></iframe>
          </div>
        </div>
      </div>
    </div>
    <!-- 增加弹窗 -->
    <el-dialog title="添加临时资源" :visible.sync="addSourcesDialog" class="metting_dialog addSources_diaog" :close-on-click-modal="false" width="65%">
      <el-table :data="addSourcesDataList" height="350" :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657', color: '#1985e1' }" max-height="500">
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" type="text" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="model" label="型号" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.model" placeholder="请选择" size="small">
              <el-option v-for="(item, index) in dialogModelOption" :key="index" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择" size="small">
              <el-option v-for="(item, index) in dialogTypeOption" :key="index" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="connection_identifier" label="连接标识" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.connection_identifier" type="text" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="用户名" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.user_name" type="text" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="password" label="密码" :show-overflow-tooltip="true" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input type="password" v-model="scope.row.password" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="170">
          <template slot-scope="scope">
            <div class="addSources_dialog_handlebutton">
              <el-button type="primary" size="mini">高级设置</el-button>
              <el-button type="primary" size="mini" @click="delectTableRow(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-button icon="el-icon-plus" class="add_button" @click="addTableRow()">新增</el-button>

      <div class="addSources_dialog_button">
        <el-button @click="addSourcesDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAddSourcesData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 轮询弹窗 -->
    <el-dialog :visible.sync="loopDialog" :show-close="false" class="metting_dialog addSources_diaog" :close-on-click-modal="false" width="55%">
      <!-- 弹窗标题 -->
      <div slot="title" class="dialog_title">
        <div class="dialog_title_label">主席画面轮询设置</div>
        <div class="dialog_title_button">
          <el-button @click="closeLoopDialog">取消</el-button>
          <el-button type="primary" @click="saveLoopData">确定</el-button>
        </div>
      </div>
      <div class="dialog_firstRow">
        <!-- 轮询时间 -->
        <div class="dialog_input_number">
          <div>轮播间隔(秒)</div>
          <el-input-number v-model="oneLoopTimes" controls-position="right" :min="1"></el-input-number>
        </div>
      </div>
      <!-- 穿梭表格 -->
      <div class="dialog_table">
        <!-- 已选资源 -->
        <div class="dialog_table_select">
          <div class="dialog_table_title">
            <div>
              <div class="title_line"></div>
              <span>已选资源</span>
            </div>
            <el-button type="primary" @click="handleSelectBatchData">批量选中</el-button>
          </div>
          <div class="dialog_table_table">
            <el-table :data="selectedTableDataShow" :row-style="tableRowClassName" height="500" @selection-change="selectTabelDataChange" :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657', color: '#1985e1' }" max-height="500">
              <el-table-column type="selection" :selectable="tableSelected" header-align="center" align="center" width="60"> </el-table-column>
              <el-table-column prop="name" label="终端名称" :show-overflow-tooltip="true" sortable header-align="center" align="center"></el-table-column>
              <el-table-column prop="hw_addr" label="连接标识" :show-overflow-tooltip="true" header-align="center" align="center"></el-table-column>
              <el-table-column c label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status != 0" type="text" size="small" @click="selectTableRow(scope.row)">选中</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 轮询资源 -->
        <div class="dialog_table_loop">
          <div class="dialog_table_title">
            <div>
              <div class="title_line"></div>
              <span>轮询资源</span>
            </div>
            <el-button type="primary" @click="handleLoopBatchData">批量剔除</el-button>
          </div>
          <div class="dialog_table_table">
            <el-table :data="loopTableData" :row-style="tableRowClassName" height="500" @selection-change="loopTabelDataChange" :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657', color: '#1985e1' }" max-height="500">
              <el-table-column type="selection" :selectable="tableSelected" header-align="center" align="center" width="60"> </el-table-column>
              <el-table-column prop="name" label="设备名称" :show-overflow-tooltip="true" sortable header-align="center" align="center"></el-table-column>
              <el-table-column prop="hw_addr" label="会场标识" :show-overflow-tooltip="true" header-align="center" align="center"></el-table-column>
              <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deleteTableRow(scope.row)">剔除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 关闭弹窗 -->
    <el-dialog title="关闭提示" :visible.sync="closeDialog" width="30%" :show-close="false" class="close_dialog" :close-on-click-modal="false">
      <span>确认结束会议</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog = false">取 消</el-button>
        <el-button type="primary" @click="loginOut()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "./index.css";
import { creatMetting, saveAddResources, getVideoList, changeMain, record, say, preview, micCall, loudspeaker, finishMetting, recall, oneLoop, hangup, lockMetting, skipLoop, taskReminder } from "./api/asset";
import qs from "querystringify";

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  data() {
    return {
      // 数据ID
      data_id: "",

      // 是否加载过主会场视频
      isLoadinglocalVedio: false,

      // 轮询状态
      oneLoopType: false,

      mettingID: "",
      // 位置标题
      mettingTitle: "",
      // 是否录播
      mettingSwitch: false,
      // 搜索文本
      searchData: "",
      // 轮询弹窗
      loopDialog: false,
      // 轮询时长
      oneLoopTimes: 8,
      // 表格数据
      tableSelectData: [],
      // 会议锁定状态
      lockType: 1,

      // 关闭直播弹窗
      closeDialog: false,

      // 新增弹窗
      addSourcesDialog: false,
      // 新增弹窗表格数据
      addSourcesDataList: [{ data_id: this.get_UUID(), parent_id: "", name: "", model: "", type: "", connection_identifier: "", user_name: "", password: "", KVParams: {} }],

      // 型号数组
      dialogModelOption: [
        { label: "华为终端", value: "华为终端" },
        { label: "小鱼终端", value: "小鱼终端" },
        { label: "中兴终端", value: "中兴终端" },
        { label: "华平终端", value: "华平终端" },
      ],
      // 类型数组
      dialogTypeOption: [{ label: "H.323", value: "H.323" }],

      // 弹窗已选数据表格
      selectedTableData: [],
      selectedTableDataShow: [],

      selectedTableDeleteData: [],
      // 弹窗批量选中数据
      selectDataList: [],
      // 弹窗轮询资源表格
      loopTableData: [],
      // 弹窗批量轮询数据
      loopDataList: [],
      // 轮询定时器
      loopTimer: null,
      // 保存轮询的数据
      saveLoopDataList: [],

      // 表格数据
      tableData: [],
      tableDataShow: [],

      // 任务提醒的PDF地址
      pdfPath: null,

      // 是否锁定
      isLock: false,
    };
  },

  created() {
    // this.data_id = "283e4c1ed46644c1930618064025b028";
    // this.mettingID = 1000;
    // this.getTableDataList();

    this.data_id = qs.parse(window.location.search).data_id;

    if (qs.parse(window.location.search).meeting_id && qs.parse(window.location.search).meeting_id != "null") {
      this.mettingID = Number(qs.parse(window.location.search).meeting_id);
      this.getTableDataList();
      this.getTaskListData();
    } else {
      creatMetting(qs.parse(window.location.search).data_id).then((res) => {
        this.mettingID = Number(res.data.conference_id);
        this.getTableDataList();
        this.getTaskListData();
      });
    }

    this.$nextTick(() => {
      let _mettingAll = document.getElementById("ry_mettingAll");
      _mettingAll.parentNode.style.width = "100%";
      _mettingAll.parentNode.style.height = "100%";
      _mettingAll.parentNode.parentNode.parentNode.parentNode.style.height = "100%";
      _mettingAll.parentNode.parentNode.parentNode.parentNode.parentNode.style.width = "100%";
      _mettingAll.parentNode.parentNode.parentNode.parentNode.parentNode.style.height = "100%";
      _mettingAll.parentNode.parentNode.parentNode.parentNode.parentNode.style.position = "absolute";
    });
  },

  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
  },

  methods: {
    // 获取UUID
    get_UUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(16);
      });
    },

    // 表格行样式
    tableRowClassName(row) {
      if (row.row.status == 0) {
        return {
          color: "red",
        };
      } else {
        return {
          color: "#fff",
        };
      }
    },

    // 表格行选中
    tableSelected(row, index) {
      if (row.status == 0) {
        return false; //可选择
      } else {
        return true; //不可选择
      }
    },

    // 退出会议
    loginOut() {
      let dataForm = {
        conference_id: this.mettingID,
        data_id: this.data_id,
        type: 0,
      };
      finishMetting(dataForm).then((res) => {
        this.closeWindow();
      });
    },

    // 关闭页签
    closeWindow() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        window.location.href = "about:blank";
        window.close();
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    },

    // 查询
    searchTabelData() {
      if (this.isLock) {
        this.$Notification.closeAll();
        this.$notify({
          title: "会议已锁定",
          type: "warning",
          duration: 0,
        });
        return;
      }

      if (this.searchData) {
        this.tableDataShow = this.tableData.filter((x) => {
          return x.name.includes(this.searchData.toString());
        });
      } else {
        this.getTableDataList();
      }
    },

    // 新增
    addSourcesData() {
      if (this.isLock) {
        this.$Notification.closeAll();
        this.$notify({
          title: "会议已锁定",
          type: "warning",
          duration: 0,
        });
        return;
      }
      this.addSourcesDialog = true;
    },

    // 保存资源列表
    saveAddSourcesData() {
      this.addSourcesDialog = false;
      let dataForm = JSON.parse(JSON.stringify(this.addSourcesDataList));

      dataForm.forEach((item) => {
        item.data_id = null;
        item.parent_id = this.data_id;
        saveAddResources(this.mettingID, item).then((res) => {
          this.$message.success("新增成功");
          this.getTableDataList();
        });
      });
    },

    // 新增表格行
    addTableRow() {
      if (this.addSourcesDataList.length > 4) {
        return;
      }
      this.addSourcesDataList.push({ data_id: this.get_UUID(), parent_id: "", name: "", model: "", type: "", connection_identifier: "", user_name: "", password: "", KVParams: {} });
    },

    // 表格删除行
    delectTableRow(row) {
      this.addSourcesDataList.forEach((item, index) => {
        if (item.data_id == row.data_id) {
          this.addSourcesDataList.splice(index, 1);
        }
      });
    },

    // 打开弹窗
    openLoopDialog() {
      if (this.isLock) {
        this.$Notification.closeAll();
        this.$notify({
          title: "会议已锁定",
          type: "warning",
          duration: 0,
        });
        return;
      }
      this.loopDialog = true;
      this.selectedTableDeleteData = [];
    },

    // 关闭弹窗
    closeLoopDialog() {
      this.loopDialog = false;
      this.oneLoopTimes = 8;
    },

    // 录播
    changeSwitch() {
      let dataForm = {
        conference_id: this.mettingID,
        status: "",
      };
      this.mettingSwitch ? (dataForm.status = 1) : (dataForm.status = 0);
      record(dataForm).then((res) => {
        this.mettingSwitch ? this.$message.success("录制中") : this.$message.error("停止录制");
      });
    },

    // 获取视频资源列表
    getTableDataList(type) {
      let dataForm = {
        conference_id: this.mettingID,
        external: "",
      };

      getVideoList(dataForm).then((res) => {
        if (type == "refresh") {
          this.$message.success("刷新成功");
        }

        this.mettingTitle = res.data.meeting_room_name;
        this.mettingSwitch = res.data.is_recording;
        this.tableData = res.data.terminal_list;
        this.selectedTableData = res.data.terminal_list;

        let filterList = [];
        let dataList = JSON.parse(JSON.stringify(res.data.terminal_list));
        dataList.forEach((item, index) => {
          if (item.type == 0) filterList.push(item);
        });

        let filterList2 = [];
        let dataList2 = JSON.parse(JSON.stringify(res.data.terminal_list));
        dataList2.forEach((item, index) => {
          if (item.type == 0) filterList2.push(item);
        });

        this.tableDataShow = JSON.parse(JSON.stringify(filterList));
        this.selectedTableDataShow = JSON.parse(JSON.stringify(filterList2));

        if (!this.isLoadinglocalVedio) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].is_main != true) {
              let page_server = "http://114.115.248.69";
              let video_src = this.tableData[i].video_url;
              let video_size = "445x266";
              document.getElementById("rtsp_player_local").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);
              this.isLoadinglocalVedio = true;
              return;
            }
          }
        }
      });
    },

    // 弹窗确认按钮
    saveLoopData() {
      this.loopDialog = false;
      this.saveLoopDataList = this.loopTableData;

      if (this.oneLoopType) {
        this.selectedTableDeleteData = [...new Set(this.selectedTableDeleteData)];
        if (JSON.stringify(this.selectedTableDeleteData) != "[]") {
          let dataForm = {
            terminal_ids: this.selectedTableDeleteData,
            conference_id: this.mettingID,
          };
          skipLoop(dataForm).then((res) => {
            // let page_server = "http://114.115.248.69";
            // let video_src = res.data.current_url;
            // let video_size = "445x266";
            // document.getElementById("rtsp_player_handle").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);
            // let page_server2 = "http://114.115.248.69";
            // let video_src2 = res.data.next_url;
            // let video_size2 = "445x266";
            // document.getElementById("rtsp_player_watch").src = page_server2 + "/embed?s=" + window.btoa(video_src2) + "&r=" + window.btoa(video_size2);
          });
        }
        this.loopTimer && clearInterval(this.loopTimer);
        this.loopTimer = null;

        this.intervalLoop();
      }
    },

    // 表格数据改变
    tableDataChange(data) {
      this.tableSelectData = data;
    },

    // 弹窗选中数据改变
    selectTabelDataChange(data) {
      this.selectDataList = data;
    },
    // 弹窗选中数据
    selectTableRow(row) {
      let showArr = this.selectedTableDataShow;
      let dataArr = this.selectedTableData;

      showArr.forEach((e, i) => {
        if (row.id == e.id) {
          showArr.splice(i, 1);
        }
      });

      dataArr.forEach((e, i) => {
        if (row.id == e.id) {
          dataArr.splice(i, 1);
        }
      });

      this.selectedTableDataShow = showArr;

      this.loopTableData.push(row);
    },
    // 弹窗批量选中
    handleSelectBatchData() {
      if (JSON.stringify(this.selectDataList) != "[]") {
        let showArr = this.selectedTableDataShow;
        let dataArr = this.selectedTableData;
        this.selectDataList.forEach((item, index) => {
          showArr.forEach((e, i) => {
            if (item.id == e.id) {
              showArr.splice(i, 1);
            }
          });

          dataArr.forEach((e, i) => {
            if (item.id == e.id) {
              dataArr.splice(i, 1);
            }
          });

          this.selectedTableDataShow = showArr;

          this.loopTableData.push(item);
        });
      }
    },

    // 弹窗轮询数据改变
    loopTabelDataChange(data) {
      this.loopDataList = data;
    },
    // 弹窗剔除数据
    deleteTableRow(row) {
      let arr = this.loopTableData;
      arr.forEach((e, i) => {
        if (row.id == e.id) {
          arr.splice(i, 1);
        }
      });
      if (row.type == 0) {
        this.selectedTableDataShow.push(row);
      }
      this.selectedTableData.push(row);
      this.selectedTableDeleteData.push(row.id);
    },
    // 弹窗批量剔除
    handleLoopBatchData() {
      if (JSON.stringify(this.loopDataList) != "[]") {
        let arr = this.loopTableData;
        this.loopDataList.forEach((item, index) => {
          arr.forEach((e, i) => {
            if (item.id == e.id) {
              arr.splice(i, 1);
            }
          });
          if (item.type == 0) {
            this.selectedTableDataShow.push(item);
          }
          this.selectedTableData.push(item);
          this.selectedTableDeleteData.push(item.id);
        });
      }
    },

    // 触发图标事件
    handleTabelIcon(row, type, status) {
      if (this.isLock) {
        this.$Notification.closeAll();
        this.$notify({
          title: "会议已锁定",
          type: "warning",
          duration: 0,
        });
        return;
      }
      let dataForm = {
        conference_id: this.mettingID,
        terminal_id: row.id,
      };
      // 快速发言
      if (type == "handleSay") {
        let page_server = "http://114.115.248.69";
        let video_src = row.video_url;
        let video_size = "445x266";

        document.getElementById("rtsp_player_handle").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);

        say(dataForm).then((res) => {});
      }
      // 重呼
      if (type == "recall") {
        dataForm.external = "";
        recall(dataForm).then((res) => {
          this.$message.success("呼叫成功");
          this.getTableDataList();
        });
      }
      // 主席设置
      if (type == "isMain") {
        changeMain(dataForm).then((res) => {
          this.$message.success("设置主席成功");
        });
      }
      // 麦克风控制
      if (type == "micCall") {
        dataForm.status = status;
        micCall(dataForm).then((res) => {});
      }
      // 扬声器控制
      if (type == "loudspeaker") {
        dataForm.status = status;
        loudspeaker(dataForm).then((res) => {});
      }
      // 预监
      if (type == "preview") {
        let page_server = "http://114.115.248.69";
        let video_src = row.video_url;
        let video_size = "445x266";

        document.getElementById("rtsp_player_watch").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);

        let form = {
          conference_id: this.mettingID,
          terminal_list: [row.id],
        };
        preview(form).then((res) => {});
      }
      // 结束会议
      if (type == "handup") {
        let form = {
          conference_id: this.mettingID,
          terminal_id: row.id,
        };
        hangup(form).then((res) => {
          this.$message.success("已挂断");
        });
      }

      setTimeout(() => {
        this.getTableDataList();
      }, 100);
    },

    // 触发工具栏事件
    handleToolIcon(type) {
      if (type == "unLock") {
        this.isLock = false;
      }
      if (this.isLock) {
        this.$Notification.closeAll();
        this.$notify({
          title: "会议已锁定",
          type: "warning",
          duration: 0,
        });
        return;
      }
      let dataForm = {
        conference_id: this.mettingID,
      };
      if (type == "recall") {
        let terminalIdList = [];

        if (JSON.stringify(this.tableSelectData) != "[]") {
          this.tableSelectData.forEach((item, index) => {
            if (item.status != 1) {
              terminalIdList.push(item.id);
            }
          });

          dataForm.terminal_id = terminalIdList.join(",");

          dataForm.external = "";
          if (JSON.stringify(terminalIdList) != "[]") {
            recall(dataForm).then((res) => {
              this.$message.success("呼叫成功");
              this.getTableDataList();
            });
          } else {
            this.$message.warning("请勿重复呼叫");
          }
        } else {
          this.$message.warning("请勾选需要操作的数据");
        }
      }
      if (type == "hangup") {
        let terminalIdList = [];
        if (JSON.stringify(this.tableSelectData) != "[]") {
          this.tableSelectData.forEach((item, index) => {
            if (item.status != 0) {
              terminalIdList.push(item.id);
            }
          });

          dataForm.terminal_id = terminalIdList.join(",");

          if (JSON.stringify(terminalIdList) != "[]") {
            hangup(dataForm).then((res) => {
              this.$message.success("已结束呼叫");
              this.getTableDataList();
            });
          } else {
            this.$message.warning("数据已为挂断状态");
          }
        } else {
          this.$message.warning("请勾选需要操作的数据");
        }
      }
      if (type == "oneLoop") {
        let terminalIdList = [];
        if (JSON.stringify(this.saveLoopDataList) != "[]") {
          if (!this.oneLoopType) {
            this.$message.success("开始轮询");
          }

          this.saveLoopDataList.forEach((item, index) => {
            terminalIdList.push(item.id);
          });

          dataForm.terminal_list = terminalIdList;
          dataForm.loop_interval = this.oneLoopTimes;
          dataForm.external = "";

          oneLoop(dataForm).then((res) => {
            let page_server = "http://114.115.248.69";
            let video_src = res.data.current_url;
            let video_size = "445x266";

            document.getElementById("rtsp_player_handle").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);

            let page_server2 = "http://114.115.248.69";
            let video_src2 = res.data.next_url;
            let video_size2 = "445x266";

            document.getElementById("rtsp_player_watch").src = page_server2 + "/embed?s=" + window.btoa(video_src2) + "&r=" + window.btoa(video_size2);

            this.oneLoopType = true;
          });

          this.intervalLoop();
        } else {
          this.$message.warning("请选择需要轮询的数据");
        }
      }
      if (type == "stopOneLoop") {
        this.oneLoopType = false;
        this.loopTimer && clearInterval(this.loopTimer);
        this.loopTimer = null;
        this.$message.success("已结束轮询");
      }
      if (type == "lock" || type == "unLock") {
        type == "lock" ? (dataForm.status = 1) : (dataForm.status = 0);
        dataForm.external = "";
        if (type == "lock") {
          this.isLock = true;
          this.$Notification.closeAll();
          this.$notify({
            title: "会议已锁定",
            type: "warning",
            duration: 0,
          });
        } else {
          this.$Notification.closeAll();
          this.$notify({
            title: "已解除会议锁定",
            type: "success",
          });
        }
        lockMetting(dataForm).then((res) => {});
      }
    },

    // 轮询数据
    intervalLoop() {
      this.loopTimer && clearInterval(this.loopTimer);
      this.loopTimer = null;

      let dataForm = {
        conference_id: this.mettingID,
      };

      this.loopTimer = setInterval(() => {
        let terminalIdList = [];
        this.saveLoopDataList.forEach((item, index) => {
          terminalIdList.push(item.id);
        });

        dataForm.terminal_list = terminalIdList;
        dataForm.loop_interval = this.oneLoopTimes;
        dataForm.external = "";

        if (JSON.stringify(terminalIdList) != "[]") {
          oneLoop(dataForm).then((res) => {
            let page_server = "http://114.115.248.69";
            let video_src = res.data.current_url;
            let video_size = "445x266";

            document.getElementById("rtsp_player_handle").src = page_server + "/embed?s=" + window.btoa(video_src) + "&r=" + window.btoa(video_size);

            let page_server2 = "http://114.115.248.69";
            let video_src2 = res.data.next_url;
            let video_size2 = "445x266";

            document.getElementById("rtsp_player_watch").src = page_server2 + "/embed?s=" + window.btoa(video_src2) + "&r=" + window.btoa(video_size2);
          });
        }
      }, this.oneLoopTimes * 1000);
    },

    // 获取任务提醒数据
    getTaskListData() {
      let dataForm = {
        data_id: this.data_id,
      };
      taskReminder(dataForm)
        .then((res) => {
          let pdfUrl = window.URL.createObjectURL(res.data);
          this.pdfPath = pdfUrl;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },

    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },

    Event_Center_getName() {
      return "应用二开测试";
    },
  },

  destroyed() {
    this.loopTimer && clearInterval(this.loopTimer);
    this.loopTimer = null;

    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
// 会议整体
.metting_all {
  width: 100%;
  height: 100%;
  padding: 30px 10px 0 10px;
  background: #001529;
  box-sizing: border-box;
  z-index: -1;
}
// 会议
.metting {
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 15px;
  box-sizing: border-box;
}
// 会议位置标题
.metting_title {
  width: 99%;
  box-sizing: border-box;
  position: absolute;
  top: 8px;
  color: #ffffff;
  font-size: 21px;
  display: flex;
  align-items: center;
}
// 退出icon
.metting_title img {
  cursor: pointer;
  z-index: 2;
  position: absolute;
  right: 0;
  top: 3px;
  width: 26px;
  height: 26px;
}
// 录播状态
.metting_type {
  font-size: 17px;
  margin-left: 10px;
}
// 录播开关
.metting_switch {
  margin-top: 4px;
  margin-left: 10px;
}
// 会议左侧
.metting_left {
  width: 80%;
  height: 100%;
  box-sizing: border-box;
  margin-right: 15px;
  // 左侧表格
  .metting_table {
    width: 100%;
    height: 64%;
    border: 1px solid #00a6d3;
    border-top-left-radius: 20px;
  }
  // 表格标题
  .table_title {
    margin-left: -3px;
    background: url("./assets/bg_title@2x.png") no-repeat;
    color: #ffffff;
    height: 35px;
    line-height: 35px;
    width: 40%;
    font-size: 15px;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .table_title img:first-child {
    margin: 3px 4px 0 -4px;
    width: 28px;
    height: 28px;
  }
  .table_img img {
    cursor: pointer;
    z-index: 2;
    margin-top: 7px;
    width: 26px;
    height: 26px;
  }
  .metting_searchTip {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .refreshIcon {
    color: #fff;
    font-size: 20px;
    margin-right: 20px;
    cursor: pointer;
  }
  // 搜索
  .metting_search {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 10px 20px;
    width: 28%;
    /deep/ .el-button {
      margin: 0;
      height: 35px;
      line-height: 35px;
      border-radius: 0;
      padding: 0 15px;
      background: #032037;
      border-color: #014e70;
      color: #00b8e2;
    }
  }
  .radioSearch_color {
    /deep/ .el-radio-button__inner {
      color: #1985e1;
    }
  }
  // 搜索框样式
  /deep/ .el-input__inner {
    height: 35px;
    border-radius: 0;
    background: #04162e;
    border-color: #024b6b;
    color: #ffffff;
  }
  // Table样式配置
  /deep/ .el-table {
    width: 100%;
    height: 100%;
    background: none;
  }
  /deep/ .el-table__header .cell {
    color: #1985e1;
  }
  /deep/ .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #013153;
  }
  /deep/ .gutter {
    background: rgb(1, 38, 65);
  }
  // 滚动条样式
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 0;
  }
  // 左侧下部
  .metting_live {
    height: 33%;
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 左下直播布局
  .live_col {
    width: 33.33%;
    height: 100%;
    border: 1px solid #00a6d3;
    margin-left: 15px;
    display: flex;
    background: #002c47;
  }
  // 左下直播标题
  .live_title {
    width: 26px;
    height: 60%;
    box-sizing: border-box;
    background: linear-gradient(to bottom, #014664, rgba(0, 78, 120, 0.1));
    border-top-left-radius: 5px;
    padding-top: 20px;
    padding-right: 4px;
    font-size: 14px;
    color: #ffffff;
    writing-mode: vertical-rl;
    letter-spacing: 6px;
    display: flex;
    position: relative;
  }
  .live_title img:first-child {
    margin: -15px 0 12px 2px;
  }
  .live_title img:last-child {
    width: 45px;
    position: absolute;
    top: 65%;
    right: -30%;
    -webkit-transform: scaleY(-1);
    -o-transform: scaleY(-1);
    transform: scaleY(-1);
    -webkit-transform: rotate(90deg);
  }
  .metting_live .live_col:first-child {
    margin-left: 0;
    .live_title img:first-child {
      margin: -15px 0 6px 2px;
    }
  }
  // 直播视频
  .live_vedio {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    height: 100%;
  }
  .live_vedio img {
    width: 100%;
    height: 100%;
  }
}
// 会议右侧
.metting_right {
  width: 19%;
  height: 100%;
  box-sizing: border-box;
  // 工具栏
  .metting_tool,
  .metting_task {
    width: 100%;
    height: 37%;
    border: 1px solid #00a6d3;
    border-top-left-radius: 12px;
  }
  .metting_tool {
    background: #002c47;
  }
  /deep/ .el-row {
    margin: 0 !important;
  }
  // 任务提醒
  .metting_task {
    margin-top: 10px;
    height: 60%;
  }
  // 工具栏标题
  .tool_title,
  .task_title {
    background: url("./assets/bg_title.png") no-repeat;
    color: #ffffff;
    height: 30px;
    line-height: 30px;
    width: 100%;
    font-size: 15px;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .tool_title img:first-child {
    margin: 3px 4px 0 -15px;
    width: 28px;
    height: 28px;
  }
  .task_title img:first-child {
    margin: 3px 4px 0 -15px;
    width: 28px;
    height: 28px;
  }
  // 工具栏布局
  .tool_col {
    text-align: center;
    margin-top: 10px;
  }
  // 工具栏图标
  .tool_icon {
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 工具栏图标边框
  .icon_div {
    cursor: pointer;
    z-index: 2;
    border: 1px solid #ffffff;
    padding: 3px 3px 0 3px;
  }
  // 工具栏标题
  .tool_col span {
    font-size: 12px;
    color: #ffffff;
  }
  // 工具栏图片
  .tool_col img {
    width: 30px;
    height: 30px;
  }
  // 任务列表
  .task_list {
    box-sizing: border-box;
    width: 100%;
    height: 94%;
  }
  .task_iframe {
    width: 100%;
    height: 100%;
  }
  // 滚动条样式
  /deep/ .task_list::-webkit-scrollbar {
    width: 0;
  }
}
// 会议弹窗
.metting_dialog {
  .dialog_title {
    padding-bottom: 5px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .el-button {
      padding: 8px 24px !important;
    }
    /deep/ .el-button:first-child span {
      color: #111;
    }
  }
  .dialog_input_number {
    display: flex;
    align-items: center;
    /deep/ .el-input__inner,
    /deep/ .el-input-number__decrease,
    /deep/ .el-input-number__increase {
      background: #002c47;
      color: #ffffff;
      border-color: #00a6d3;
    }
  }
  .dialog_input_number div {
    margin-right: 20px;
    color: #ffffff;
  }
  .dialog_table {
    margin-top: 20px;
    width: 100%;
    height: 100;
    display: flex;
  }
  .dialog_table_select {
    width: 49%;
    margin-right: 2%;
  }
  .dialog_table_loop {
    width: 49%;
  }
  .dialog_table_title {
    height: 30px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    margin-bottom: 8px;
    div:first-child {
      display: flex;
      align-items: center;
    }
    /deep/ .el-button {
      padding: 6px 24px;
    }
  }
  .title_line {
    height: 20px;
    width: 4px;
    background: #00a6d3;
    margin-right: 10px;
  }
  .dialog_table_table {
    border: 1px solid #00a6d3;
  }
  /deep/ ::before {
    height: 0;
  }
  /deep/ .gutter {
    background: rgb(1, 38, 65);
  }
  /deep/ .el-dialog__header {
    padding: 0 !important;
  }
  /deep/ .el-dialog__body {
    padding-top: 15px !important;
    background: #002c47;
  }
  /deep/ .el-input__inner {
    background: #001529;
    border-color: #014e70;
    color: #ffffff;
  }
  // 滚动条样式
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 0;
  }
}
.addSources_diaog {
  /deep/ .el-dialog__header {
    padding: 20px 20px 15px !important;
    border-bottom: 1px solid #fff;
    span {
      font-size: 18px !important;
    }
  }
}
.dialog_title_label {
  font-size: 18px !important;
}
.dialog_title_button {
  /deep/ .el-button span {
    font-size: 14px !important;
  }
}
.dialog_firstRow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addSources_dialog_handlebutton {
  width: 100%;
  display: flex;
}
.add_button {
  width: 100%;
  margin: 10px 0;
  background: #002c47;
  color: #ffffff;
}
// 新增资源弹窗
.addSources_dialog_button {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .el-button {
    padding: 8px 24px !important;
  }
  /deep/ .el-button:first-child {
    margin-right: 20px;
  }
}

.radioSearch2_color {
  /deep/ .el-radio-button__inner {
    color: #1985e1 !important;
  }
}

/deep/.el-dialog {
  .el-dialog__header {
    background: #171f34;
    span {
      color: #ffffff;
    }
  }
  .el-dialog__body {
    background: #171f34;
    color: #ffffff;
  }
  .el-dialog__footer {
    background: #171f34;
  }
}

/deep/ .dialog_table ::before {
  height: 0;
}
/deep/ .metting_table ::before {
  height: 0;
}
/deep/ .el-table {
  width: 100%;
  height: 100%;
  background: none;
}
/deep/ .el-table tr {
  background: none;
}
/deep/ .el-table tbody tr:hover > td {
  background: #171f34 !important;
}
</style>
