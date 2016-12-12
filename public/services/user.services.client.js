(function(){
    angular
        .module("PassportApp")
        .factory("UserService", UserService)
        .factory("RegistrationService", RegistrationService);


    function RegistrationService( $http, $rootScope )
    {


        this.isEmailAvailable = function( email )
        {
            var url = 'api/register/emailAvailable?username=' + email;

            $http.get(url).success( function( data )
            {
                console.log('about to call server with url : ' + url );
                $rootScope.$broadcast( RegistrationMessage.EMAIL_AVAILABLE_RESPONSE, data );
            });

        };

        this.errorMessage = function( user )
        {
           if( UtilService.isEmpty( user.firstName ) )
           {
               return "Please enter a valid firstname";
           }

           if( UtilService.isEmpty( user.lastName ) )
           {
               return "Please enter a valid lastname";
           }


           if( !UtilService.isValidEmail( user.username ) )
           {
               return "Email is not valid";
           }


           if( !RegisterUtil.isValidPassword( user.password ) )
           {
               return "Password is not valid";
           }

           if( !RegisterUtil.isValidPassword( user.confirmPassword ) )
           {
               return "Confirm Password is not valid";
           }

           if( !RegisterUtil.passwordsMatch( user.password, user.confirmPassword ) )
           {
               return "Passwords do not match";
           }

           console.log("ERROR ----> SHOULD NOT HAVE REACHED THIS CODE IN THE REGISTRATION_SERVICE user.services.clients.js");
           return "Invalid user have no reason why, should not be here after ifs";
        };

        return this;
    }

    function UserService($http) {
        var api = {
            login: login,
            logout: logout,
            register: register,
            findAllUsers: findAllUsers,
            deleteUser: deleteUser,
            updateUser: updateUser,
            createUser: createUser
        };

        return api;


        function register( user )
        {
            if( !RegisterUtil.isReadyToRegister( user ) )
            {
                // let controller know of error, or do somethign angular here
                return;
            }

            return $http.post("/api/register", user);
        }



        function logout() {
            return $http.post("/api/logout");
        }


        function createUser(user) {
            return $http.post('/api/user', user);
        }


        function updateUser(userId, user) {
            return $http.put('/api/user/'+userId, user);
        }


        function deleteUser(userId) {
            return $http.delete('/api/user/'+userId);
        }


        // TODO: no success function, going to need to fix this
        function findAllUsers() {
            return $http.get("/api/user");
        }


        // function register(user) {
        //     return $http.post("/api/register", user);
        // }


        function login(user) {
            return $http.post("/api/login", user);
        }
    }
})();