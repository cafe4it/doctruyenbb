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
                try{
                    if(err) console.log(err)

                    var values = _.zip(data.titles,data.hrefs,data.info1s,data.info2s,data.authors.names,data.authors.hrefs,data.thumbnails,data.is_hots,data.is_fulls);

                    var keys = ['title','href','info1','info2','author_name','author_href','thumbnail','is_hot','is_full'];
                    var result = [];
                    _.each(values,function(value){
                        result.push(_.object(keys,value))
                    });
                    result = _.map(result,function(i){
                        var dk = _.isUndefined(i.href);
                        console.log(dk);
                        if(_.isUndefined(i.href) == false) return i;
                    })
                    done(null, result);

                }catch(ex){
                    console.log(ex);
                }
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
            /*var api = sstruyen_listruyen_api({url : encodeURIComponent(url), apikey :encodeURIComponent(ImportIo_APIKEY)});
            var rs = Async.runSync(function(done){
                HTTP.get(api,function(err,data){
                    done(null,data)
                })
            })
            return rs.result;*/
            var importioClient = new importio("527f1e6d-aaea-4635-bb0a-bbf424fca203", ImportIo_APIKEY, "import.io");
            var az_sstruyen_stories = _.template('http://sstruyen.com/m/index.php?lib=all&cate=&order=6&page=<%=page%>');
            var afterConnected = function(connected,done){
                if (!connected) {
                    console.error("Unable to connect");
                    return;
                }
                var data = [];
                var runningQueries = 0;
                var callback = function(finished, message){
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
                    if(finished){
                        console.log("Done single query");
                        runningQueries--;
                        console.log(runningQueries);
                        // If all queries are done, then log out the data we have
                        if (runningQueries <= 0) {
                            runningQueries = 0;
                            done(null,data);
                            console.log("All queries completed");
                        }
                    }
                }
                for(var i = 0; i< 189; i++){
                    runningQueries += 1;
                    importioClient.query({
                        "connectorGuids": [
                            "141078a6-2a27-4651-9486-b13b3ead8de7"
                        ],
                        "input": {
                            "webpage/url": az_sstruyen_stories({page : i})
                        }
                    }, callback);
                }

            }
            var rs = Async.runSync(function(done){
                importioClient.connect(function(connected){
                    afterConnected(connected,done)
                })
            });

            return rs.result;
        }
    }
})