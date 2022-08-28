// =============== Dependence =================//
const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");

//================ Create http server ================//
const httpSever = http.createServer((req, res) => {
  const headers = req.headers;
  const parseUrl = url.parse(req.url, true);
  const pathName = parseUrl.pathname;
  const trimPath = pathName.replace(/^\/+|\/+$/g, "");

  const queryObject = parseUrl.query;
  const method = req.method.toLowerCase();

  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.end("end", () => {
    buffer += decoder.end();
    const chosenHandler =
      typeof router[trimPath] !== "undefined"
        ? router[trimPath]
        : handlers.notFound;

    const data = {
      trimPath,
      queryObject,
      method,
      headers,
      payload: JSON.parse(buffer),
    };

    chosenHandler(data, (statusCode, payload) => {
      const payloadString = JSON.stringify(payload);
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};
      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});
