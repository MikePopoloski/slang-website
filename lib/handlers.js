const logger = require('./lib/logger').logger,
      exec = require('./lib/exec');

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