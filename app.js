const nopt = require('nopt'),
      http = require('http'),
      express = require('express'),
      morgan = require('morgan'),
      helmet = require('helmet'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      logger = require('./lib/logger').logger,
      handlers = require('./lib/handlers'),
      _ = require('underscore');

const opts = nopt({
    'host': [String],
    'port': [Number],
    'static': [String]
});

const hostname = opts.host;
const port = opts.port || 3000;
const staticDir = opts.static || 'static';

function renderConfig() {
    return {};
};

const app = express();
app.set('view engine', 'pug')
   .use(morgan('combined', {stream: logger.stream}))
   .use(helmet())
   .use(compression())
   .use(express.static(staticDir))
   .use(bodyParser.json())
   .use(bodyParser.text({type: () => true}))
   .use('/api/compile', handlers.handleCompilationRequest)
   .get('/', (req, res) => {
        res.render('index', renderConfig());
   });

logger.warn("=======================================");
logger.warn("Listening on http://" + (hostname || 'localhost') + ":" + port + "/");
logger.warn("  serving static files from '" + staticDir + "'");
logger.warn("  process.env.NODE_ENV:", process.env.NODE_ENV);
logger.warn("=======================================");

app.on('error', err => logger.error('Caught error:', err, "(in web error handler; continuing)"));
app.listen(port, hostname);