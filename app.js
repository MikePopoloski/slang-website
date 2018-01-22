const nopt = require('nopt'),
	  http = require('http'),
	  express = require('express'),
	  winston = require('winston'),
	  webpack = require('webpack'),
	  webpackDev = require('webpack-dev-middleware')
	  _ = require('underscore');

const opts = nopt({
	'host': [String],
	'port': [Number],
	'static': [String]
});

const hostname = opts.host;
const port = opts.port || 3000;
const staticDir = opts.static || 'static';
const webpackConfig = require('./webpack.config.js');
const webpackCompiler = webpack(webpackConfig);

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({colorize: true})
	]
});

logger.stream = {
	write: function (message, encoding) {
		logger.info(message.trim())
	}
};

function renderConfig() {
	return {};
};

logger.info("Building webpack bundle...");

const app = express();
app.set('view engine', 'pug')
   .get('/', (req, res) => {
   		res.render('index', renderConfig());
   })
   .use(express.static(staticDir))
   .use(webpackDev(webpackCompiler));

logger.info("=======================================");
logger.info("Listening on http://" + (hostname || 'localhost') + ":" + port + "/");
logger.info("  serving static files from '" + staticDir + "'");
logger.info("=======================================");

app.on('error', err => logger.error('Caught error:', err, "(in web error handler; continuing)"));
app.listen(port, hostname);