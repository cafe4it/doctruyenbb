Router.route('/', function () {
    this.render('home');
}, {
    name: 'home',
    waitOn : function(){
        return Meteor.subscribe('categories');
    },
    fastRender: true
});

Router.route('/detail/:_id',function(){
    this.render('home_detail')
},{
    name : 'home_detail',
    waitOn : function(){
        return Meteor.subscribe('category',this.params._id)
    },
    category : function(){
        return Categories.findOne(this.params._id);
    },
    data : function(){
        var category = Categories.findOne(this.params._id);
        Meteor.call('scrapy_sstruyen_stories_by_category', _.unescape(category.url),function(err,data){
            Session.set('stories',data)
        });

        return {
            stories : Session.get('stories')
        }
    },
    fastRender: true
})

/*
 * Authenticates Routes
 */

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['home', 'SignIn', 'SignUp', 'Logout', 'ForgotPassword', '404', 'detailChannel','allowGuest']
});
AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'SignIn',
    layoutTemplate: 'defaultLayout'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'SignIn',
    path: '/dang-nhap',
    template: 'SignIn',
    layoutTemplate: 'defaultLayout',
    redirect: '/thong-tin-tai-khoan'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'SignUp',
    path: '/dang-ky-tai-khoan',
    template: 'SignUp',
    layoutTemplate: 'defaultLayout',
    redirect: '/thong-tin-tai-khoan'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'ForgotPassword',
    path: '/quen-mat-khau',
    template: 'ForgotPassword',
    layoutTemplate: 'defaultLayout',
    redirect: '/'
});

Router.route('/thong-tin-tai-khoan', function () {
    this.render('home')
}, {
    fastRender: true
});

Router.route('/dang-xuat', function () {
    Meteor.logout();
    Router.go('home');
}, {
    name: 'Logout'
});

Router.route('/dieu-khoan-su-dung', {
    name: 'terms',
    template: 'terms',
    path: 'dieu-khoan-su-dung'
});