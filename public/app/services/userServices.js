angular.module('userServices',[])

.factory('User',function($http){
    userFactory={};
    userFactory.create=function(regData){
        return $http.post('/api/users',regData);
    }


    userFactory.acctiveAccount=function(token){
        return $http.put('/api/activate/' + token);
    }




    return userFactory;
});
