import request from "./request";

export const getAssetJSONForProduct = (id) => request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = (id) => request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

export const downloadDocx = (dataForm) => request.post("/WisdomPark/exportPdf", dataForm, { responseType: "blob" });
