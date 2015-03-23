Session.set('stories',[])

Template.getAllFromSources.events({
    'click #btnGetAll' : function(e,t){
        e.preventDefault();
        Session.set('stories',[]);
        var page = $('#toPage').val(),
            start = $('#fromPage').val() || 0;
        if(page){
            for(var i = start ; i <=page ; i++){
                Meteor.call('xray_az_sstruyen_stories',i, function(err,data){
                    var stories = Session.get('stories');
                    stories = stories.concat(data);
                    console.log(i);
                    Session.set('stories',stories);
                });
            }
        }
    },
    'click #btnImport' : function(e,t){
        var stories = Session.get('stories');
        if(stories) {
            Meteor.call('import_stories',stories,function(err,rs){
                console.log(rs+'/'+ _.size(stories));
            })
        }
    }
})