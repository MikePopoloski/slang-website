const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
        	level: 'warn',
        	colorize: true
        }),
        new (winston.transports.File)({
        	level: 'info',
        	filename: './app.log',
        	maxsize: 5242880,
        	maxFiles: 5,
        	colorize: false,
        	json: false
        })
    ]
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message.trim())
    }
};

exports.logger = logger;