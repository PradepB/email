var express=require('express');
var app=express();
var morgan=require('morgan');
var mongoose=require('mongoose');
var port = process.env.PORT || 5050;
var path=require('path');
var router=express.Router();
var bodyParser=require('body-parser');
var appRoutes = require('./app/routes/api')(router); 
var User=require('./app/models/user')
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', appRoutes);
app.use(express.static(__dirname + '/public'))
mongoose.connect('mongodb://localhost:27017/reset',function(err){
    if(err){
        console.log('error to connecet database'+err);
    }
    else{
        console.log('db connected');
    }
});

app.get('*',function(req,res){
    res.sendfile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(port,function(){
    console.log("running in " +port);
});

