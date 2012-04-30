var express = require('express')
,	routes = require('./routes')
,	visitors = []
, app = module.exports = express.createServer();
var mongo = require("mongoskin");
var db = mongo.db("user:passw0rd@ds031607.mongolab.com:31607/mint");

db.bind('users',{
	put: function(user, fn){
		this.save(user,{},fn);
	},
	
	getAll: function(fn){
		this.find(fn);
	},
	update: function(name,fn){
		var nowDate = new Date().getTime();
		this.findAndModify({"name": name},1,{lastLoggedIn: nowDate},{"new": true},fn);
	}
});


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register(".html", require("jqtpl").express);
  app.set("view options", { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('dev', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes		

app.get('/', function(req,res){
		res.render(__dirname + '/views/index.html', {author: "Juzer Ali"});
});

app.listen(process.env['app_port'] || 8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

 var everyone = require("now").initialize(app, {socketio: {transports: ['xhr-polling', 'jsonp-polling', 'htmlfile']}});

 
 everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};	


everyone.now.addName = function(name){
	var self = this;
	var nowDate = new Date().getTime();
	db.users.put({"name": name, "created": nowDate}, function(err, status){
		if(err){
			console.log(err);
		}
	});
	/*db.users.getAll(function(err, result){
		everyone.now.populateVisitors(result);	
	});*/
	
};



/*	MONGODB SETTINGS	*/




