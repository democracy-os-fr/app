/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var translations = require('lib/translations');
var t = require('t-component');
var config = require('lib/config');
var visibility = require('lib/visibility');

/**
 * Set `views` directory for module
 */

app.set('views', __dirname);

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade');

/**
 * middleware for favicon
 */

app.use(express.favicon(__dirname + '/images/favicon.ico'));

/*
 * Register Models and Launch Mongoose
 */

require('lib/models')(app);

/**
 * Set `app` configure settings
 */

require('lib/setup')(app);

/*
 * PassportJS Auth Strategies and Routes
 */

require('lib/auth')(app);

/*
 * Twitter card routes
 */

app.use('/twitter-card', require('lib/twitter-card'));

/*
 * Facebook card routes
 */

app.use('/facebook-card', require('lib/facebook-card'));

/*
 * Local signin routes
 */

app.use('/signin', require('lib/signin-api'));

/*
 * Local signup routes
 */

app.use('/signup', require('lib/signup-api'));

/*
 * Forgot password routes
 */

app.use('/forgot', require('lib/forgot-api'));

app.use(require('lib/signin'));
app.use(require('lib/signup'));

app.all('*', visibility);

/**
 * Citizen API Service
 */

app.use('/api', require('lib/citizen'));

/*
 * Account routes
 */

app.use('/settings', require('lib/settings-api'));

/*
 * Stats routes
 */

app.use('/stats', require('lib/stats-api'));

/*
 * RSS feed routes
 */

app.use('/rss', require('lib/rss'));

/**
 * Root API Service
 */

app.use('/api', require('lib/api'));

/**
 * Tag API Service
 */

app.use('/api', require('lib/tag'));

/**
 * Proposal API Service
 */

app.use('/api', require('lib/proposal'));

/**
 * Law API Service
 */

app.use('/api', require('lib/law-api'));

/**
 * Whitelist API Service
 */

app.use('/api', require('lib/whitelist-api'));

/**
 * Comment API Service
 */

app.use('/api', require('lib/comment'));

/**
 * Delegation API Service
 */

app.use('/api', require('lib/delegation'));

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t-component` component with parameter locale
 */

t.lang(config.locale);

/**
 * Set native `express` router middleware
 */

app.use(app.router);

// Here we should have our own error handler!

/**
 * Set native `express` error handler
 */

app.use(express.errorHandler());

/**
 * GET index page.
 */

app.use(require('lib/browser-update'));
app.use(require('lib/homepage'));
app.use(require('lib/law'));
app.use(require('lib/admin'));
app.use(require('lib/settings'));
app.use(require('lib/forgot'));
app.use(require('lib/help'));
app.use(require('lib/404'));
