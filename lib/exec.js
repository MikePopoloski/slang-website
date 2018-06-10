const childProcess = require('child_process'),
      logger = require('./logger').logger,
      path = require('path'),
      treeKill = require('tree-kill');

function execute(cmd, args, options) {
    options = options || {};
    const maxOutput = options.maxOutput || 1024 * 1024;
    const timeoutMs = options.timeoutMs || 0;
    const env = options.env;

    logger.debug('executing ' + cmd, args);

    const child = childProcess.spawn(cmd, args, {
        cwd: process.env.tmpDir,
        detached: process.platform === 'linux'
    });

    let running = true;
    const kill = options.killChild || function() {
        if (running) treeKill(child.pid);
    };

    const streams = {
        stderr: "",
        stdout: "",
        truncated: false
    };

    let timeout;
    if (timeoutMs) timeout = setTimeout(() => {
        logger.warn("Timeout for " + cmd + " args", args, "after", timeoutMs, "ms");
        kill();
        streams.stderr += "\nKilled - processing time exceeded";
    }, timeoutMs);

    function setupOnError(stream, name) {
        stream.on('error', err => {
            logger.error('Error with ' + name + ' stream:', err);
        });
    }

    function setupStream(stream, name) {
        stream.on('data', data => {
            if (streams.truncated) return;
            const newLength = (streams[name].length + data.length);
            if (newLength > maxOutput) {
                streams[name] = streams[name] + data.slice(0, maxOutput - streams[name].length);
                streams[name] += "\n[Truncated]";
                streams.truncated = true;
                kill();
                return;
            }
            streams[name] += data;
        });
        setupOnError(stream, name);
    }

    setupOnError(child.stdin, 'stdin');
    setupStream(child.stdout, 'stdout');
    setupStream(child.stderr, 'stderr');

    child.on('exit', code => {
        if (timeout !== undefined) clearTimeout(timeout);
        running = false;
    });

    return new Promise(function (resolve, reject) {
        child.on('error', e => {
            logger.error('Error with ' + cmd + ' args', args, ':', e);
            reject(e);
        });

        child.on('close', code => {
            if (code === null) code = -1;
            if (timeout !== undefined) clearTimeout(timeout);

            const result = {
                code: code,
                stdout: streams.stdout,
                stderr: streams.stderr
            };
            resolve(result);
        });

        child.stdin.end();
    });
}

function sandbox(cmd, args, options) {
    options = options || {};
    const execPath = path.dirname(cmd);
    const execName = path.basename(cmd);
    return new Promise(function (resolve, reject) {
        let containerId = null;
        let killed = false;
        const timeoutMs = options.timeoutMs || 0;

        function removeContainer() {
            if (containerId) {
                execute("docker", ["rm", containerId]);
            }
        }

        dockerArgs = [
            "run",
            "--detach",
            "--network=none",
            "--memory=128M",
            "--memory-swap=0",
            "--cpu-shares=128",
            "--cpu-quota=25000"
        ];

        if (options.dockerArgs)
            dockerArgs = dockerArgs.concat(options.dockerArgs);

        dockerArgs = dockerArgs.concat(["mpopoloski/slang-web:exec", execName]);
        dockerArgs = dockerArgs.concat(args);

        execute("docker", dockerArgs, {})
        .then(result => {
            containerId = result.stdout.trim();
            if (result.code !== 0) {
                logger.error("Failed to start docker: ", result)
                result.stdout = [];
                result.stderr = [];
                if (containerId === "") {
                    reject(result);
                }
            }
        })
        .then(() => {
            return execute("docker", ["wait", containerId], {
                timeoutMs: timeoutMs,
                killChild: function() {
                    logger.warn("Killing docker container", containerId);
                    execute("docker", ["kill", containerId]);
                    killed = true;
                }
            });
        })
        .then(result => {
            if (result.code !== 0) {
                logger.error("Failed to wait for " + containerId);
                removeContainer();
                reject(result);
                return;
            }
            const returnValue = parseInt(result.stdout);
            return execute("docker", ["logs", containerId], {})
                   .then(logResult => {
                        if (logResult.code !== 0) {
                            logger.error("Failed to get logs for", containerId);
                            removeContainer();
                            reject(logResult);
                            return;
                        }
                        if (killed)
                            logResult.stdout += "\n### Killed after " + timeoutMs + "ms";
                        logResult.code = returnValue;
                        return logResult;
                   });
        })
        .then(result => {
            logger.debug("Finished", result);
            removeContainer();
            resolve(result);
        })
        .catch(err => {
            removeContainer();
            reject(err);
        });
    });
}

module.exports = {
    execute: execute,
    sandbox: sandbox
};