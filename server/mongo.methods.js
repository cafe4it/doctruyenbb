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
                                    code: vietnameseToSlug(i.title, "").toUpperCase(),
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
        var size = _.size(items);
        if (items) {
            _.each(items, function (i) {
                var story = Stories.findOne({code : vietnameseToSlug(i.title, "").toUpperCase()});
                if(!story){
                    var categories = Categories.find({code: {$in: i.tags}},{fields : {code : 1}}).fetch();

                    if (categories) {
                        var author = Authors.findOne({code: vietnameseToSlug(i.author_name, "").toUpperCase()});
                        if (!author) {
                            Authors.insert({
                                name : i.author_name,
                                code: vietnameseToSlug(i.author_name, "").toUpperCase(),
                                urls: [i.author_href]
                            });
                            author={
                                code : vietnameseToSlug(i.author_name, "").toUpperCase()
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
                            code: vietnameseToSlug(i.title, "").toUpperCase(),
                            author: author.code,
                            categories: _.pluck(categories,'code'),
                            is_hot: i.is_hot,
                            is_finished: i.is_full,
                            cover : coverId,
                            urls : [i.href]
                        });
                        size--;
                    }
                }

            })
            return size;
        }
    }
})