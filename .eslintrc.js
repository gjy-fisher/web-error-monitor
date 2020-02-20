// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',

  // add your custom rules here
  'rules': {
    "import/no-unresolved": [0],
    "import/no-extraneous-dependencies": [0],
    "no-unused-vars": [1],
    "no-param-reassign": [0],
    "max-len": ["error", 150],
    "import/first": [0],
    "global-require": [1],
    "arrow-parens": [1, "as-needed"],
    "no-use-before-define": [1],
    "no-multi-assign": [0],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-underscore-dangle": [0],
    "linebreak-style": [0, "windows"],
    "indent": ["error", 4],
    "no-trailing-spaces": [0],
    "comma-dangle": ["error", "only-multiline"],
    "comma-spacing": ["error", { "before": false, "after": true }],  
    "prefer-template": [0],
    "prefer-rest-params": [0],
    "no-new-func": [1],
    "semi": ["error", "never"],//语句强制不用分号结尾
    "no-nested-ternary": [1],

    // don't require .vue extension when importing
    'import/extensions': [1, 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    "import/prefer-default-export": [0],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
