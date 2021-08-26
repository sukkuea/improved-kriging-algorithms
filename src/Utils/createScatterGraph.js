export default (allRangeOfNodes, semiVarioGram, model = "exponential") => {
  let scatterGraph = [];
  for (let i = 0; i < allRangeOfNodes.length - 1; i++) {
    const length = allRangeOfNodes[i].length;
    const lengthSemi = semiVarioGram[model][i].length;
    const range = allRangeOfNodes[i].slice(0, length - 1);
    const semi = semiVarioGram[model][i].slice(0, lengthSemi - 1);

    scatterGraph.push({
      x: range,
      y: semi,
      mode: "markers",
      name: model,
      type: "scatter",
    });
  }
  return scatterGraph;
};
