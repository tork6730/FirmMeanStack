// USER MODEL SET UP

// requirements
var mongoose      = require("mongoose");


// Create Schema
// =================================================================================================

module.exports = function() {


// User Schema
    var UserSchema = new mongoose.Schema(
        {
            username: String,
            password: String,
            google:   {
                id:    String,
                token: String
            },
            facebook:   {
                id:    String,
                token: String
            },
            firstName: String,
            lastName: String,
            email: String,
            roles: [String]
        }, {collection: "user"});

    var UserModel = mongoose.model('UserModel', UserSchema);

    // =============================================================================================

    var api = {
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUserByEmail: findUserByEmail,
        findUserById: findUserById,
        findAllUsers: findAllUsers,
        createUser: createUser,
        removeUser: removeUser,
        updateUser: updateUser,
        findUserByGoogleId: findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        getMongooseModel: getMongooseModel
    };

    return api;

    // find facebook user account id to authenticate
    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    // find google user account id to authenticate
    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    // update user by their id
    function updateUser(userId, user) {
        return UserModel.update({_id: userId}, {$set: user});
    }

    // remove user by their id
    function removeUser(userId) {
        return UserModel.remove({_id: userId});
    }

    // find all users who registered with our app
    function findAllUsers() {
        return UserModel.find();
    }


    function createUser(user) { return UserModel.create(user); }

    function findUserByEmail( email ) { return UserModel.findOne({email: email}); }

    // finding users by id that registered with our app
    function findUserByUsername(username) { return UserModel.findOne({username: username}); }

    function getMongooseModel() { return UserModel; }

    // find users by id
    function findUserById(userId) { return UserModel.findById(userId); }

    function findUserByCredentials(credentials) {
        return UserModel.findOne(
            {
                username: credentials.username,
                password: credentials.password
            }
        );
    }
};