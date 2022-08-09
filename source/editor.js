import * as monaco from 'monaco-editor';
import _ from 'underscore';

export default function EditorComponent(container, state) {
	this.container = container;
    this.domRoot = $('#codeEditor');
	container.element.appendChild(this.domRoot.get(0));

    this.session = state.session;

    this.session.onCodeCompiled(_.bind(function (results) {
        this.handleCompileResults(results);
    }, this));

	var editorRoot = this.domRoot.find(".monaco-placeholder");
	this.editor = monaco.editor.create(editorRoot[0], {
        scrollBeyondLastLine: false,
        language: 'systemverilog',
        fontFamily: 'Consolas, "Liberation Mono", Courier, monospace',
        readOnly: false,
        glyphMargin: true,
        quickSuggestions: false,
        fixedOverflowWidgets: true,
        minimap: {
            maxColumn: 80
        },
        lineNumbersMinChars: 3,
        emptySelectionClipboard: true,
        autoIndent: true,
        formatOnType: true,
        theme: 'vs-dark'
    });

    this.updateEditorLayout = _.bind(function () {
        var topBarHeight = this.domRoot.find(".top-bar").outerHeight(true) || 0;
        this.editor.layout({width: this.domRoot.width(), height: this.domRoot.height() - topBarHeight});
    }, this);

    this.lastChangeEmitted = null;
    this.debouncedEmitChange = _.debounce(_.bind(function () {
        this.session.notifyEdit(this.getSource());
    }, this), 200);
    this.session.notifyEdit(this.getSource());

    this.editor.getModel().onDidChangeContent(_.bind(function () {
        this.debouncedEmitChange();
    }, this));

    container.on('resize', this.updateEditorLayout);
    container.on('shown', this.updateEditorLayout);
    container.on('destroy', _.bind(function () {
        this.editor.dispose();
    }, this));
}

EditorComponent.prototype.getSource = function () {
    return this.editor.getModel().getValue();
};

EditorComponent.prototype.handleCompileResults = function (results) {
    const markers = results.diags.map(d => ({
        severity: d.severity,
        startLineNumber: d.line,
        startColumn: d.col,
        endLineNumber: d.line,
        endColumn: d.col + d.length,
        message: d.message
    }));

    monaco.editor.setModelMarkers(this.editor.getModel(), "compiler", markers);
};
