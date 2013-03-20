// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose/');
//var sql = require('node-sqlserver');

var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema;  

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());


// Example Application
var EntityConnectionSchema = new Schema({
  id: Number,
  sourceId: Number,
  targetId: Number
});

// Create a schema for our data
var EntityItemSchema = new Schema({
  id: Number,
  name: String,
  isSource: Boolean,
  connections:[EntityConnection]
});

var EntitySystemSchema = new Schema({
	id: Number,
	value: String
}); 

var EntityTypeSchema = new Schema({
	id: Number,
	value: String
}); 

// Use the schema to register a model
mongoose.model('EntityConnection',EntityConnectionSchema);
mongoose.model('EntityItem', EntityItemSchema); 
mongoose.model('EntitySystem',EntitySystemSchema);
mongoose.model('EntityType',EntityTypeSchema);


//console.log(mongoose.models['EntitySystem']['db']['collections']);

var EntityItem = mongoose.model('EntityItem'); 
var EntityConnection = mongoose.model('EntityConnection');

var EntitySystem = mongoose.model('EntitySystem'); 
var EntityType = mongoose.model('EntityType');

/*var aVal = new EntitySystem({id:99,value:'The99'});

aVal.save(function(err) {
	if(err)
	{console.log(err);}
});*/


// This function is responsible for returning all entries for the Message model
function getEntityItem(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
	var query ='';

	console.log('getEntityItem req.params:',req.params);
	console.log('getEntityItem req.query:',req.getQuery());
	if(req.getQuery() !== undefined && req.getQuery()['query']!==undefined)
	{
		query = req.getQuery()['query'];
		query = eval('('+query+')');
		console.log("got query",query);
	}
	
	res.header("Access-Control-Allow-Origin", "*"); 
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
  	EntityItem.find(query).limit(300).sort('-id').execFind(function (arr,data) {
	res.send(data);
  });
} 

// This function is responsible for returning all entries for the Message model
function getEntityConnection(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
console.log('getEntityConnection req.params:',req.params);
console.log('getEntityConnection req.query:',req.getQuery());
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  EntityConnection.find().limit(300).sort('-id').execFind(function (arr,data) {
	res.send(data);
  });
} 

function postEntityItem(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new entity item model, fill it up and save it to Mongodb
  var _entityItem = new EntityItem(); 

  _entityItem.name = req.params.name;
  _entityItem.isSource = req.params.isSource;
  _entityItem.save(function () {
    res.send(req.body);
  });
}

function putEntityItem(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new entity item model, fill it up and save it to Mongodb
 //console.log('putEntityItem(req, res, next) ',req,res,next); 
  var anId,name,connections;
  anId = req.params._id;
  name = req.params.name;
  connections = req.params.connections;
  console.log('Updating Document _id:',anId,' name:',name,' connections:',connections, ' Request Body:',req.body);
  
  var conditions = {};
  var options = {};
  var updateData = {};
  
  conditions._id = anId;
  
  updateData.name =name;
  updateData.connections =connections;
  
  console.log('EntityItem.update conditions:',conditions,' options:',options,' updateDate:',updateData);
  
  EntityItem.update(conditions,updateData,Callback);
   
  res.send(req.body);
  /*var _entityItem = new EntityItem(); 
  _entityItem.name = req.params.name;
  _entityItem.isSource = req.params.isSource;
  _entityItem.save(function () {
    res.send(req.body);});*/
  
}

function Callback(err,numAffected){
  if(err !== null) {
    console.log('Err:',err);
  }
  if(numAffected !== null) {
    console.log('affected rows %d', numAffected);
  }
  
}

function postEntityConnection(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new entity item model, fill it up and save it to Mongodb
  var _entityConnection = new EntityConnection(); 

  _entityConnection.targetId = req.params.targetId;
  _entityConnection.sourceId = req.params.sourceId;
  _entityConnection.save(function () {
    res.send(req.body);
  });
}

//Systems
// This function is responsible for returning all entries for the Message model
function getEntitySystem(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin

console.log('getEntitySystem req.params:',req.params);
console.log('getEntitySystem req.query:',req.getQuery());
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  EntitySystem.find().limit(300).sort('id').execFind(function (arr,data) {
    res.send(data);
  });
} 

function getEntityType(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  EntityType.find().limit(300).sort('id').execFind(function (arr,data) {
    res.send(data);
  });
} 

function postEntityType(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new entity item model, fill it up and save it to Mongodb
  var _entityType = new EntityType(); 

  _entityType.id = req.params.id;
  _entityType.value = req.params.value;
  _entityType.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get ('/entityitem', getEntityItem);
server.post('/entityitem', postEntityItem);
server.put ('/entityitem', putEntityItem)

server.get('/entityconnection', getEntityConnection);
server.post('/entityconnection', postEntityConnection);

server.get('/entitysystem', getEntitySystem);
//server.post('/entitysystem', postEntityConnection);

server.get('/entitytype', getEntityType);
server.post('/entitytype', postEntityType);

server.listen(8081, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});