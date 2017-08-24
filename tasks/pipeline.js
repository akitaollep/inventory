/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 *
 * For more information see:
 *   https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'bower_components/bootstrap/dist/css/bootstrap.css',

  'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
  'bower_components/font-awesome/css/font-awesome.min.css',
  //'bower_components/datatables/media/css/jquery.dataTables.min.css',
  'bower_components/datatables.net-dt/css/jquery.dataTables.min.css',
  'bower_components/datatables.net-buttons-dt/css/buttons.dataTables.min.css',
  'bower_components/angular-datatables/dist/css/angular-datatables.min.css',
  'bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
  'bower_components/angular-dialog-service/dist/dialogs.min.css',

  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  '/bower_components/jquery/dist/jquery.js',
  '/bower_components/angular/angular.js',
  '/bower_components/moment/min/moment-with-locales.min.js',

  '/bower_components/angular-ui-router/release/angular-ui-router.js',
  '/bower_components/angular-resource/angular-resource.min.js',

  //'/bower_components/datatables/media/js/jquery.dataTables.min.js',
  '/bower_components/datatables.net/js/jquery.dataTables.min.js',

  //'/bower_components/datatables.net-colreorder/js/*.min.js',
  //'/bower_components/datatables.net-responsive/js/*.min.js',
  //'/bower_components/datatables.net-scroller/js/*.min.js',
  //'/bower_components/datatables.net-fixedcolumns/js/*.min.js',
  //'/bower_components/datatables.net-fixedheader/js/*.min.js',
  //'/bower_components/datatables.net-buttons/js/*.min.js',
  //'/bower_components/datatables.net-select/js/*.min.js',

  '/bower_components/datatables.net-buttons/js/dataTables.buttons.min.js',
  //'/bower_components/datatables.net-buttons/js/buttons.colVis.min.js',
  '/bower_components/datatables.net-buttons/js/buttons.print.min.js',
  '/bower_components/datatables.net-buttons/js/buttons.html5.min.js',
  //'/bower_components/datatables.net-buttons/js/buttons.flash.min.js',

  '/bower_components/datatables.net-responsive/js/dataTables.responsive.min.js',


  //'/bower_components/angular-datatables/dist/*.js',
  '/bower_components/angular-datatables/dist/angular-datatables.min.js',
  '/bower_components/angular-datatables/dist/angular-datatables.bootstrap.min.js',

  //'/bower_components/angular-datatables/dist/plugins/**/*.min.js',
  '/bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',
  //'/bower_components/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.min.js',
  //'/bower_components/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.min.js',
  //'/bower_components/angular-datatables/dist/plugins/tabletools/angular-datatables.tabletools.min.js',
  //'/bower_components/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js',
  //'/bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',
  //'/bower_components/angular-datatables/dist/plugins/light-columnfilter/angular-datatables.light-columnfilter.min.js',
  //'/bower_components/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.min.js',
  //'/bower_components/angular-datatables/dist/plugins/fixedheader/angular-datatables.fixedheader.min.js',
  '/bower_components/angular-datatables/dist/plugins/buttons/angular-datatables.buttons.min.js',
  '/bower_components/angular-datatables/dist/plugins/select/angular-datatables.select.min.js',


  //'/bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',

  '/bower_components/angular-route/angular-route.js',
  '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  '/bower_components/bootstrap/dist/js/bootstrap.js',
  '/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
  '/bower_components/angular-eonasdan-datetimepicker/dist/angular-eonasdan-datetimepicker.js',
  '/bower_components/angular-dialog-service/dist/dialogs.min.js',
  '/bower_components/angular-sanitize/angular-sanitize.min.js',
  '/bower_components/lodash/dist/lodash.min.js',

  // Dependencies like jQuery, or Angular are brought in here
  'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  //'templates/**/*.html'
  'templates/*.html'
];







// Default path for public folder (see documentation for more information)
var tmpPath = '.tmp/public/';

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(cssPath) {
  //return require('path').join('.tmp/public/', cssPath);
  return '.tmp/public/' + cssPath;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(jsPath) {
  //return require('path').join('.tmp/public/', jsPath);
  return '.tmp/public/' + jsPath;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(tplPath) {
  //return require('path').join('assets/',tplPath);
  return 'assets/' + tplPath;
});


