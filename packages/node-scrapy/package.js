Package.describe({
  name: 'meteor:node-scrapy',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'Simple, lightweight and expressive web scraping with Node.js',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/eeshi/node-scrapy',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({"node-scrapy" : "0.2.1"});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.addFiles('node-scrapy.js',['server']);
  if (typeof api.export !== 'undefined') {
    api.export(['ScrapyApi'], ['server']);
  }
});