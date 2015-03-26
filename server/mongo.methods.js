/**
 * Created by nxcong on 23/03/2015.
 */
Meteor.methods({
    userExists: function (username) {
        return !!Meteor.users.findOne({username: username});
    },
    update_sstruyen_categories: function () {
        if (Meteor.userId()) {
            var rs = Async.runSync(function (done) {
                Meteor.call('scrapy_sstruyen_categories', function (err, data) {
                    if (data) {
                        _.each(data, function (i) {
                            Categories.upsert({
                                url: _.escape(i.href)
                            }, {
                                $set: {
                                    url: _.escape(i.href),
                                    title: i.title,
                                    code: vietnameseToSlug2(i.title, ""),
                                    source: 'sstruyen'
                                }
                            })
                        })
                    }
                    done(null, true);
                })
            })
            return rs.result;
        }
    },
    import_stories: function (items) {
        var size = 0;
        if (items) {
            _.each(items, function (i) {
                var story = Stories.findOne({code : vietnameseToSlug2(i.title, "")});
                if(!story){
                    var categories = Categories.find({code: {$in: _.pluck(i.tags,'code')}},{fields : {code : 1}}).fetch();

                    if (categories) {
                        try{
                            var author_name = i.author_name || 'Vô Danh',author_code = vietnameseToSlug2(author_name, "")
                            var author = Authors.findOne({code: author_code});
                            if (!author) {
                                Authors.insert({
                                    name : author_name,
                                    code: author_code,
                                    urls: [i.author_href]
                                });
                                author={
                                    code : author_code
                                }
                                /*author = {
                                 _id : author_id,
                                 name : i.author_name,
                                 code : vietnameseToSlug(i.author_name, "").toUpperCase(),
                                 urls : [i.author_href]
                                 }*/
                            } else {
                                var author_href_isExits = _.some(author.urls, function (u) {
                                    return u == i.author_href
                                });
                                if (!author_href_isExits) {
                                    Authors.update({code: author.code}, {
                                        $push: {
                                            urls: i.author_href
                                        }
                                    })
                                }
                            }
                            var coverId = ''
                            if (!_.isEmpty(i.thumbnail)) {
                                coverId = StoriesCover.insert(i.thumbnail)._id;
                            }

                            Stories.insert({
                                title: i.title,
                                code: vietnameseToSlug2(i.title, ""),
                                author: author.code,
                                categories: _.pluck(categories,'code'),
                                is_hot: i.is_hot,
                                is_finished: i.is_full,
                                cover : coverId,
                                urls : [i.href]
                            });
                            ++size;
                        }catch(ex){
                            console.log('ERROR:'+size);
                            throw new Meteor.Error(ex);
                        }

                    }
                }else{
                    ++size;
                }

            })
            return size;
        }
    },
    import_stories2 : function(items){
        var size = 0;
        if(items){
            _.each(items,function(i){
                var story_code = vietnameseToSlug2(i.title,""),
                    author_name = (_.isUndefined(i.author_name) || _.isEmpty(i.author_name))? 'Vô Danh' : i.author_name,
                    author_code = vietnameseToSlug2(author_name, "")
                var story = Stories2.findOne({code : story_code});
                if(story){
                    ++size;
                }else{
                    try{
                        var coverId = ''
                        if (!_.isEmpty(i.thumbnail)) {
                            coverId = StoriesCover2.insert(i.thumbnail)._id;
                        }
                        var story = {
                            title : i.title,
                            code : story_code,
                            author : {
                                name : author_name,
                                code : author_code
                            },
                            categories : i.tags,
                            is_hot: i.is_hot,
                            is_finished: i.is_full,
                            urls : [i.href],
                            thumbnail : coverId
                        };
                        Stories2.insert(story);
                    }catch(ex){
                        console.log('ERROR:'+size);
                        throw new Meteor.Error(ex)
                    }

                    ++size;
                }
            })
        }
        return size;
    },
    update_sstruyen_onlyfull : function(items){
        var Stories = items || Stories2.find({is_finished : true}).fetch();
        var size = _.size(Stories);
        _.each(Stories,function(story){
            Meteor.call('xray_sstruyen_story',story.urls[0],function(err,data){
                /*var rs = Stories2.update({_id : story._id},{
                    $set : {
                        summary : data.summary
                    }
                });*/

                _.each(data.chapters,function(chapter){
                    Chapters.upsert({code : chapter.id},{
                        $set : {
                            title : chapter.title,
                            code : chapter.id,
                            url : chapter.href,
                            story : story._id
                        }
                    });
                })

                console.log(--size,story.title);
            })
        })
    }
})