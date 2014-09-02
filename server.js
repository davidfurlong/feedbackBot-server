var application_root = __dirname,
    express = require('express');
    DEBUG = true;

var app = express();

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    // host: "",
    pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: ""
});

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    if(DEBUG) {
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
});

// app.get('/api/books', function(request, response) {
//     var books = [
//             {
//                 title: "Book 1",
//                 author: "Author 1",
//                 releaseDate: "01/01/2014"
//             },
//             {
//                 title: "Book 2",
//                 author: "Author 2",
//                 releaseDate: "02/02/2014"
//             }
//         ];

//     response.send(books);
// });
//Insert a new book
app.post('/', function( request, response ) {
    var feedback_item = {
        url: request.body.url,
        title: request.body.title,
        labels: request.body.labels,
        body: request.body.body
    };
    
    toGithub(feedback_item);
    response.send('Screw em');
});

function toGithub(feedback_item){

    
    var url = feedback_item.url;
    var pos = userrepo.indexOf('/');
    var username = url.substring(0, pos);
    var repo = url.substring(pos+1);

    github.issues.create({
            headers: {'User-Agent':'davidfurlong'},
            user: username,
            repo: repo,
            title: feedback_item.title,
            body: feedback_item.body,
            labels: feedback_item.labels
        },
        response()
    );
}

function response(){
    console.log('done');
}
//Get a single book by id
// app.get( ':id', function( request, response ) {
//     var book = {
//         title: "Unique Book",
//         author: "Unique Author",
//         releaseDate: "03/03/2014"
//     };
    
//     response.send(book);
// });

//Start server
var port = 3000;
app.listen(port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});