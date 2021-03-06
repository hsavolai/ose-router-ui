var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/wall');
});

router.get('/sanity', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin','*' );
	res.setHeader('Access-Control-Allow-Headers','Content-Type');
	res.status(200).json("{status:alive}");
});

router.get('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("GET /api/messages routed")
	console.log('Dispatching to '+process.env.WALL_SERVICE_BASEURL+'/v1/message')
	request.get(process.env.WALL_SERVICE_BASEURL+'/v1/message',function(err,res,body){
		routerRes.setHeader('Content-Type', 'application/json');
		routerRes.setHeader('Access-Control-Allow-Origin','*' );
        try {
		reqArray=JSON.parse(body);
		routerRes.send(reqArray._embedded.message.map(filterResults));

		function filterResults(current) {
			message = {}
			message.alias = current.alias;
			message.content = current.content;
			message.date = current.date;
			
			return message;
		}
        } catch(ex) {
        	console.log(ex);
    		routerRes.status(400).json("{status:error}");		        	
        }
	});
});

router.post('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("POST /api/messages routed")
	console.log("Incoming body: "+JSON.stringify(routerReq.body));
	console.log('Dispatching to '+process.env.WALL_SERVICE_BASEURL+'/v1/message')
	
	
	if (!routerReq.body.alias) { routerReq.body.alias = "anonymous"}
	
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	routerReq.body.date = date+' '+time;


	if (!routerReq.body.content) { 
		routerRes.setHeader('Access-Control-Allow-Origin','*' );
		routerRes.status(400).json("{status:error}");		
	} else {
		    console.log("Ougoing body: "+JSON.stringify(routerReq.body));
			
			request.post({url: process.env.WALL_SERVICE_BASEURL+'/v1/message', json: routerReq.body});
			routerRes.setHeader('Access-Control-Allow-Origin','*' );
			routerRes.status(201).json("{status:created}");	
	}
	
		
	
   
});

router.options('/api/messages', function(routerReq, routerRes, routerNext) {
	console.log("OPTIONS /api/messages routed")
	routerRes.setHeader('Access-Control-Allow-Origin','*' );
	routerRes.setHeader('Access-Control-Allow-Headers','Content-Type');
	routerRes.sendStatus(200);
});


module.exports = router;
