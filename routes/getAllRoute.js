GetAllController = RouteController.extend({
    template : 'getAllFromSources',

    fastRender : true
})

Meteor.startup(function () {
    Router.route('/quet-sach-moi-thu',{
        name : 'getAllFormSources',
        controller : GetAllController
    })
})