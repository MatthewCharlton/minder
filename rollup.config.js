let pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      name: pkg.name,
      format: 'cjs'
    }
  ]
};
