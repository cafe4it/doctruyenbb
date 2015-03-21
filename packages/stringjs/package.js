Package.describe({
  name: 'cafe4it:stringjs',
  version: '0.0.8',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jprichardson/string.js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({'string' : '3.0.1'})

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.addFiles('stringjs.js',['server']);
    if (typeof api.export !== 'undefined') {
        api.export(['StringJs'],['server']);
    }
});
