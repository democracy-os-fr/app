/**
 * Module dependencies.
 */

var env = process.env;

/**
 * Expose heroku helper
 */

var clientConfigs = [
  "protocol",
  "host",
  "publicPort",
  "env",
  "logo",
  "favicon",
  "organization name",
  "organization url",
  "google analytics tracking id",
  "netid enabled",
  "netid instructions url"
];

module.exports = {
  protocol: env.PROTOCOL,
  host: env.HOST,
  publicPort: env.PUBLIC_PORT,  
  privatePort: env.PORT,
  mongoUrl: env.MONGOHQ_URL,
  client: env.CLIENT_CONF ? env.CLIENT_CONF.split(',') : clientConfigs,
  auth: {
    basic: {
      username: env.BASIC_USERNAME,
      password: env.BASIC_PASSWORD
    }    
  },
  mailer: {
    service: env.MAILER_SERVICE,
    auth: {
      user: env.MAILER_USER,
      pass: env.MAILER_PASS
    }
  },
  mandrillMailer: {
    key: env.MANDRILL_APIKEY,
    from : {
      name: env.MANDRILL_FROM_NAME,
      email: env.MANDRILL_FROM_EMAIL
    }
  },
  socialshare : {
    siteName : env.SOCIALSHARE_SITE_NAME,
    siteDescription : env.SOCIALSHARE_SITE_DESCRIPTION,
    image : env.SOCIALSHARE_IMAGE,
    domain : env.SOCIALSHARE_DOMAIN,
    twitter : {
      username : env.SOCIALSHARE_TWITTER_USERNAME
    }
  },
  logo : env.LOGO,
  favicon : env.FAVICON,
  "organization name" : env.ORGANIZATION_NAME,
  "organization url" : env.ORGANIZATION_URL,
  "staff": env.STAFF ? env.STAFF.split(',') : null,
  "google analytics tracking id" : env.GOOGLE_ANALYTICS_TRACKING_ID,
  "netid enabled": env.NETID_ENABLED,
  "netid instructions url": env.NETID_INSTRUCTIONS_URL,
  netid : {
    "client id": env.NETID_CLIENT_ID,
    "client secret": env.NETID_CLIENT_SECRET,
    "base url": env.NETID_BASE_URL,
    "endpoints": {
      "request token": {
        "method": "POST",
        "path": "/oauth/v2/token"
      },
      "verified identity": {
        "method": "POST",
        "path": "/api/verify"
      },
      "create identity": {
        "method": "POST",
        "path": "/api/create"
      }
    }
  }
};