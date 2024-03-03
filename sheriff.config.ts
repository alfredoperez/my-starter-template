import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  version: 1,
  tagging: {
    'src/app': {
      'shared/<type>': 'shared:<type>',
      '<domain>/<type>': ['domain:<domain>', 'type:<type>'],
    },
  },
  depRules: {
    root: ['type:containers', 'shared:*', 'domain:*'],
    'domain:*': sameTag,
    'type:data': ['shared:data'],

    // 'type:ui': ['type:model', 'shared:form', 'shared:ui'],
  },
};
