const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const { init: initDB, Counter } = require("./db");
const https = require('https');
const url = require('url');
const superagent = require('superagent');

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/list", async (req, response) => {
    let data = '';
    https.get('https://new-cnbeta.schrodingersclub.workers.dev/touch/default/timeline.json', (res) => {

        // 当接收到数据时，将其添加到 data 变量中
        res.on('data', (chunk) => {
            data += chunk;
        });

        // 当请求结束时，打印响应的数据
        res.on('end', () => {
            let jsonData = JSON.parse(data);
            console.log(jsonData);
            response.send({
                jsonData
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.get("/api/item", async (req, response) => {
    let urlObj = url.parse(req.url, true);
    let query = urlObj.query;
    let data = '';
    https.get('https://new-cnbeta.schrodingersclub.workers.dev/touch/articles/' + query.id + '.htm', (res) => {

        // 当接收到数据时，将其添加到 data 变量中
        res.on('data', (chunk) => {
            data += chunk;
        });

        // 当请求结束时，打印响应的数据
        res.on('end', () => {
            response.send({
                data
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.get("/api/testlist", async (req, response) => {
    console.log("handle the test...")
    let urlObj = url.parse(req.url, true);
    let query = urlObj.query;
    let data = '';
    https.get(query.url, (res) => {

        // 当接收到数据时，将其添加到 data 变量中
        res.on('data', (chunk) => {
            console.log(chunk)
            data += chunk;
        });

        // 当请求结束时，打印响应的数据
        res.on('end', () => {
            response.send({
                data
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});


app.get("/api/test-superagent", async (req, response) => {
    console.log("handle the superagent test...")
    let urlObj = url.parse(req.url, true);
    let query = urlObj.query;
    superagent
        .get(query.url)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('content-type', 'content-type')
        .set('User-Agent', 'PostmanRuntime/7.29.0')
        .end((err, res) => {
            // Calling the end function will send the request
            console.log(`error: ${err}`)
            response.send({
                res
            });
        })

});


app.get("/api/testlist", async (req, response) => {
    console.log("handling the test")
    let data = '';
    https.get('https://m.cnbeta.com.tw/touch/default/timeline.json', (res) => {

        // 当接收到数据时，将其添加到 data 变量中
        res.on('data', (chunk) => {
            data += chunk;
        });

        // 当请求结束时，打印响应的数据
        res.on('end', () => {
            response.send({
                data
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
    if (req.headers["x-wx-source"]) {
        res.send(req.headers["x-wx-openid"]);
    }
});

const port = process.env.PORT || 80;

async function bootstrap() {
    // await initDB();
    app.listen(port, () => {
        console.log("启动成功", port);
    });
}

bootstrap();
