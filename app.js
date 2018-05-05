const nopt = require('nopt'),
      http = require('http'),
      express = require('express'),
      morgan = require('morgan'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      webpack = require('webpack'),
      webpackDev = require('webpack-dev-middleware'),
      logger = require('./lib/logger').logger,
      handlers = require('./lib/handlers.js'),
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
   .use('/api/compile', handlers.handleCompilationRequest)
   .get('/', (req, res) => {
        res.render('index', renderConfig());
   });

logger.info("=======================================");
logger.info("Listening on http://" + (hostname || 'localhost') + ":" + port + "/");
logger.info("  serving static files from '" + staticDir + "'");
logger.info("=======================================");

app.on('error', err => logger.error('Caught error:', err, "(in web error handler; continuing)"));
app.listen(port, hostname);