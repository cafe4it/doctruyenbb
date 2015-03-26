Session.set('stories',[])
Template.getAllFromSources.helpers({
    result : function(){
        return {
            i : Session.get('result_i'),
            s : Session.get('result_s')
        }
    }
})

Template.getAllFromSources.events({
    'click #btnGetAll' : function(e,t){
        e.preventDefault();
        Session.set('stories',[]);
        Session.set('result_i','0');
        Session.set('result_s','0');
        var page = $('#toPage').val(),
            start = $('#fromPage').val() || 0;
        if(page && start){
            for(var i = start ; i <=page ; i++){
                Meteor.call('xray_az_sstruyen_stories',i, function(err,data){
                    var stories = Session.get('stories');
                    stories = stories.concat(data);
                    Session.set('stories',stories);
                    Session.set('result_s',_.size(stories));
                    $('#btnTransfer').click();
                });
                Meteor.setTimeout(500)
            }
/*            Meteor.call('importio_sstruyen_listtruyen',start,page,function(err,rs){
                var items = _.map(rs,function(obj){
                    var isHot = _.isUndefined(obj.is_hot) || false,
                        isFull = _.isUndefined(obj.is_full) || false,
                        chapters = obj.info1.replace(/[^0-9]/g, '') || 0,
                        tags = obj.info1.substring(0, obj.info1.indexOf('|')-1) || '',
                        title = obj.title.trimLeft().trimRight();
                    var categories = _.map(tags.split(','),function(t){return vietnameseToSlug2(t,"")});
                    var newObj = _.extend(obj, {title : title,is_hot : isHot, is_full : isFull, chapters : chapters, tags : categories});
                    return _.omit(newObj,'info1');
                })
                Session.set('stories',items);
                Session.set('result','0/'+ _.size(items));
                $('#btnImport').click();
            })*/
        }
    },
    'click #btnImport' : function(e,t){
        var stories = Session.get('stories');
        if(stories) {
            Meteor.call('import_stories',stories,function(err,rs){
                Session.set('result_i',_.size(stories))
            })
        }
    },
    'click #btnTransfer' : function(e,t){
        e.preventDefault();
        var stories = Session.get('stories');
        if(stories && _.size(stories) >0){
            Meteor.call('import_stories2',stories,function(err,rs){
                Session.set('result_i',_.size(stories))
            })
        }
    },
    'click #btnUpdateStories' : function(e,t){
        e.preventDefault();
        //var items = Stories2.find({is_finished : true}).fetch();
        Meteor.call('update_sstruyen_onlyfull',function(err,data){
            console.log(data);
        })
    }
})