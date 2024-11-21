import 'bootstrap';
import _ from 'underscore';
import { GoldenLayout, ItemType } from 'golden-layout';
import CompilerComponent from './compiler.js';
import EditorComponent from './editor.js';
import CodeSession from './session.js';

require("!style-loader!css-loader!./main.css")

function start() {
    var session = new CodeSession(1);
    var defaultConfig = {
        root: {
            type: 'row',
            content: [{
                type: 'component',
                componentType: 'editor',
                componentState: {session: session}
            }, {
                type: 'component',
                componentType: 'compiler',
                componentState: {session: session}
            }]
        }
    };

    var rootElement = $("#root");
    var layout = new GoldenLayout(rootElement.get(0));

    layout.getComponentEvent = (container, itemConfig) => {
        const { componentType, componentState } = itemConfig;
        if (componentType === 'editor')
            new EditorComponent(container, componentState);
        else if (componentType === 'compiler')
            new CompilerComponent(container, componentState);
        else
            throw new Error('Invalid component type.');
    }

    layout.loadLayout(defaultConfig);

    function sizeRoot() {
        var height = $(window).height() - rootElement.position().top;
        rootElement.height(height);
        layout.updateRootSize()
    }

    $(window).on('resize', sizeRoot);
    sizeRoot();
}

$(start);
