Tech@NYU Startup Week
--------

[![Circle CI](https://circleci.com/gh/TechAtNYU/startup-week.svg?style=svg)](https://circleci.com/gh/TechAtNYU/startup-week)

The marketing site ([nyusw.com](http://nyusw.com)) for tech@NYU Startup Week, a once-a-semester weeklong celebration of hacking, designing, networking, and learning in NYC.

## Installing dependencies

1. `gem install jekyll`
2. `cd _scripts && npm install`

## Cloning and running the site

1. `git clone git@github.com:TechAtNYU/startup-week.git`
2. `cd startup-week`
3. `jekyll serve` (serves on port 4000) or `jekyll build` (to build the site)

## Running scripts

1. `cd _scripts`
2. `export $ApiKey=""`
3. `node process.js`
4. `cd ..`
5. `jekyll serve`
