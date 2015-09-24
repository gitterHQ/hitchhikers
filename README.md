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

API:

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
