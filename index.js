const express = require('express');
const exphbs = require('express-handlebars');
const avoShopper = require("./avo-shopper");
const app = express();
//const PORT =  process.env.PORT || 3019;


// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/avo_shopper';
const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

const avoInsta = avoShopper(pool);
let counter = 0;

app.get('/', function (req, res) {
	res.render('index', {
		counter
	});
});

app.get('/shops', async function (req, res) {
	res.render('shops', {
		shops: await avoInsta.listShops()
	});
});

app.get('/addShops', async function (req, res) {
	//var name = req.params.name;
	// var findId = await avoInsta.getShopId(shopName);
	// console.log(shopName);


	res.render('addShops');

});

app.post('/newShop', async function (req, res) {

	try {
		var shopName = req.body.inputBox;
		var addedShop = await avoInsta.createShop(shopName);
		res.render('addShops', {
			addedShop,
		});
	} catch (err) {
		console.log(err)
	}
});


app.get('/shops/:name', function (req, res) {
	var shopName = req.params.name;

	res.render('addDeals', {
		name: shopName
	});

});


app.post('/shops/:name', async function (req, res) {
	try {
		var shopName = req.params.name;
		// console.log(shopName + "dfghjklkiiii")

		// var findId = await avoInsta.getShopId(shopName);
		// var price = req.body.price;
		// var qty = req.body.qty;

		//var addDealForShop  = await avoInsta.createDeal(findId,qty,price);
		res.redirect(`/shops/${shopName}`);
	} catch (err) {
		console.log(err)
	}
});




let PORT = process.env.PORT || 3019;
app.listen(PORT, function () {
	console.log('App starting on port', PORT);
});