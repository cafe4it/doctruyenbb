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

Schemas.Category2 = new SimpleSchema({
    name: {
        type: String,
        label: 'Tên danh mục',
        max: 50
    },
    code: {
        type : String,
        optional : true
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

Schemas.Author2 = new SimpleSchema({
    name: {
        type: String
    },
    code : {
        type : String,
        optional : true
    }
})

Stories = new Meteor.Collection('stories');
Stories2 = new Meteor.Collection('stories2');
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

Schemas.Story2 = new SimpleSchema({
    title: {
        type: String,
        index : 1
    },
    code : {
        type : String,
        optional : true,
        index : 1
    },
    summary: {
        type: String,
        optional: true
    },
    author: {
        type: Schemas.Author2,
        index : 1
    },
    categories: {
        type: [Schemas.Category2],
        index : 1
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
    thumbnail: {
        type : String,
        optional : true
    },
    updated : {
        type : Boolean,
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

StoriesCover2 = new FS.Collection("storiescover2", {
    stores: [new FS.Store.GridFS("storiescover2")]
});

Schemas.Chapter = new SimpleSchema({
    title: {
        type: String
    },
    code : {
        type : String,
        optional : true
    },
    url : {
        type : String,
        optional : true
    },
    content: {
        type: String,
        optional: true
    },
    story: {
        type : String
    },
    updated : {
        type : Boolean,
        defaultValue:false,
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
        optional: true
    }
});

Categories.attachSchema(Schemas.Category);
Stories.attachSchema(Schemas.Story);
Stories2.attachSchema(Schemas.Story2);
Authors.attachSchema(Schemas.Author);
Chapters.attachSchema(Schemas.Chapter);