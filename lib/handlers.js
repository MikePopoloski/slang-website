const logger = require('./logger').logger,
      exec = require('./exec'),
      fs = require('fs-extra'),
      tmp = require('tmp-promise');

function handleCompilationRequest(req, res, next) {
    if (!req.is('json'))
        return next();

    var source = req.body.source;
    if (source === undefined) {
        logger.warn("No body found in request", req);
        return next(new Error("Bad request"));
    }

    logger.info('Compilation request', source);

    tmp.withFile(o => {
        var mount = "--mount=type=bind,src=" + o.path;
        mount += ",dst=/source.sv,ro=true";
        return fs.writeFile(o.fd, source).then(() => {
            return exec.sandbox('slang', ['source.sv'], {dockerArgs: [mount]});
        });
    })
    .then(result => {
        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
        logger.info('Compilation response', result);
    })
    .catch(result => {
        logger.error(result);
    });
}

module.exports = {
    handleCompilationRequest: handleCompilationRequest
};