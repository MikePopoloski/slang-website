import _ from 'underscore';

export default function CompilerComponent(container, state) {
	this.container = container;
	this.domRoot = container.getElement();
	this.domRoot.html($('#compiler').html());
	this.contentRoot = this.domRoot.find(".content");
    this.session = state.session;

    this.session.onCodeCompiled(_.bind(function (source) {
    	this.compile(source);
    }, this));
}

const lineRe = /\r?\n/;

function splitLines(text) {
    const result = text.split(lineRe);
    if (result.length > 0 && result[result.length - 1] === '')
        return result.slice(0, result.length - 1);
    return result;
}

CompilerComponent.prototype.compile = function (result) {
	this.contentRoot.empty();
	_.each(splitLines(result.stdout || ''), function (line) {
        this.add(line);
    }, this);
}

CompilerComponent.prototype.add = function (line) {
	var elem = $('<div></div>').appendTo(this.contentRoot);
	elem.html(line);
}