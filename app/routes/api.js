var User=require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'pradep';

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var client=require('nodemailer-smtp-transport');


module.exports=function(router){

//  var options = {
//    auth: {
//      api_user: 'meanstackman',
//      api_key: 'PAsswrd123!@#'
//    }
// }

//  var client = nodemailer.createTransport(sgTransport(options));

 var client = nodemailer.createTransport({
    host: 'secure.emailsrvr.com',
    port: 465,
     secure: true,
    
  auth: {
     user: 'webapps@eparampara.org',
     pass: 'ApPs52bWeDNc69'
   }
 });

// var smtpConfig = {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,


router.post('/users',function(req,res){
          var user=new User();
            user.username=req.body.username;
             user.password=req.body.password;
             user.email=req.body.email;
             user.temporarytoken =jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
     if(req.body.username==null||req.body.username==""||req.body.password==null||req.body.password==""||req.body.email==null||req.body.email==""){
     res.json({success:false,message:"username or email or password not provided"});
        }else{
         user.save(function(err){
            if(err){
            
              res.json({success:false,message:"user already created"});
             }else{
           var email = {
             from: 'webapps@eparampara.org',
             to: user.email,
             subject: 'Localhost Reset link',
             text: 'Hello ' + user.username + ', thank you for registering at localhost.com. Please click on the following link to reset http://localhost:5050/activate/' + user.temporarytoken,
             html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Thank you for registering at localhost:5050 Please click on the link below to reset:<br><br><a href="http://localhost:5050/reset/' + user.temporarytoken + '">http://localhost:5050/reset/</a>'
         };

            client.sendMail(email, function(err, info){
                 if (err ){
                     console.log(err);
                     }   
                   else {
                     console.log('Message sent: ' + info.response);
                     }
                });
              res.json({success:true,message:"user created link in mail"});
         }
      });
     }
});


router.post('/authenticate',function(req,res){
 User.findOne({username:req.body.username}).select('email password username').exec( function(err,user){
        if(err) throw err;
        if(!user){
            res.json({success:false,message:'not authenticate user'});
        }else if(user){

            if(req.body.password){
                 var validPassword=user.comparePassword(req.body.password);
            }else{
                  res.json({success:false,message:'no password'});
            }
  
            if(!validPassword){
                 res.json({success:false,message:'not authenticate password'});
            }else{
                var token=jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
                 res.json({success:true,message:'user authenticate ',token:token});
            }
        }
    });
});



router.put('/activate/:token',function(req,res){
    user.findOne({temporarytoken:req.param.token},function(err,user){
        if(err) throw err;
            var token= req.param.token;


               jwt.verify(token,secret,function(err,decoded){
            if(err) {
                res.json({success:false,message:'link expires'});
            }else if(!user){
                res.json({success:true,message:'link expires'});
            
            }else{

                user.temporarytoken=false;
                user.active=true;
                user.save(function(err){
                    if(err){
                        console.log(err);
                    }else{

         var email = {
             from: 'webapps@eparampara.org',
             to: user.email,
             subject: 'Localhost Activaion link',
             text: 'Hello ' + user.username + ',Acc activate',
             html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Acc activate'
         };

            client.sendMail(email, function(err, info){
                 if (err ){
                     console.log(err);
                     }   
                   else {
                     console.log('Message sent: ' + info.response);
                     }
                });
                      res.json({success:true,message:'Acc activate'});

                    }
                });                            
            }
        });
        
    });
})



router.use(function(req,res,next){
    var token=req.body.token || req.body.query || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,secret,function(err,decoded){
            if(err) {
                res.json({success:false,message:'error in token'});
            }else{
                req.decoded=decoded;
                next();
            }
        })
    }else{
        res.json({success:false,message:'no token'})
    }
})


router.post('/me',function(req,res){
   res.send(req.decoded);
})


return router;


}






