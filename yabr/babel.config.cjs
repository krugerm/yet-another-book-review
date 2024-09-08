// babel.config.cjs
module.exports = {
  presets: [
    '@babel/preset-env',  // Transpile modern JavaScript to ES5 based on target environments
    '@babel/preset-react', // Transpile JSX syntax
    '@babel/preset-typescript', // Transpile TypeScript if you're using it
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Optimize Babel helper code and avoid duplication
    '@babel/plugin-proposal-class-properties', // Enable class properties syntax
    '@babel/plugin-proposal-object-rest-spread', // Enable object rest/spread syntax
  ],
};
