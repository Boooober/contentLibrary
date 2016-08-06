//App.User = (function(){
//    var storage = App.Helpers.storage('session'),
//        user;
//
//
//    function findUser(){
//        var session = storage.get();
//        if(!session) return;
//
//
//
//        return session.id;
//    }
//
//    function getUser(){
//        return user ? user : findUser();
//    }
//
//    // login/password
//    function setUser(id){
//        console.log('Setting user...');
//        user = _user;
//    }
//    return {
//        get: getUser,
//        set: setUser
//    }
//})();