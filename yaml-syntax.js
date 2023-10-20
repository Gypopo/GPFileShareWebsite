Prism.languages.yaml = {
    'comment': /#.*/,
    'key': {
        pattern: /(^|\s)\w+(?=\s*:)/,
        lookbehind: true,
        alias: 'attr',
    },
    'value': {
        pattern: /:\s\S+/,
        inside: {
            'string': /".*?"/,
            'number': /\b(\d+(\.\d*)?|\.\d+)\b/,
            'boolean': /\b(true|false)\b/,
            'null': /\bnull\b/,
            'sequence-item': {
                pattern: /^(\s*-\s+)(.+)/m,
                lookbehind: true,
                inside: {
                  'punctuation': /^-\s/,
                  'alias': Prism.languages.yaml,
                },
              },
            'multiline-string': {
                pattern: /(\||\>)\s*[\s\S]*?(?=\n|$)/,
                alias: 'string',
                inside: {
                    'delimiter': /^(\||\>)/,
                    'content': /.*/,
                },
            },
        },
    },
};

Prism.languages.yaml.value.inside.string.inside = Prism.languages.yaml;