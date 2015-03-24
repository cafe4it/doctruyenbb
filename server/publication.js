Meteor.publish(null,function(){
    return Meteor.roles.find({})
});

Meteor.publish('categories',function(){
    return Categories.find();
})

Meteor.publish('category',function(id){
    return Categories.find(id);
});

Meteor.publish('authors',function(){
    return Authors.find()
});

Meteor.publish('storiesByCategory',function(category_id){
    var categoryCode = Categories.findOne(category_id).code;
    return Stories.find({categories : categoryCode, is_finished:true},{sort:{code : 1}});
});

/*Meteor.publish('stories2ByCategory',function(category_id){
    var categoryCode = Categories.findOne(category_id).code;
    return Stories2.find({"categories.code" : categoryCode, is_finished:true},{limit: 10});
});*/

Meteor.publishComposite('stories2ByCategory',function(cate_id){
    return{
        find : function(){
            var categoryCode = Categories.findOne(cate_id).code;
            return Stories2.find({categories:{$elemMatch:{code : categoryCode}}, is_finished:true},{sort:{code:1},limit:10});
        },
        children : [
            {
                find : function(story){
                    var thumbnail = StoriesCover2.find({_id : story.thumbnail},{limit:1});
                    return thumbnail;
                }
            }
        ]
    }
})

Meteor.publish('storiescover',function(){
    return StoriesCover.find();
});

Meteor.publish('stories2cover',function(){
   return StoriesCover2.find();
})

