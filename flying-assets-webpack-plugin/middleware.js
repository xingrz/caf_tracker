module.exports = function (compiler) {
  return (req, res, next) => {
    res.send(compiler.html);
  };
};
