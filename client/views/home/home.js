Template.home.created = function(){
    Session.set('title','Đọc truyện BB 10');
}

Template.home.helpers({
    sstruyen_categories : function(){
        return Categories.find();
    }
})

Template.home.events({
    'click a[id^="btn_"]': function (e, t) {
        e.preventDefault()
        if(e.currentTarget){
            var buttonId = jquerySelectorId({id: e.currentTarget.id}), button = $(buttonId), data_id = button.attr('data-id');
            Router.go('home_detail',{_id : data_id})
        }
    },
    'click #btn_updateCategories' : function(e,t){
        e.preventDefault();
        Meteor.call('update_sstruyen_categories',function(err,rs){
            console.log(rs);
        });
    }
});

Template.home_detail.created = function(){
    Session.set('title','Đọc truyện BB 10');
}

Template.display_stories.helpers({
    stories : function(){
        //return Session.get('stories')
    }
});

Template.home_detail.helpers({
    stories : function(){
        var stories = Stories2.find().fetch();
        Session.set('stories',stories);
        return Session.get('stories')
    },
    story_cover : function(){
        var cover = StoriesCover2.findOne(this.thumbnail).url();
        return cover;
    }
})

Template.home_detail.events({
    'click #btn_testio' : function(e,t){
        e.preventDefault()
        var category = Categories.findOne(Router.current().params._id);

        if(category){
            Meteor.call('importio_sstruyen_listtruyen',category.url,function(err,data){
                console.log(data)
            })
        }
    },
    'click #btn_getXRay' : function(e,t){
        e.preventDefault();
        Meteor.call('xray_az_sstruyen_stories', function(err,data){
            console.log(data);
        })
    },
    'click button[id^="btnTest_"]': function (e, t) {
        e.preventDefault();
        if(e.currentTarget){
            var buttonId = jquerySelectorId({id: e.currentTarget.id}), button = $(buttonId), data_id = button.attr('data-id');
            var story = Stories2.findOne(data_id);
            Meteor.call('xray_sstruyen_story',story.urls[0],function(err,rs){
                var obj = rs;
                console.log(obj)
            })
        }
    }
})

/*
Template.home_detail.helpers({
    stories : function(){

    }
})*/
