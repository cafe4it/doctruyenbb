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

/*
Template.home_detail.helpers({
    stories : function(){

    }
})*/
