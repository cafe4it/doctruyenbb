Meteor.publish(null,function(){
    return Meteor.roles.find({})
});

Meteor.publish('categories',function(){
    return Categories.find();
})

Meteor.publish('category',function(id){
    return Categories.find(id);
})