Session.set('stories',[])
Template.getAllFromSources.helpers({
    stories : function(){
        return Session.get('stories');
    }
})
Template.getAllFromSources.events({
    'click #btnGetAll' : function(e,t){
        e.preventDefault();
        var page = $('#toPage').val();
        console.log(page);
        if(page){
            for(var i = 0 ; i <page ; i++){
                Meteor.call('xray_az_sstruyen_stories',i, function(err,data){
                    var stories = Session.get('stories');
                    stories = stories.concat(data);
                    Session.set('stories',stories);
                })
            }
        }
    }
})