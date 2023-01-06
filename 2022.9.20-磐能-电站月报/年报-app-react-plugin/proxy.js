module.exports = {
  "/api": {
    // target: "http://10.15.111.12:12200/",
    target: "http://121.36.134.217:47264/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
