//branch for trying chatnode.js setup

var appPort =  process.env.PORT || 3000;

var express = require('express'), 
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res){
  res.render('home.jade');
});

app.get("/:url", function(req, res){
  res.render('home.jade');
});

server.listen(appPort);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// do this when a new connection is made to the site
io.sockets.on('connection', function (socket) {
    var roomId = "";

    socket.on("joinRoom", function(room) {
        roomId = room;
        socket.join(roomId);
        console.log('room "' + roomId + '" was created.');
    });

	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
	});

	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.to(roomId).emit('message', data);
			console.log("user: " + name + "\n" + "sent this: " + message + "\n" + 'to room: "' + roomId + '"\n');
		})
	});
});
