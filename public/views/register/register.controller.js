(function()
{
    angular
        .module("PassportApp")
        .controller("RegisterCtrl", RegisterCtrl);
        
    function RegisterCtrl($scope, $location, $rootScope, UserService, RegistrationService,  $log )
    {

        $scope.user = RegisterUtil.createRegistrationUser();

        $scope.checkEmailAvailable = function()
        {

            if( !UtilService.isValidEmail( $scope.user.username ) )
            {
                $scope.error = "Invalid email : Please make sure to input a valid email";
                return;
            }

            RegistrationService.isEmailAvailable( $scope.user.username );
        };

        $scope.keypress = function( event )
        {
            if( event.key === "Enter" )
            {
                $scope.register();
            }

        };


        $scope.register = function()
        {
            if( RegisterUtil.isReadyToRegister( $scope.user ) )
            {
                $log.info("User is ready to register");

            }
            else
            {
                $log.warn( "User not ready to register");
                $scope.error = RegistrationService.errorMessage( $scope.user );
            }
        };

        $scope.$on( RegistrationMessage.EMAIL_AVAILABLE_RESPONSE, function( msg, data )
        {
            if( data.available )
            {
                $('#username').removeClass('inputError');
            }
            else
            {
                $scope.error = "Email is already registered";
                $('#username').addClass('inputError');
            }
        });


        // function register(user)
        // {
        //     if(user.password != user.password2 || !user.password || !user.password2)
        //     {
        //         $scope.error = "Your passwords don't match";
        //     }
        //     else
        //     {
        //         UserService
        //             .register(user)
        //             .then(
        //                 function(response) {
        //                     var user = response.data;
        //                     if(user != null) {
        //                         $rootScope.currentUser = user;
        //                         $location.url("/profile");
        //                     }
        //                 },
        //                 function(err) {
        //                     $scope.error = err;
        //                 }
        //             );
        //     }
        // }
    }
})();
