import _ from 'underscore';

export default function CodeSession(id) {
	this.id = id;
	this.source = null;
	this.codeEditCallbacks = $.Callbacks('unique');
	this.codeCompileCallbacks = $.Callbacks('unique');
}

CodeSession.prototype.onCodeEdited = function (fn) {
	this.codeEditCallbacks.add(fn);
}

CodeSession.prototype.onCodeCompiled = function (fn) {
	this.codeCompileCallbacks.add(fn);
}

CodeSession.prototype.notifyEdit = function (source) {
    if (source === this.source)
        return;

    this.source = source;
    this.codeEditCallbacks.fire(source);

    // Trigger a compilation on the server.
    var jsonData = JSON.stringify({source: source});
    $.ajax({
    	type: 'POST',
    	url: 'api/compile',
    	dataType: 'json',
    	contentType: 'application/json',
    	data: jsonData,
    	success: _.bind(function (result) {
            this.handleResult(result);
    	}, this)
    });
}

function splitLines(text) {
    const result = text.split(/\r?\n/);
    if (result.length > 0 && result[result.length - 1] === '')
        return result.slice(0, result.length - 1);
    return result;
}

CodeSession.prototype.handleResult = function (result) {
    var raw = result.stdout || ''
    var diags = []
    var lines = splitLines(raw);

    var chunks = raw.split(/source.sv:(\d+):(\d+): (\w+): (.*)\r?\n/);
    var i = 0;
    if (chunks.length > 0 && chunks[0] === '')
        i += 1;

    for (; i < chunks.length; i += 5) {
        var length = 1;
        if (chunks[4]) {
            var rangeline = chunks[4].split(/\r?\n/)[1];
            var highlight = /(~*^~*)/.exec(rangeline);
            if (highlight)
                length = highlight[0].length;
        }

        diags.push({
            line: parseInt(chunks[i]),
            col: parseInt(chunks[i + 1]),
            length: length,
            severity: chunks[i + 2],
            message: chunks[i + 3]
        });
    }

    this.codeCompileCallbacks.fire({
        raw: raw,
        lines: lines,
        diags: diags
    });
}