GetAllController = RouteController.extend({
    template : 'getAllFromSources',
    waitOn : function(){
        return [Meteor.subscribe('categories'),Meteor.subscribe('authors')]
    },
    onAfterAction: function(){
        Session.set('stories',[]);
        Session.set('result_i','0');
        Session.set('result_s','0');
    },
    fastRender : true
})

Meteor.startup(function () {
    Router.route('/quet-sach-moi-thu',{
        name : 'getAllFormSources',
        controller : GetAllController
    })
})