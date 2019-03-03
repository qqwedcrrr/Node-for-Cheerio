const Koa = require('koa'),
    Router = require('koa-router'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    superagent = require('superagent'),
    videoModel = require('./database/model/model'),
    app = new Koa(),
    router = new Router();
require('superagent-charset')(superagent);
let arr;

mongoose.connect('mongodb://localhost:27017');
const con = mongoose.connection;
con.on('error', console.error.bind(console, '连接数据库失败'));
con.once('open',()=>{
    console.log('连接成功');
})

videoModel.remove({},function(err,res){
    console.log(res,'remove all');
})

setInterval(()=>{
    const url = 'https://koa.bootcss.com/';
    superagent.get(url)
        .charset('utf-8') //当前页面编码格式
        .end((err, sres) => { //页面获取到的数据
            let html = sres.text,
                $ = cheerio.load(html, {
                    decodeEntities: false
                }), //用cheerio解析页面数据
                obj = {},
                arr = [];
            videoModel.find({},function(err,res){
                console.log(res)
            })
            //下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
            $("h1").each((index, element) => {
                var $text = $(element).text();
                arr.push($text);
            });
            let newText = new videoModel({title:arr});
            newText.save();
        });
},5000)

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('[服务已开启,访问地址为：] http://127.0.0.1:3000/');
});