
var RegistrationMessage = new function()
{
    this.EMAIL_AVAILABLE_RESPONSE = "emailAvailableReturned";
};


var UtilService = new function()
{
    this.isValidEmail = function( email )
    {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test( email );
    };

    this.notEmpty = function( value )
    {
        return( value != null && value.trim().length > 0 );
    };

    this.isEmpty = function( value )
    {
        return !this.notEmpty( value );
    };
};

var RegistrationUser = function( firstname, lastname, username, password, confirmPassword )
{
    this.firstName = firstname;
    this.lastName = lastname;
    this.username = (username === null)?'': username;
    this.password = password;
    this.confirmPassword  = confirmPassword;
};


var RegisterUtil = new function()
{
    this.REQUIRED_PASSWORD_LENGTH = 6;

    this.isReadyToRegister = function( user )
    {
        return(
                UtilService.isValidEmail( user.username ) &&
                UtilService.notEmpty( user.firstName ) &&
                UtilService.notEmpty( user.lastName ) &&
                this.passwordsValidAndMatch( user )
              );
    };

    this.passwordsValidAndMatch = function( user )
    {
        return( this.isValidPassword( user.password ) &&
                this.isValidPassword( user.confirmPassword ) &&
                this.passwordsMatch( user.password, user.confirmPassword ) );

    };

    this.passwordsMatch = function( password1, password2 )
    {
        return ( password1.trim() === password2.trim() );
    };

    this.isValidPassword = function( password )
    {
        return ( UtilService.notEmpty(password) && password.trim().length >= this.REQUIRED_PASSWORD_LENGTH );
    };


    this.createRegistrationUser = function() { return new RegistrationUser(); };
};



Object.freeze( UtilService );
Object.freeze( RegisterUtil );
Object.freeze( RegistrationMessage );
