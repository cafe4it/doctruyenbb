Meteor.methods({
    "userExists": function (username) {
        return !!Meteor.users.findOne({username: username});
    },
    update_sstruyen_categories : function(){
        if(Meteor.userId()){
            var rs = Async.runSync(function(done){
                Meteor.call('scrapy_sstruyen_categories',function(err,data){
                    if(data){
                        _.each(data,function(i){
                            Categories.upsert({
                                url : _.escape(i.href)
                            },{
                                $set : {
                                    url : _.escape(i.href),
                                    title : i.title
                                }
                            })
                        })
                    }
                    done(null,true);
                })
            })
            return rs.result;
        }
    },
    scrapy_sstruyen_categories : function(url){
        var url = url || 'http://sstruyen.com/m/',
            selector = '#bottom-menu > ul > li > div > a',
            model = {
                titles : {
                    selector : selector,
                    get : 'text'
                },
                hrefs : {
                    selector : selector,
                    get : 'href',
                    prefix : 'http://sstruyen.com'
                }
            }
        var rs = Async.runSync(function(done){
            ScrapyApi.scrape(url,model,function(err,data){
                if(err) throw new Meteor.Error(err);
                var values = _.zip(data.titles,data.hrefs);
                var keys = ['title','href'];
                var result = _.map(values,function(value){
                    return _.object(keys,value);

                })
                done(null, result);
            })
        })
        return rs.result;
    },

    scrapy_sstruyen_stories_by_category : function(url, page){
        if(url){
            var titleSelector = '#main_page > div.storylist > ul > li > div > h4 > b > a',
                authorSelector = '#main_page > div.storylist > ul > li > div > p:nth-child(3) > a',
                rootSstruyen = 'http://sstruyen.com';
            var model = {
                titles : {
                    selector : titleSelector,
                    get : 'text'
                },
                hrefs : {
                    selector: titleSelector,
                    get : 'href',
                    prefix: rootSstruyen
                },
                info1s : '#main_page > div.storylist > ul > li > div > p:nth-child(2)',
                info2s : '#main_page > div.storylist > ul > li > div > p:nth-child(4)',
                authors : {
                    names : authorSelector,
                    hrefs : {
                        selector : authorSelector,
                        get : 'href',
                        prefix : rootSstruyen
                    }
                },
                is_hots : {
                    selector : '#main_page > div.storylist > ul > li > div > h4 > b > a > img',
                    get : 'src',
                    prefix : rootSstruyen
                },
                is_fulls : {
                    selector : '#main_page > div.storylist > ul > li > div > p:nth-child(2) > img',
                    get : 'src',
                    prefix: rootSstruyen
                },
                thumbnails : {
                    selector : '#main_page > div.storylist > ul > li > a > img',
                    get : 'src',
                    prefix: rootSstruyen
                }
            }

        }


        var rs = Async.runSync(function(done){
            ScrapyApi.scrape(url, model, function(err,data){
                if(err) throw new Meteor.Error(err);

                var values = _.zip(data.titles,data.hrefs,data.info1s,data.info2s,data.authors.names,data.authors.hrefs,data.thumbnails,data.is_hots,data.is_fulls);
                var keys = ['title','href','info1','info2','author_name','author_href','thumbnail','is_hot','is_full'];
                var result = _.map(values,function(value){
                    return _.object(keys,value)
                })
                done(null, result);
            })
        })
        return rs.result;
    },

    scrapy_sstruyen_chitiettruyen : function(url){
        if(url){
            var model = {
                title : '#main_page > div.titlebar > span > h1',
                author : '#main_page > div.truyeninfo > div:nth-child(1) > ul > li:nth-child(1) > div.cp2 > a'
            }
        }
    },
    importio_sstruyen_listtruyen : function(url){
        if(url){
            var api = sstruyen_listruyen_api({url : encodeURIComponent(url), apikey :encodeURIComponent(ImportIo_APIKEY)});
            var rs = Async.runSync(function(done){
                HTTP.get(api,function(err,data){
                    done(null,data)
                })
            })
            return rs.result;
        }
    }
})