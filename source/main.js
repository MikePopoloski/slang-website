import 'bootstrap';
import _ from 'underscore';
import GoldenLayout from 'golden-layout';
import CompilerComponent from './compiler.js';
import EditorComponent from './editor.js';

require("!style-loader!css-loader!./main.css")

function start() {
	var defaultConfig = {
		content: [{
			type: 'row',
			content: [{
				type: 'component',
				componentName: 'editor',
				componentState: {}
			}, {
				type: 'component',
				componentName: 'compiler',
				componentState: {}
			}]
		}]
	};

	var rootElement = $("#root");
	var layout = new GoldenLayout(defaultConfig, rootElement);

	layout.registerComponent('compiler', function (container, state) {
		return new CompilerComponent(container, state);
	});

	layout.registerComponent('editor', function (container, state) {
		return new EditorComponent(container, state);
	})

	layout.init()

	function sizeRoot() {
		var height = $(window).height() - rootElement.position().top;
		rootElement.height(height);
		layout.updateSize();
	}

	$(window).resize(sizeRoot);
	sizeRoot();
}

$(start);