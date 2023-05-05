import _ from 'underscore';
import Convert from 'ansi-to-html';

export default function CompilerComponent(container, state) {
    this.container = container;
    this.domRoot = $('#compiler');
    container.element.appendChild(this.domRoot.get(0));

    this.contentRoot = this.domRoot.find(".content");
    this.optionsField = this.domRoot.find('.options');
    this.session = state.session;
    this.ansiConvert = new Convert({
        fg: '#333',
        bg: '#f5f5f5',
        stream: true,
        escapeXML: true,
    });

    this.session.onCodeCompiled(_.bind(function (results) {
        this.onCompiled(results);
    }, this));

    const optionsChange = _.debounce(e => {
        this.session.notifyOptions($(e.target).val());
    }, 800);

    this.optionsField.on('change', optionsChange).on('keyup', optionsChange);
}

CompilerComponent.prototype.onCompiled = function (results) {
    this.contentRoot.empty();
    _.each(results.lines, function (line) {
        this.add(this.ansiConvert.toHtml(line));
    }, this);

    this.add('<br/>')
    this.add('compiler returned: ' + results.code)
    this.add(results.version)
}

CompilerComponent.prototype.add = function (line) {
    var elem = $('<div></div>').appendTo(this.contentRoot);
    elem.html(line);
}
