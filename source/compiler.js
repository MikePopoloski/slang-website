import _ from 'underscore';

export default function CompilerComponent(container, state) {
	this.container = container;
	this.domRoot = $('#compiler');
	container.element.appendChild(this.domRoot.get(0));

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

    this.add('\ncompiler returned: ' + results.code)
    this.add(results.version)
}

CompilerComponent.prototype.add = function (line) {
	var elem = $('<div></div>').appendTo(this.contentRoot);
	elem.text(line);
}
