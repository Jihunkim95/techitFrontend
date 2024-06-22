const mongoclient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const url = 'mongodb+srv://admin:1234@cluster0.gn2soht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','./views');

let mydb;
var mysql = require("mysql");
const { ObjectId } = require('mongodb');
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3274",
    database: "myboard"
})
mongoclient.connect(url)
    .then(client=>{
        mydb = client.db('myboard');

        app.listen(8080, function(){
            console.log("포트 8080 대기중")
        });
    console.log('몽고 성공')
}).catch(err => {
    console.log(err);
})

app.get('/list',function(req,res){
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
        res.render('list.ejs', { data : result });
    })
    // res.sendFile(__dirname + '/list.html');
    
});

app.get('/enter',function(req,res){
    res.sendFile(__dirname + '/enter.html');
});
//수정 조회
app.get('/edit/:id',function(req,res){
    req.params.id = new ObjectId(req.params.id);
    mydb
    .collection("post")
    .findOne({_id: req.params.id})
    .then((result)=> {
        console.log(result);
        res.render("edit.ejs",{data:result});
    });
});
// 수정 post
app.post('/edit',function(req,res){

    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    req.body.id = new ObjectId(req.body.id);
    mydb
    .collection("post")//updateOne(수정식별자, 수정값)
    .updateOne({_id : req.body.id}, {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}})
    .then((result) => {
        console.log("수정완료")
        res.redirect('list')
    })
    .catch((err) => {
        console.log(err);
    });
    
});


//
app.get('/content/:id',function(req,res){
    req.params.id = new ObjectId(req.params.id);
    mydb
    .collection("post")
    .findOne({_id: req.params.id})
    .then((result)=> {
        console.log(result);
        res.render("content.ejs",{data:result});
    });
    
});

app.post('/save',function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    //몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(
        {title : req.body.title, content : req.body.content, date : req.body.someDate}
    ).then(result => {
        console.log(result);
        console.log('데이터 추가성공')
    });
    ////MySQL DB에 데이터 저장하기
    // let sql = "insert into post(title, content, created) values (?,?,NOW())";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function(err, result){
    //     if(err) throw err;
    //     console.log('데이터 추가 성공');
    // });
    res.send('데이터 추가 성공')
    
})


// conn.connect();

// conn.query("select * from post",function(err, rows, fields){
//     if(err) throw err;
//     console.log(rows);

// })


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}
)