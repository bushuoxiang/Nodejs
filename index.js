var express = require('express')
var bodyParser = require('body-parser')
var json = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended:false})
var MongoControl = require('./databasecontrol').MongoControl
var contact = new MongoControl('classTest','contact')

var app = express()

app.use(express.static('./static'))

//getAllContact     获取全部联系人   get
//search             搜索联系人      get
//addContact         添加联系人      post
//removeContact      删除联系人      post
//reviseContact     修改联系人       post
//


var handle500 = function(res){
    res.status(500).send('服务器错误')
}
app.get('/getAllContact',function(req,res){ 
    contact.find({},function(err,result){
        if(err){
            handle500(res)
            return

        }
        res.send(result)
    })
})
app.get('/search',function(req,res){
    var wd = req.query.wd
    var reg = new RegExp(wd,'i')
    contact.find(
       {
        $or:[
            {name:{$regex:reg}},
            {phoneNumber:{$regex:reg}}
        ]
       } ,function(err,result){
           if(err)return handle500(res)
           res.send(result)
       }
    )
})
app.get('/removeContact',function(req,res){
    var _id = req.query._id
    contact.removeById(_id,function(err,result){
        if(err) return handle500(res)
        res.send(result)
    })
})
app.post('/addContact',urlencodedParser,function(req,res){
    var {name,phoneNumber} = req.body
    var docs= {
        name : name,
        phoneNumber : phoneNumber
    }
    contact.insert(docs,function(err,result){
        if(err)return handle500(res)
        res.send({result:'ok'})
    })
})
app.post('/reviseContact',urlencodedParser,function(req,res){
    var {_id,name,phoneNumber} = req.body

    contact.insert(
        {
            name:name,
        phoneNumber:phoneNumber
        },function(err,result){
            if (err){
                handle500(err)
                console.log('修改联系人中插入出错');
                return
            } 
            contact.removeById(_id,function(error,result){
                if(error){
                    handle500(res)
                    console.log('修改联系人中删除旧数据出错')
                    return
                }
                res.send({result:'ok'})
            })

        }
    )
})
app.listen(3000)

