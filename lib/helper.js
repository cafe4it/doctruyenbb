redirectTo  = function(routeName){
    Router.go(routeName);
};

paginatedItems = function(items,per_page,page){
    var page = page || 1,
        per_page = per_page || 3,
        offset = (page - 1) * per_page,
        paginateItems = _.rest(items, offset).slice(0, per_page);
    return {
        total_page : Math.ceil(items.length / per_page),
        total : items.length,
        data : paginateItems,
        page: page,
        per_page: per_page,
        items : items
    }
};

vietnameseToSlug = function (str,i){
    var str = str.trim() || "",
        i = i;
    if(!_.isEmpty(str)){
        if(_.isUndefined(i)) i = "-";
        str= str.toLowerCase();
        str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        str= str.replace(/đ/g,"d");
        str= str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,i);
        str= str.replace(/-+-/g,i); //thay thế 2- thành 1-
        str= str.replace(/^\-+|\-+$/g,"");//cắt bỏ ký tự - ở đầu và cuối chuỗi
    }
    return str;
}