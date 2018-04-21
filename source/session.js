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
    console.log("Sending: " + jsonData);
    $.ajax({
    	type: 'POST',
    	url: 'api/compile',
    	dataType: 'json',
    	contentType: 'application/json',
    	data: jsonData,
    	success: _.bind(function (result) {
    		this.codeCompileCallbacks.fire(result);
    	}, this)
    });
}