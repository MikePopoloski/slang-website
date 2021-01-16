const logger = require('./logger').logger,
      exec = require('./exec'),
      fs = require('fs-extra'),
      tmp = require('tmp-promise'),
      path = require('path');

const compilerPath = path.resolve(path.dirname(require.main.filename), 'slang');
const isWin = process.platform === "win32";
const localBin = isWin ? path.resolve(path.dirname(require.main.filename), 'slang.exe') : compilerPath;

function handleCompilationRequest(req, res, next, opts) {
    if (!req.is('json'))
        return next();

    var source = req.body.source;
    if (source === undefined) {
        logger.warn("No body found in request", req);
        return next(new Error("Bad request"));
    }

    logger.info('Compilation request', source);

    var promise;
    if (opts.localpath) {
        promise = fs.writeFile('source.sv', source).then(() => {
            return exec.execute(opts.localpath, ['source.sv']);
        });
    }
    else {
        promise = tmp.withFile(o => {
            var mountBin = "--mount=type=bind,src=" + compilerPath + ",dst=/slangbin,ro=true"
            var mountSrc = "--mount=type=bind,src=" + o.path;
            mountSrc += ",dst=/source.sv,ro=true";
            return fs.writeFile(o.fd, source).then(() => {
                return exec.sandbox('/slangbin', ['source.sv', '--color-diagnostics=false'],
                                    {dockerArgs: [mountBin, mountSrc, '-t']});
            });
        })
    }

    promise
    .then(result => {
    	return exec.execute(localBin, ['--version'])
    			.then(versionResult => {
    				result.version = versionResult.stdout;
    				return result;
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