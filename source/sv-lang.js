import * as monaco from 'monaco-editor';

const conf = {
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
    },

    brackets: [
        ['{', '}'],
        ['(', ')'],
        ['[', ']']
    ],

    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string', 'comment'] },
    ],

    surroundingPairs: [
        { open: '"', close: '"' },
    ]
};

const language = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: '',

    operators: [
        '+', '-', '&', '~&', '|', '~|', '^', '~^', '^~', '++', '--', '~',
        '!', '##', '@', '*', '/', '%', '**', '==', '!=', '===', '!==',
        '==?', '!=?', '&&', '||', '->', '<->', '<', '<=', '>', '>=',
        '>>', '>>>', '<<', '<<<', '=', '+=', '-=', '*=', '/=', '%=',
        '&=', '|=', '^=', '<<=', '<<<=', '>>=', '>>>=', '|->', '|=>',
        '#-#', '#=#'
    ],

    symbols: /[':;=\/*,.><+\-~&|\^$?#%!@]+/,

    // string escape codes
    escapes: /\\(?:[afntv\\"]|x[0-9A-Fa-f]{1,2}|[0-7]{1,3})/,

    // whitespace pattern
    ws: /[ \t\v\f\r\n]/,

    brackets: [
        { open: '\'{', close: '}', token: 'delimiter.curly' },
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '(*', close: '*)', token: 'delimiter.parenthesis' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '[', close: ']', token: 'delimiter.square' }
    ],

    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-zA-Z_$][a-zA-Z0-9_$]*/, {
                cases: { '@keywords': 'keyword',
                         '@default': 'identifier'
                }
            }],

            // TODO: escaped identifiers

            // TODO: smarter / nicer identifier classification

            // TODO: time literals

            // TODO: include file names

            // TODO: expanded brackets

            // whitespace
            { include: '@whitespace' },

            // preprocessor directives
            [/`[a-zA-Z_]\w*/, {
                cases: { '@directives': 'keyword',
                         '@default': 'type.identifier'
                }
            }],

            // delimiters and operators
            [/'{/, '@brackets'],
            [/\(\*/, '@brackets'],
            [/\*\)/, '@brackets'],
            [/[{}()\[\]]/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator',
                                    '@default': '' } } ],

            // numbers
            [/'[01xXzZ?]/, 'number.hex'],
            [/\d?[0-9_]*\.[0-9_]+([eE][\-+]?[0-9_]+)?/, 'number.float'],
            [/\d*[0-9_]*@ws*'[sS]?[dDbBoOhH]@ws*[0-9a-fA-F_xXzZ?]+/, 'number.hex'],
            [/\d[0-9_]*[eE][\-+]?[0-9_]+/, 'number.float'],
            [/\d+/, 'number'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' } ],
        ],

        comment: [
            [/[^\/*]+/, 'comment' ],
            [/\*\//,    'comment', '@pop'  ],
            [/[\/*]/,   'comment' ]
        ],

        string: [
            [/[^\\"]+/,  'string'],
            [/@escapes/, 'string.escape'],
            [/\\./,      'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' } ]
        ],

        whitespace: [
            [/@ws+/, ''],
            [/\/\*/,       'comment', '@comment' ],
            [/\/\/.*$/,    'comment'],
        ],
    },

    keywords: [
        'always', 'and', 'assign', 'begin', 'buf',
        'bufif0', 'bufif1', 'case', 'casex',
        'casez', 'cmos', 'deassign', 'default',
        'defparam', 'disable', 'edge', 'else',
        'end', 'endcase', 'endfunction', 'endmodule',
        'endprimitive', 'endspecify', 'endtable', 'endtask',
        'event', 'for', 'force', 'forever',
        'fork', 'function', 'highz0', 'highz1',
        'if', 'ifnone', 'initial', 'inout',
        'input', 'integer', 'join', 'large',
        'macromodule', 'medium', 'module', 'nand',
        'negedge', 'nmos', 'nor', 'not',
        'notif0', 'notif1', 'or', 'output',
        'parameter', 'pmos', 'posedge', 'primitive',
        'pull0', 'pull1', 'pulldown', 'pullup',
        'rcmos', 'real', 'realtime', 'reg',
        'release', 'repeat', 'rnmos', 'rpmos',
        'rtran', 'rtranif0', 'rtranif1', 'scalared',
        'small', 'specify', 'specparam', 'strong0',
        'strong1', 'supply0', 'supply1', 'table',
        'task', 'time', 'tran', 'tranif0',
        'tranif1', 'tri', 'tri0', 'tri1',
        'triand', 'trior', 'trireg', 'vectored',
        'wait', 'wand', 'weak0', 'weak1',
        'while', 'wire', 'wor', 'xor',
        'xnor', 'automatic', 'endgenerate', 'generate',
        'genvar', 'ifnone', 'localparam', 'noshowcancelled',
        'pulsestyle_ondetect', 'pulsestyle_onevent', 'showcancelled', 'signed',
        'unsigned', 'cell', 'config', 'design',
        'endconfig', 'incdir', 'include', 'instance',
        'liblist', 'library', 'use', 'uwire',
        'alias', 'always_comb', 'always_ff', 'always_latch',
        'assert', 'assume', 'before', 'bind',
        'bins', 'binsof', 'bit', 'break',
        'byte', 'chandle', 'class', 'clocking',
        'const', 'constraint', 'context', 'continue',
        'cover', 'covergroup', 'coverpoint', 'cross',
        'dist', 'do', 'endclass', 'endclocking',
        'endgroup', 'endinterface', 'endpackage', 'endprogram',
        'endproperty', 'endsequence', 'enum', 'expect',
        'export', 'extends', 'extern', 'final',
        'first_match', 'foreach', 'forkjoin', 'iff',
        'ignore_bins', 'illegal_bins', 'import', 'inside',
        'int', 'interface', 'intersect', 'join_any',
        'join_none', 'local', 'logic', 'longint',
        'matches', 'modport', 'new', 'null',
        'package', 'packed', 'priority', 'program',
        'property', 'protected', 'pure', 'rand',
        'randc', 'randcase', 'randsequence', 'ref',
        'return', 'sequence', 'shortint', 'shortreal',
        'solve', 'static', 'string', 'struct',
        'super', 'tagged', 'this', 'throughout',
        'timeprecision', 'timeunit', 'type', 'typedef',
        'union', 'unique', 'var', 'virtual',
        'void', 'wait_order', 'wildcard', 'with',
        'within', 'accept_on', 'checker', 'endchecker',
        'eventually', 'global', 'implies', 'let',
        'nexttime', 'reject_on', 'restrict', 's_always',
        's_eventually', 's_nexttime', 's_until', 's_until_with',
        'strong', 'sync_accept_on', 'sync_reject_on', 'unique0',
        'until', 'until_with', 'untyped', 'weak',
        'implements', 'interconnect', 'nettype', 'soft',
        '$root', '$unit'
    ],

    directives: [
        '`begin_keywords',
        '`celldefine',
        '`default_nettype',
        '`define',
        '`else',
        '`elsif',
        '`end_keywords',
        '`endcelldefine',
        '`endif',
        '`ifdef',
        '`ifndef',
        '`include',
        '`line',
        '`nounconnected_drive',
        '`pragma',
        '`resetall',
        '`timescale',
        '`unconnected_drive',
        '`undef',
        '`undefineall'
    ]
};

monaco.languages.register({
    id: 'system-verilog',
    extensions: ['.sv', '.svh', '.v'],
    aliases: ['SystemVerilog']
});

monaco.languages.setMonarchTokensProvider('system-verilog', language);
monaco.languages.setLanguageConfiguration('system-verilog', conf);