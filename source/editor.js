import * as monaco from '@timkendrick/monaco-editor';
import _ from 'underscore';

export default function EditorComponent(container, state) {
	this.container = container;
	this.domRoot = container.getElement();
	this.domRoot.html($('#codeEditor').html());

	var editorRoot = this.domRoot.find(".monaco-placeholder");
	this.editor = monaco.editor.create(editorRoot[0], {
        scrollBeyondLastLine: false,
        language: 'cppp',
        fontFamily: 'monospace',
        readOnly: false,
        glyphMargin: true,
        quickSuggestions: false,
        fixedOverflowWidgets: true,
        minimap: {
            maxColumn: 80
        },
        folding: true,
        lineNumbersMinChars: 3,
        emptySelectionClipboard: true,
        autoIndent: true
    });

    this.updateEditorLayout = _.bind(function () {
        var topBarHeight = this.domRoot.find(".top-bar").outerHeight(true) || 0;
        this.editor.layout({width: this.domRoot.width(), height: this.domRoot.height() - topBarHeight});
    }, this);

    container.on('resize', this.updateEditorLayout);
    container.on('shown', this.updateEditorLayout);
    container.on('destroy', _.bind(function () {
        this.editor.dispose();
    }, this));
}