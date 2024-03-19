function formatUnderline(text) {
  return text.split("_").join("-");
}

function formatChoTot(text) {
  return text.split("_").join("-").replaceAll("-", " ");
}

module.exports = {
  formatUnderline,
  formatChoTot,
};
