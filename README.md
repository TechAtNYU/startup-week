# Tech@NYU Startup Week

The marketing site (nyusw.com) for tech@NYU Startup Week, a once-a-semester weeklong celebration of hacking, designing, networking, and learning in NYC.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Cloning and running the site
  1. git clone git@github.com:TechAtNYU/startup-week.git
  2. These instructions apply to the all branches except master and old-sw-site.
  3. cd startup-week
  4. `npm install && bower install && gem install compass`
  5. if `gem install compass` does not work, try `sudo gem install compass`
  6. `grunt serve` for preview (grunt build to build the site) and go to localhost:9000

## Testing

Running `grunt test` will run the unit tests with karma.
