Schemas = {};

Categories = new Meteor.Collection('categories');

Schemas.Category = new SimpleSchema({
    title : {
        type : String,
        label : 'Tên danh mục',
        max : 50
    },
    url : {
        type : String,
        label : 'Đường dẫn URL'
    },
    source :{
        type : String,
        optional : true
    },
    updated_at : {
        type : Date,
        autoValue: function() {
            return new Date;
        }
    }
});

Stories = new Meteor.Collection('stories');

Schemas.Story = new SimpleSchema({
    
})

Categories.attachSchema(Schemas.Category);
Stories.attachSchema(Schemas.Story);
