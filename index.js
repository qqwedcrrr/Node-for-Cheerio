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
let index = 0;

mongoose.connect('mongodb://localhost:27017');
const con = mongoose.connection;
con.on('error', console.error.bind(console, '连接数据库失败'));
con.once('open',()=>{
    console.log('连接成功');
})

videoModel.remove({},function(err,res){
    console.log(res,'remove all');
})

let timer = setInterval(()=>{
    let url;
    if(index > 150){
        clearInterval(timer);
    }
    if(!index){
        url = 'https://www.tom589.com/guochanzipai/index.html';
    }else {
        url = `https://www.tom589.com/guochanzipai/index_${index}.html`
    }
    index+=1;
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
            $('.content_top .listBox').each((index, obj) => {
                const $this = $(obj);
                const mainInfo = $this.children('.v_name');
                const timeInfo = $this.children('.img_wrap');
                const timeLength = timeInfo.children('a').children('.v_time').text();
                const title = mainInfo.children('.v_name_info').children('a').attr('title');
                const id = mainInfo.children('.v_name_info').children('a').attr('href');
                let pv = mainInfo.children('p').text();
                pv = Number(pv.match(/[0-9]*$/)[0])
                const newText = new videoModel({
                    id: id,
                    title: title,
                    link: id,
                    pv: pv,
                    timeLength: timeLength,
                });
                newText.save();
            });
            videoModel
        });
},50)

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3001, () => {
    console.log('[服务已开启,访问地址为：] http://127.0.0.1:3001/');
});