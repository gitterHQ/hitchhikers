
# Hitchhikers Guide to GitHub Universe

![Logo](https://raw.githubusercontent.com/gitterHQ/hitchhikers/master/src/svg/gitter-planet-icon.svg)

Suggests attendees to meet at GitHub Universe, based on your public GitHub profile.

# What's going on here?

## TL;DR

When you sign-in using your GitHub credentials, we use information available in
your GitHub public profile to suggest other GitHub Universe attendees who you may
be interested in meeting up with at the conference.

## Long Version

On logging in, we query publicly available information on the GitHub API to find 
match you with other GitHub Universe attendees. 

Examples of other attendees we may suggest (in order of priority)

1. Somebody you follow on GitHub
2. Other attendees who own a repo you've starred, watched, forked or created issues against.
3. Other attendees who have starred, watched etc many of the same repos as you.

## How does it work

Using public profile information on GitHub, we use a neo4j graph database to 
build up a graph network of your public activity on GitHub. We then analyze this
graph to suggest other attendees.

## How secure is this

We don't request any scopes we authenticate against the GitHub OAuth endpoint. 
This means we can never access any information that can't already be accessed
anonymously. 

This also means that we don't have permission to make any changes privately on 
your behalf on GitHub.

For extra security, we don't store your GitHub token in the database.

## Licence 

MIT

# Contibuting

Contributions are welcome!

# Developer Guide 

Steps to run:

- `docker-compose up -d`
- `cp env.sh.example env.sh`
- edit env.sh
- `npm install`
- `npm run build`
- `npm start`
- navigate to http://localhost:3000

You'll also need to have redis running for the job queue.

To manually add a user without having to log in with each of them, use `node scripts/add_user.js USERNAME`.  Make sure you have **lib/workers.js** running in order to process those jobs.

There are also all sorts of potentially useful scripts in scripts/.

# API

* GET **/github/login** to get redirected to github and get logged in
* GET **/github/logout** clears the auth cookie again
* GET **/user** returns the logged in user's details or 401 if no logged in user
* PUT **/user** is for setting login, name, email, lat, lon, city, country. It supports sparse fields, so you could just send email or location, for example. Blank strings to unset.
* DELETE **/user** sets it back to just the login field so that it doesn't get removed from graphs (as people could be following or followed by that user), but the user isn't foundable by anyone, emailable by us and doesn't get plotted on the map or appear in leaderboards.
* GET **/user/suggestions** returns [{login: "", reason: ""},] for the logged in user
* GET **/users/going** returns all users for which we at least have name filled in (so we don't return all the users that are only in the graph because someone follows them)
* GET **/users/locations** returns all the users for which we have their location. These are the ones that should go on the map
* GET **/leaderboards/country** returns [{country: "", count: 0},] sorted by count, descending
* GET **/leaderboards/city** returns [{city: "", count: 0},] sorted by count, descending
* GET **/leaderboards/distance** returns the same as /users/locations, except by distance, descending
* **/private** is a hidden API where all the calls require a "secret" url parameter. Mostly things used by neo4j to get the streams of data loaded for the user suggestions.
