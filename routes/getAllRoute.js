GetAllController = RouteController.extend({
    template : 'getAllFromSources',
    waitOn : function(){
        return [Meteor.subscribe('categories'),Meteor.subscribe('authors')]
    },
    fastRender : true
})

Meteor.startup(function () {
    Router.route('/quet-sach-moi-thu',{
        name : 'getAllFormSources',
        controller : GetAllController
    })
})