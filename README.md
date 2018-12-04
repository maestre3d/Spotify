# Spotify SPA website

A simple SPA website using Spotify's website/desktop concept as base.


<b>* JUST FOR EDUCATIONAL PURPOSES ONLY. </b>

## Getting Started

Before you start working with Spotify, consider following these steps.

### Prerequisites

Install the following Software before you install Spotify project.

```
MongoDB Shell / Server
// If Windows user
    |_ Use gitbash app to get a Unix Terminal or use latest PowerShell
*npm
|_*nodejs
|_*angular-cli

REST Client of your choice (Ex. Postman, JetBrains's RubyMine in-build REST Client)
```
* Use Latest versions

### Installing

A step by step series to get development enviroment working properly.

#### NodeJS's Express client (API RESTful module)

Start mongod service (Mongo's demon)

```
user@user-pc:~$ sudo service mongodb start

// If Windows user
    |_ Go to MongoDB path (PATH/MongoDB/Server/YOUR_VERSION_HERE/bin) and run mongod.exe

```

Start Mongo Shell and Create the db

```
user@user-pc:~$ mongo

    // If Windows user
        |_ Go to MongoDB path (PATH/MongoDB/Server/YOUR_VERSION_HERE/bin) and run mongo.exe

// Mongo's Shell command    
> use mean

```
You can close now the Mongo's Shell if you want.
Leave Mongo's Server service running / listening.

Install dependencies and Start API RESTful server (NodeJS/Express)

```
user@user-pc:~/mean-spotify$ npm install
// The API module uses nodemon, we created this shortcut w nodemon
user@user-pc:~/mean-spotify$ npm start
    // If all ok, you'll see this output
        |_ Connected to DB.
        |_ API REST Server listening on: localhost:3977

```

You can test now with your REST Client the API modules. (Take a look at route modules first).

#### Angular Client

Install Angular's Spotify dependencies and start it

```
user@user-pc:~/mean-spotify$ ng serve
    // If all ok, you'll see this output
        |_ ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
        |_ i : Compiled successfully.

```

You can now go to your favorite browser and use the SPA website entering the following web address:
```
http://localhost:4200/
```

## Deployment

You may use AWS's AC2 module to deploy the MEAN app.

## Built With

* [Bootstrap](https://getbootstrap.com/) - The web-design framework used
* [npm](https://www.npmjs.com/) - Dependency Management
* [NodeJS](https://nodejs.org/en/) - Server
* [Angular 7+](https://angular.io/) - Front-End framework
* [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) - Database

## Contributing

Please read [CONTRIBUTING.md](https://gitlab.com/maestre3d/spotify-mean/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Alonso R** - *Initial work* - [Maestre3D](https://gitlab.com/maestre3d)

See also the list of [contributors](https://gitlab.com/maestre3d/spotify-mean/graphs/master) who participated in this project.

## License

This project is licensed under the GNU GPLv3 License - see the [LICENSE.md](https://gitlab.com/maestre3d/spotify-mean/blob/master/LICENSE) file for details

## Acknowledgments

* [Spotify Developers](https://developer.spotify.com/documentation/)
* [Victor Robles](https://victorroblesweb.es/)
* [Creative Tim](https://www.creative-tim.com/)
* [Spotify Branding](https://developer.spotify.com/branding-guidelines/)
* [UEFA Branding](https://uclbranding.uefa.com/) * Used new UEFA Champions League's fonts
