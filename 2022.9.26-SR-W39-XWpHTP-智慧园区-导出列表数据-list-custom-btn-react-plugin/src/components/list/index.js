import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { message } from "antd";

import { downloadDocx } from "../../api/asset";

import "./index.less";

const List = (props) => {
  useEffect(() => {
    handleClick();
  }, []);

  // 下载模板方法
  const AsciiToString = (asccode) => {
    return String.fromCharCode(asccode);
  };
  // 下载模板方法
  const UrlDecode = (zipStr) => {
    var uzipStr = "";
    for (var i = 0; i < zipStr.length; i += 1) {
      var chr = zipStr.charAt(i);
      if (chr === "+") {
        uzipStr += " ";
      } else if (chr === "%") {
        var asc = zipStr.substring(i + 1, i + 3);
        if (parseInt("0x" + asc) > 0x7f) {
          uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
          i += 8;
        } else {
          uzipStr += AsciiToString(parseInt("0x" + asc));
          i += 2;
        }
      } else {
        uzipStr += chr;
      }
    }
    return uzipStr;
  };

  // 导出按钮
  const handleClick = () => {
    let idsList = [];

    console.log("props", props.customParams);

    if (props.dataSource.length) {
      props.dataSource.forEach((item, index) => {
        if (item.length) {
          item.forEach((e, i) => {
            idsList.push(e.id);
          });
        }
      });
    } else {
      props.allParams.allComponentList.forEach((item, index) => {
        idsList.push(item.id);
      });
    }

    let dataForm = {
      filePath: props?.customParams?.uploadFile?.file?.response?.result[0],
      mainAsset: props?.customParams?.mainAsset,
      childAsset: props?.customParams?.childAsset,
      ids: idsList,
    };

    // 下载模板
    downloadDocx(dataForm)
      .then((res) => {
        const temp = res.headers["content-disposition"].split("=")[1]; // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
        let iconv = require("iconv-lite");
        iconv.skipDecodeWarning = true; //忽略警告
        let fileName = iconv.decode(temp, "utf-8");
        const _res = res.data;
        let blob = new Blob([_res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        let fileNameNew = UrlDecode(fileName);
        downloadElement.download = fileNameNew; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象

        message.success("导出成功");
      })
      .catch((err) => {
        message.warning("导出失败");
      });
  };

  return <></>;
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
