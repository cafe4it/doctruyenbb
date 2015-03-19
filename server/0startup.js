if(Meteor.isServer){
    ImportIo_APIKEY = '8h8eOJzqfGqNVDBzlNkpG6Z575wV8Ac9PiQvcwlz6eAgRWPxbnxX39HlFRWwiByYnErUb4zUB2XF8aeP4+GL/Q==';
    sstruyen_listruyen_api = _.template('https://api.import.io/store/data/141078a6-2a27-4651-9486-b13b3ead8de7/_query?input/webpage/url=<%-url%>&_user=527f1e6d-aaea-4635-bb0a-bbf424fca203&_apikey=<%-apikey%>');
    Accounts.onCreateUser(function (option, user) {
        var roles = ['user'];
        if (user.username == 'nxcong' || user.username == 'admin' || user.username == 'administrator') {
            roles = ['admin', 'mod', 'user'];
        }
        //console.log(user);
        if (user.emails[0].address.indexOf('@guest.bb10.com') != -1) {
            roles = ['guest'];
        }
        _.extend(user, {'roles': roles});
        Roles.addUsersToRoles(user._id, roles);
        return user;
    });
}