Package.describe({
    name: 'cafe4it:import-io',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"import-io" : "2.0.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.0.4.1');
    api.addFiles('import-io.js', ['server']);
    if (typeof api.export !== 'undefined') {
        api.export(['importio'], ['server']);
    }
});

/*Package.onTest(function(api) {
 api.use('tinytest');
 api.use('cafe4it:import-io');
 api.addFiles('import-io-tests.js');

 });*/
