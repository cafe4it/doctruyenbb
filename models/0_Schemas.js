Schemas = {};

Categories = new Meteor.Collection('categories');
Authors = new Meteor.Collection('authors');


Schemas.Category = new SimpleSchema({
    title: {
        type: String,
        label: 'Tên danh mục',
        max: 50
    },
    code: {
        type : String,
        optional : true
    },
    url: {
        type: String,
        label: 'Đường dẫn URL'
    },
    source: {
        type: String,
        optional: true
    },
    updated_at: {
        type: Date,
        autoValue: function () {
            return new Date;
        }
    }
});

Schemas.Author = new SimpleSchema({
    name: {
        type: String
    },
    code : {
        type : String,
        optional : true
    },
    urls: {
        type: [String],
        optional:true
    }
})

Stories = new Meteor.Collection('stories');
Chapters = new Meteor.Collection('chapters');


Schemas.Story = new SimpleSchema({
    title: {
        type: String
    },
    code : {
        type : String,
        optional : true
    },
    summary: {
        type: String,
        optional: true
    },
    author: {
        type: String
    },
    categories: {
        type: [String]
    },
    number_of_reads: {
        type: Number,
        optional: true
    },
    is_hot: {
        type: Boolean,
        optional : true
    },
    is_finished: {
        type: Boolean,
        optional : true
    },
    urls: {
        type: [String],
        optional : true
    },
    cover: {
        type : String,
        optional : true
    },
    created_at: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date;
            }
        },
        optional : true
    },
    updated_at: {
        type: Date,
        autoValue: function () {
            return new Date;
        },
        optional:true
    }
});

StoriesCover = new FS.Collection("storiescover", {
    stores: [new FS.Store.GridFS("storiescover")]
});

Schemas.Chapter = new SimpleSchema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    story: {
        type: Schemas.Story
    },
    created_at: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date;
            }
        }
    },
    updated_at: {
        type: Date,
        autoValue: function () {
            return new Date;
        }
    }
})
Categories.attachSchema(Schemas.Category);
Stories.attachSchema(Schemas.Story);
Authors.attachSchema(Schemas.Author);
Chapters.attachSchema(Schemas.Chapter);