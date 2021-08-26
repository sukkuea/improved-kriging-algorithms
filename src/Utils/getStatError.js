export const calculateError = (node = [], model = "exponential") => {
  const meanError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude[model] - attitude);
    }, 0) / node.length;

  const meanOfPercentageError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude[model] - attitude) / attitude;
    }, 0) / node.length;

  const meanAbsoluteError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.abs(predictAttitude[model] - attitude);
    }, 0) / node.length;
  const meanSquareError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude[model] - attitude, 2);
    }, 0) / node.length;

  const rootMeanSquareError = Math.sqrt(
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude[model] - attitude, 2);
    }, 0) / node.length
  );
  return {
    meanError,
    meanOfPercentageError,
    meanAbsoluteError,
    meanSquareError,
    rootMeanSquareError,
  };
};

export const getAllErrorModel = (nodes = []) => {
  const errorOfExponential = calculateError(nodes, "exponential");

  const errorOfLinear = calculateError(nodes, "linear");

  const errorOfSherical = calculateError(nodes, "spherical");

  const errorOfPentaSpherical = calculateError(nodes, "pentaspherical");

  const errorOfGaussian = calculateError(nodes, "gaussian");
  const errorOfTrendline = calculateError(nodes, "trendline");

  const errorOfExponentialWithKIteration = calculateError(
    nodes,
    "exponentialWithKIteration"
  );
  const errorOfExponentialWithConstant = calculateError(
    nodes,
    "exponentialWithConstant"
  );
  const result = {
    exponential: errorOfExponential,
    linear: errorOfLinear,
    sherical: errorOfSherical,
    pentaspherical: errorOfPentaSpherical,
    gaussian: errorOfGaussian,
    trendline: errorOfTrendline,
    exponentialWithKIteration: errorOfExponentialWithKIteration,
    exponentialWithConstant: errorOfExponentialWithConstant,
  };
  return result;
};
