const path = require(`path`);

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();
  config.module.rules.push({
    test: /\.js$/,
    include: /node_modules/,
    exclude: /node_modules[/\\](?!react-native-vector-icons|react-native-safe-area-view)/,
    use: {
      loader: "babel-loader",
      options: {
        // Disable reading babel configuration
        babelrc: false,
        configFile: false,

        // The configration for compilation
        presets: [
          ["@babel/preset-env", { useBuiltIns: "usage" }],
          "@babel/preset-react",
          "@babel/preset-flow"
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-proposal-object-rest-spread"
        ]
      }
    }
  });

  // modify storybook's file-loader rule to avoid conflicts with your inline svg
  const rules = config.module.rules;
  const fileLoaderRule = rules.find(rule => rule.test.test('.svg'));
  fileLoaderRule.exclude = /\.svg$/;
  rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack']
  });

  actions.replaceWebpackConfig(config);
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname), "node_modules"]
    }
  });
};
