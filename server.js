// Include our HTTP module.
var http = require( "http" );

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    // debug: true,
    protocol: "https",
    // host: "",
    pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: "c403e9ea6ffc60730e761a95d67194f5eb4a271a"
});
 
 
// Create an HTTP server so that we can listen for, and respond to
// incoming HTTP requests. This requires a callback that can be used
// to handle each incoming request.
var server = http.createServer(
    function( request, response ){
 
 
        // When dealing with CORS (Cross-Origin Resource Sharing)
        // requests, the client should pass-through its origin (the
        // requesting domain). We should either echo that or use *
        // if the origin was not passed.
        var origin = (request.headers.origin || "*");
 
 
        // Check to see if this is a security check by the browser to
        // test the availability of the API for the client. If the
        // method is OPTIONS, the browser is check to see to see what
        // HTTP methods (and properties) have been granted to the
        // client.
        if (request.method.toUpperCase() === "OPTIONS"){
 
 
            // Echo back the Origin (calling domain) so that the
            // client is granted access to make subsequent requests
            // to the API.
            response.writeHead(
                "204",
                "No Content",
                {
                    "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept",
                    "access-control-max-age": 10, // Seconds.
                    "content-length": 0
                }
            );
 
            // End the response - we're not sending back any content.
            return( response.end() );
 
 
        }
 
 
        // -------------------------------------------------- //
        // -------------------------------------------------- //
 
 
        // If we've gotten this far then the incoming request is for
        // our API. For this demo, we'll simply be grabbing the
        // request body and echoing it back to the client.
 
 
        // Create a variable to hold our incoming body. It may be
        // sent in chunks, so we'll need to build it up and then
        // use it once the request has been closed.
        var requestBodyBuffer = [];
 
        // Now, bind do the data chunks of the request. Since we are
        // in an event-loop (JavaScript), we can be confident that
        // none of these events have fired yet (??I think??).
        request.on(
            "data",
            function( chunk ){
                 // Build up our buffer. This chunk of data has
                // already been decoded and turned into a string.
                requestBodyBuffer.push( chunk );
            }
        );
 
 
        // Once all of the request data has been posted to the
        // server, the request triggers an End event. At this point,
        // we'll know that our body buffer is full.
        request.on(
            "end",
            function(){
 
                // Flatten our body buffer to get the request content.
                var requestBody = requestBodyBuffer.join( "" );
 
                // Create a response body to echo back the incoming
                // request.
                var responseBody = (
                    "Thank You For The Cross-Domain AJAX Request:\n\n" +
                    "Method: " + request.method + "\n\n" +
                    requestBody
                );

                // Send to github

                function toGithub(feedback_item){
                    var url = feedback_item.url;
                    var pos = url.indexOf('/');
                    var username = url.substring(0, pos);
                    var repo = url.substring(pos+1);

                    github.issues.create({
                            // headers: {'User-Agent':'davidfurlong'},
                            // user: username,
                            // repo: repo,
                            // title: feedback_item.title,
                            // body: feedback_item.body,
                            // labels: feedback_item.labels
                            headers: {'User-Agent':'davidfurlong'},
                            user: username,
                            repo: repo,
                            title: 'testin',
                            body: '',
                            labels: []
                        },
                        function(err, res){
                            console.log(err);
                        }
                    );
                }
                
                if(requestBody != "" && requestBody != undefined){
                    var f = JSON.parse(requestBody);
                    console.log(f);
                    console.log(f.url);
                    var feedback_item = {
                        url: f.url,
                        title: f.title,
                        labels: f.labels,
                        body: f.body
                    };
                    
                    if(feedback_item.url != undefined){
                        toGithub(feedback_item);
                    }
                }
                
 
                // Send the headers back. Notice that even though we
                // had our OPTIONS request at the top, we still need
                // echo back the ORIGIN in order for the request to
                // be processed on the client.
                response.writeHead(
                    "200",
                    "OK",
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                        "content-length": responseBody.length
                    }
                );
 
                // Close out the response.
                return( response.end( responseBody ) );
 
            }
        );
 
 
    }
);




 
 
// Bind the server to port 8080.
server.listen( process.env.PORT || 3000 );
 