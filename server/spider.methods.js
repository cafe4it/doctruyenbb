Meteor.methods({
    scrapy_sstruyen_categories: function (url) {
        var url = url || 'http://sstruyen.com/m/',
            selector = '#bottom-menu > ul > li > div > a',
            model = {
                titles: {
                    selector: selector,
                    get: 'text'
                },
                hrefs: {
                    selector: selector,
                    get: 'href',
                    prefix: 'http://sstruyen.com'
                }
            }
        var rs = Async.runSync(function (done) {
            ScrapyApi.scrape(url, model, function (err, data) {
                if (err) throw new Meteor.Error(err);
                var values = _.zip(data.titles, data.hrefs);
                var keys = ['title', 'href'];
                var result = _.map(values, function (value) {
                    return _.object(keys, value);

                })
                done(null, result);
            })
        })
        return rs.result;
    },
    xray_az_sstruyen_stories: function (page) {
        var az_sstruyen_stories_url = _.template('http://sstruyen.com/m/index.php?lib=all&cate=&order=6&page=<%=page%>');
        var page = page || 0,
            url = az_sstruyen_stories_url({page: page});
        var rs = Async.runSync(function (done) {
            xRay(url)
                .format(function (obj) {
                    var isHot = _.isUndefined(obj.is_hot) || false,
                        isFull = _.isUndefined(obj.is_full) || false,
                        chapters = obj.info1.replace(/[^0-9]/g, '') || 0,
                        tags = obj.info1.substring(0, obj.info1.indexOf('|') - 1) || '',
                        title = obj.title.trimLeft().trimRight();
                    var categories = _.map(tags.split(','), function (t) {
                        return {
                            name: t,
                            code: vietnameseToSlug2(t, "")
                        }
                    });
                    var newObj = _.extend(obj, {
                        title: title,
                        is_hot: isHot,
                        is_full: isFull,
                        chapters: chapters,
                        tags: categories
                    });
                    return _.omit(newObj, 'info1');
                })
                .select([{
                    $root: '.storylist ul li',
                    title: '.sttitle',
                    href: 'a[href]',
                    is_hot: '.sttitle img[src]',
                    thumbnail: 'a img[src]',
                    info1: 'div p:nth-child(2)',
                    is_full: 'div p:nth-child(2) img[src]',
                    author_name: 'div p:nth-child(3) a',
                    author_href: 'div p:nth-child(3) a[href]',
                    info2: 'div p:nth-child(4)'
                }])
                .run(function (err, data) {
                    if (err)throw new Meteor.Error(err)
                    console.log(_.size(data))
                    done(null, data);
                })
        });
        return rs.result;
    },
    xray_sstruyen_story: function (url) {
        if (url) {
            var rs = Async.runSync(function (done) {
                xRay(url)
                    .format(function (obj) {
                        var summary = obj.summary.substr(0, obj.summary.length - 4),
                            pages = _.pluck(obj.pages, 'href'),
                            chapters = _.map(obj.chapters, function (chapter) {
                                var title = chapter.title,
                                    href_id = chapter.href.substring(chapter.href.lastIndexOf('/') + 1).replace(".html", "");
                                return {
                                    title: title,
                                    id: href_id,
                                    href : chapter.href
                                }
                            }),
                            status = (obj.status.trimLeft().trimRight()=="Còn Tiếp") ? false : true
                        return _.extend(obj, {
                            summary: summary,
                            pages: _.uniq(pages),
                            chapters: _.sortBy(chapters, 'id'),
                            status : status
                        })
                    })
                    .select({
                        $root: '#main_page',
                        title: '.titlebar h1',
                        cover: '.truyeninfo .truyenimg img[src]',
                        summary: '#divDes',
                        status : 'div:nth-child(1) ul li:nth-child(4) div.cp2',
                        chapters: [
                            {
                                $root: '.chaptlist ul li',
                                title: 'a',
                                href: 'a[href]'
                            }
                        ],
                        pages: [{
                            href: 'div.bgcontent.m10t div.content div.fixContent div div.page-split a.items[href]'
                        }]
                    })
                    .run(function (err, data) {
                        if (err)throw new Meteor.Error(err);
                        done(null, data)

                    })
            })
            var obj = rs.result;

            if (_.size(obj.pages) > 1) {
                var page_url = _.template('<%=url%>/page-<%=page%>.html');
                var first = obj.pages[0], size = _.size(obj.pages), last = obj.pages[size - 1],
                    pageUrl = first.substring(0, first.lastIndexOf('/')),
                    lastPage = last.substring(last.lastIndexOf('/')).replace(/[^0-9]/g, '');
                var chapters = [];
                for (var i = 0; i <= lastPage; i++) {
                    var chapterUrl = page_url({url: pageUrl, page: i});
                    var rs1 = Async.runSync(function (done1) {
                        xRay(chapterUrl)
                            .select(
                            {
                                $root: '#main_page',
                                chapters: [
                                    {
                                        $root: '.bgcontent.m10t:nth-child(8) .chaptlist ul li',
                                        title: 'a',
                                        href: 'a[href]'
                                    }
                                ]
                            }
                        )
                            .format(function (obj) {
                                var chapters = _.map(obj.chapters, function (chapter) {
                                    var title = chapter.title,
                                        href_id = chapter.href.substring(chapter.href.lastIndexOf('/') + 1).replace(".html", "");
                                    return {
                                        title: title,
                                        id: href_id,
                                        href : chapter.href
                                    }
                                });
                                return _.extend(obj,{chapters : _.sortBy(chapters,'id')})
                            })
                            .run(function (err1, data1) {
                                if (err1) throw new Meteor.Error(err1);
                                done1(null, data1.chapters);
                            })
                    });
                    chapters = chapters.concat(rs1.result);
                }
                obj = _.extend(obj, {chapters: _.sortBy(chapters,'id')});
            }
            return obj;
        }
    },
    xray_sstruyen_story_chapters: function (url) {
        if (url) {
            var rs1 = Async.runSync(function (done1) {
                xRay(url)
                    .paginate('#main_page div:nth-child(4) a[href]')
                    .select([{
                        $root: '#main_page',
                        title: '.detail-content center:nth-child(3) h3:nth-child(1)'
                        //content : '#chapt-content div'
                    }])
                    .run(function (err1, data1) {
                        if (err1)throw new Meteor.Error(err1);
                        done1(null, data1);
                        console.log(data1)
                    })
            })
            return rs1.result;
        }
    },
    xray_sstruyen_story_chapter : function(chapter){
        if(chapter){
            var rs = Async.runSync(function(done){
                xRay(chapter.url)
                    .select({
                        $root: '#main_page',
                        title : 'div.detail-content center:nth-child(3) h3:nth-child(1)'
                    })
                    .run(function(err,data){
                        if(err)throw new Meteor.Error(err);
                        done(null, data)
                    });
            });
            var obj = rs.result;
            var contentApi = _.template('http://www1.sstruyen.com/doc-truyen/index.php?ajax=ct&id=<%=id%>');
            var rs1 = Async.runSync(function(done){
                HTTP.get(contentApi({id : chapter.code}),function(err,data){
                    if(err)throw new Meteor.Error(err)
                    console.log(data)
                    done(null, data.content);
                })
            });
            _.extend(obj,{content : rs1.result});
            return obj;
        }
    },
    scrapy_sstruyen_stories_by_category: function (url, page) {
        if (url) {
            var titleSelector = '#main_page > div.storylist > ul > li > div > h4 > b > a',
                authorSelector = '#main_page > div.storylist > ul > li > div > p:nth-child(3) > a',
                rootSstruyen = 'http://sstruyen.com';
            var model = {
                titles: {
                    selector: titleSelector,
                    get: 'text'
                },
                hrefs: {
                    selector: titleSelector,
                    get: 'href',
                    prefix: rootSstruyen
                },
                info1s: '#main_page > div.storylist > ul > li > div > p:nth-child(2)',
                info2s: '#main_page > div.storylist > ul > li > div > p:nth-child(4)',
                authors: {
                    names: authorSelector,
                    hrefs: {
                        selector: authorSelector,
                        get: 'href',
                        prefix: rootSstruyen
                    }
                },
                is_hots: {
                    selector: '#main_page > div.storylist > ul > li > div > h4 > b > a > img',
                    get: 'src',
                    prefix: rootSstruyen
                },
                is_fulls: {
                    selector: '#main_page > div.storylist > ul > li > div > p:nth-child(2) > img',
                    get: 'src',
                    prefix: rootSstruyen
                },
                thumbnails: {
                    selector: '#main_page > div.storylist > ul > li > a > img',
                    get: 'src',
                    prefix: rootSstruyen
                }
            }

        }

        var rs = Async.runSync(function (done) {
            ScrapyApi.scrape(url, model, function (err, data) {
                try {
                    if (err) console.log(err)

                    var values = _.zip(data.titles, data.hrefs, data.info1s, data.info2s, data.authors.names, data.authors.hrefs, data.thumbnails, data.is_hots, data.is_fulls);

                    var keys = ['title', 'href', 'info1', 'info2', 'author_name', 'author_href', 'thumbnail', 'is_hot', 'is_full'];
                    var result = [];
                    _.each(values, function (value) {
                        result.push(_.object(keys, value))
                    });
                    result = _.reject(result, function (i) {
                        if (_.isUndefined(i.href)) return i;
                    })
                    done(null, result);

                } catch (ex) {
                    console.log(ex);
                }
            })
        })
        return rs.result;
    },

    scrapy_sstruyen_chitiettruyen: function (url) {
        if (url) {
            var model = {
                title: '#main_page > div.titlebar > span > h1',
                author: '#main_page > div.truyeninfo > div:nth-child(1) > ul > li:nth-child(1) > div.cp2 > a'
            }
        }
    },
    importio_sstruyen_listtruyen: function (fromPage, toPage) {
        var fromPage = fromPage || 0, toPage = toPage || 0;
        if (fromPage && toPage) {
            /*var api = sstruyen_listruyen_api({url : encodeURIComponent(url), apikey :encodeURIComponent(ImportIo_APIKEY)});
             var rs = Async.runSync(function(done){
             HTTP.get(api,function(err,data){
             done(null,data)
             })
             })
             return rs.result;*/
            var importioClient = new importio("527f1e6d-aaea-4635-bb0a-bbf424fca203", ImportIo_APIKEY, "import.io");
            var az_sstruyen_stories = _.template('http://sstruyen.com/m/index.php?lib=all&cate=&order=6&page=<%=page%>');
            var afterConnected = function (connected, done) {
                if (!connected) {
                    console.error("Unable to connect");
                    return;
                }
                var data = [];
                var runningQueries = 0;
                var callback = function (finished, message) {
                    if (message.type == "DISCONNECT") {
                        console.error("The query was cancelled as the client was disconnected");
                    }
                    // Check the message we receive actually has some data in it
                    if (message.type == "MESSAGE") {
                        if (message.data.hasOwnProperty("errorType")) {
                            // In this case, we received a message, but it was an error from the external service
                            throw new Meteor.Error(message.data)
                        } else {
                            // We got a message and it was not an error, so we can process the data

                            data = data.concat(message.data.results);
                        }
                    }
                    if (finished) {
                        console.log("Done single query");
                        runningQueries--;
                        console.log(runningQueries);
                        // If all queries are done, then log out the data we have
                        if (runningQueries <= 0) {
                            runningQueries = 0;
                            done(null, data);
                            console.log("All queries completed");
                        }
                    }
                }
                for (var i = fromPage; i <= toPage; i++) {
                    runningQueries += 1;
                    importioClient.query({
                        "connectorGuids": [
                            "141078a6-2a27-4651-9486-b13b3ead8de7"
                        ],
                        "input": {
                            "webpage/url": az_sstruyen_stories({page: i})
                        }
                    }, callback);
                }

            }
            var rs = Async.runSync(function (done) {
                importioClient.connect(function (connected) {
                    afterConnected(connected, done)
                })
            });

            return rs.result;
        }
    }
})