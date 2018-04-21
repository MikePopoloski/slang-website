const nopt = require('nopt'),
	  http = require('http'),
	  express = require('express'),
	  winston = require('winston'),
	  morgan = require('morgan'),
	  compression = require('compression'),
	  bodyParser = require('body-parser'),
	  childProcess = require('child_process'),
	  fs = require('fs-extra'),
	  webpack = require('webpack'),
	  webpackDev = require('webpack-dev-middleware'),
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

function execute(cmd, args) {
	logger.info('executing ' + cmd);

	var child = childProcess.spawn(cmd, args, {cwd: process.env.tmpDir});
	var streams = {
		stderr: "",
		stdout: "",
		truncated: false
	};

	function setupOnError(stream, name) {
		stream.on('error', function (err) {
			logger.error('Error with ' + name + ' stream:', err);
		});
	}

	function setupStream(stream, name) {
		stream.on('data', function (data) {
			if (streams.truncated)
				return;
			streams[name] += data;
		});
		setupOnError(stream, name);
	}

	setupOnError(child.stdin, 'stdin');
	setupStream(child.stdout, 'stdout');
	setupStream(child.stderr, 'stderr');

	return new Promise(function (resolve, reject) {
		child.on('error', function (e) {
			logger.info('Error with ' + cmd + ' args', args, ':', e);
			reject(e);
		});

		child.on('close', function (code) {
			if (code === null)
				code = -1;

			var result = {
                code: code,
                stdout: streams.stdout,
                stderr: streams.stderr
            };
            resolve(result);
		});

		child.stdin.end();
	});
}

const compilerPath = '../slang/build/win64_vs2017/bin/driverDebug.exe';

function compile(source) {
	return fs.writeFile('source.sv', source).then(() => {
		return execute(compilerPath, ['source.sv']);
	});
}

function handleCompilationRequest(req, res, next) {
	if (!req.is('json'))
		return next();

	var source = req.body.source;
	if (source === undefined) {
        logger.warn("No body found in request", req);
        return next(new Error("Bad request"));
    }

	compile(source).then(result => {
		res.set('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
}

function renderConfig() {
	return {};
};

logger.info("Building webpack bundle...");

const app = express();
app.set('view engine', 'pug')
   .use(morgan('combined', {stream: logger.stream}))
   .use(compression())
   .use(express.static(staticDir))
   .use(webpackDev(webpackCompiler))
   .use(bodyParser.json())
   .use(bodyParser.text({type: () => true}))
   .use('/api/compile', handleCompilationRequest)
   .get('/', (req, res) => {
   		res.render('index', renderConfig());
   });

logger.info("=======================================");
logger.info("Listening on http://" + (hostname || 'localhost') + ":" + port + "/");
logger.info("  serving static files from '" + staticDir + "'");
logger.info("=======================================");

app.on('error', err => logger.error('Caught error:', err, "(in web error handler; continuing)"));
app.listen(port, hostname);