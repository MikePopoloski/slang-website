import _ from 'underscore';

export default function CompilerComponent(container, state) {
	this.container = container;
	this.domRoot = container.getElement();
	this.domRoot.html($('#compiler').html());
	this.contentRoot = this.domRoot.find(".content");
    this.session = state.session;

    this.session.onCodeCompiled(_.bind(function (results) {
    	this.onCompiled(results);
    }, this));
}

CompilerComponent.prototype.onCompiled = function (results) {
	this.contentRoot.empty();
	_.each(results.lines, function (line) {
        this.add(line);
    }, this);
}

CompilerComponent.prototype.add = function (line) {
	var elem = $('<div></div>').appendTo(this.contentRoot);
	elem.html(line);
}