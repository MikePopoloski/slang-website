const winston = require('winston');

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

exports.logger = logger;