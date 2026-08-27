const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    require("http-proxy-middleware")({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
  app.use(
    "/uploads",
    require("http-proxy-middleware")({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
