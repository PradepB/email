angular.module("mainController",['authServices'])
.controller("mainCtrl",function(Auth, $timeout, $location, $rootScope ){
 var app=this;
   var loadme=false;
$rootScope.$on('$routeChangeStart',function(){

if(Auth.isLoggedIn()){
//    console.log("success to login");
    app.isLoggedIn=true;
    Auth.getUser().then(function(data){
        //console.log(data.data.username);///its provided username..if u remove data.username it provide toke value
        app.username=data.data.username;
        app.loadme=true;
    })
}else{
    //console.log("error in login");
    app.isLoggedIn=false;
    app.username="";
    app.loadme=true;

}

});

   this. doLogin=function(loginData){
       app.loading=true;
       app.errorMsg=false;
       // console.log("login userdata submited");
        Auth.login(app.loginData).then(function(data){
            // console.log(data.data.success);
            // console.log(data.data.message);
            if(data.data.success){
                app.loading=false;
                app.successMsg=data.data.message;
                $timeout(function(){
                    $location.path('/about');
                    app.loginData="";
                    app.successMsg=false;
                },2000);
                
            }else{
                app.loading=false;
                app.errorMsg=data.data.message;
            }
        });
    };

    this.logout=function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        });
     }
   })


