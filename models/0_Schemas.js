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
    updated_at : {
        type : Date,
        autoValue: function() {
            return new Date;
        }
    }
})

Categories.attachSchema(Schemas.Category);
