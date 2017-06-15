var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/wall');
});

router.get('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("GET /api/messages routed")
	console.log('Dispatching to '+process.env.WALL_SERVICE_BASEURL+'/v1/message')
	request.get(process.env.WALL_SERVICE_BASEURL+'/v1/message',function(err,res,body){
		routerRes.setHeader('Content-Type', 'application/json');
		routerRes.setHeader('Access-Control-Allow-Origin','*' );
		reqArray=JSON.parse(body);
		routerRes.send(reqArray._embedded.message.map(filterResults));

		function filterResults(current) {
			message = {}
			message.alias = current.alias;
			message.content = current.content;
			message.date = current.date;
			
			return message;
		}
	
	});
});

router.post('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("POST /api/messages routed")
	console.log('Dispatching to '+process.env.WALL_SERVICE_BASEURL+'/v1/message')
	request.post({url: process.env.WALL_SERVICE_BASEURL+'/v1/message',
		json: routerReq.body});
	routerRes.setHeader('Access-Control-Allow-Origin','*' );
	routerRes.status(201).json("{status:created}");
});

router.options('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("OPTIONS /api/messages routed")
	routerRes.setHeader('Access-Control-Allow-Origin','*' );
	routerRes.setHeader('Access-Control-Allow-Headers','Content-Type');
	routerRes.sendStatus(200);
});


module.exports = router;
