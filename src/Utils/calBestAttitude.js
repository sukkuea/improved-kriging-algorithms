import math from "mathjs";
import createRangeTable from "./createRangeTable";
import tranformSemivariance from "./tranformSemivariance";
import createMatrix from "./createMatrix";
import getStatError from "./getStatError";
import { findCenter, separateZone } from "./separateNode";

const arrayRotate = (arr = []) => {
  let data = [];
  for (let i = 0; i < arr.length; i++) {
    data[i] = arr[i + 1];
    if (i === arr.length - 1) {
      data[i] = arr[0];
    }
  }
  return data;
};
const findMaxRange = (range = []) => {
  let max = 0;
  range.map(({ range }) => {
    return range.map((v) => {
      if (v > max) {
        max = v;
      }
    });
  });
  return max;
};

export const recursiveNode = (
  nodes = [],
  variable,
  temp = 0,
  tempResult = []
) => {
  const rotateNodes = arrayRotate(nodes); // rotate
  let result = [];
  if (temp === nodes.length) {
    const range = createRangeTable(rotateNodes); //cal range
    let maxRange = findMaxRange(range); // max range
    const data = calculateBestNuggetSillRange(range, maxRange, variable); //cal last node
    result = [...tempResult, data];
    return result;
  } else {
    const range = createRangeTable(rotateNodes); //cal range
    let maxRange = findMaxRange(range); // max range
    const data = calculateBestNuggetSillRange(range, maxRange, variable); //cal last node
    result = [...tempResult, data];
    return recursiveNode(rotateNodes, variable, (temp += 1), result);
  }
};

export const calCulateAttitude = (nodes = [], variable) => {
  const recursiveResult = recursiveNode(nodes, variable, 0);
  const bestSumList = recursiveResult.map(({ bestSum }) => bestSum);
  const range = createRangeTable(nodes); //transform range for each node
  let maxRange = findMaxRange(range);
  const data = calculateBestNuggetSillRange(range, maxRange, variable);

  const allRangeOfNodes = range.map(({ range }) => range);
  const result = {
    bestSumList,
    bestSum: data.bestSum, //node attitue 31
    allRangeOfNodes,
    semiVarioGram: data.semiVarioGram,
    error: data.minError,
    bestNugget: data.bestNugget,
    bestSill: data.bestSill,
    bestRange: data.bestRange,
  };
  return result;
};

const calBestAttitudeLastNode = (vairiantNodeObject, model = "exponential") => {
  const convertMatrix = createMatrix(vairiantNodeObject);
  let A = convertMatrix;
  let b = vairiantNodeObject[vairiantNodeObject.length - 1][model];
  const inverMatrix = A.length === 1 ? A : math.inv(A);
  let w = math.multiply(inverMatrix, b);
  let sum = 0;
  for (let i = 0; i < vairiantNodeObject.length - 1; i += 1) {
    sum += vairiantNodeObject[i].attitude * w[i];
  }
  const errorPedictionModel = math.sum(
    math.dotMultiply(
      vairiantNodeObject[vairiantNodeObject.length - 1][model],
      w
    )
  );
  // to do add error model 5 mel

  return {
    sum,
    errorPedictionModel,
  };
};

const calculateBestNuggetSillRange = (range, maxRange, variable) => {
  let nuggetArray = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //11 //10
  let sillArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //  10
  let sillFromExponent = [
    0.01,
    0.02,
    0.03,
    0.04,
    0.05,
    0.06,
    0.07,
    0.08,
    0.09,
    0.1,
  ];

  let minError = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0,
    exponentialWithKIteration: 0,
    exponentialWithConstant: 0,
  };

  let semiVarioGram = {
    exponential: [],
    linear: [],
    spherical: [],
    pentaspherical: [],
    gaussian: [],
    trendline: [],
    exponentialWithKIteration: [],
    exponentialWithConstant: [],
  };

  let bestNugget = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0,
    trendline: 0,
    exponentialWithKIteration: 0,
    exponentialWithConstant: 0,
  };

  let bestSill = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0,
    trendline: 0,
    exponentialWithKIteration: 0,
    exponentialWithConstant: 0,
  };

  let bestRange = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0,
    trendline: 0,
    exponentialWithKIteration: 0,
    exponentialWithConstant: 0,
  };

  let bestSum = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0,
    trendline: 0,
    exponentialWithKIteration: 0,
    exponentialWithConstant: 0,
  };

  for (let i = 0; i < nuggetArray.length; i++) {
    for (let j = 0; j < sillArray.length; j++) {
      const vairiantNodeObject = tranformSemivariance(range)(
        +nuggetArray[i],
        +sillArray[j],
        maxRange
      );

      if (!!variable.nugget && !!variable.sill && !!variable.range) {
        const vairiantNodeObjectConstant = tranformSemivariance(range)(
          Number(variable.nugget),
          Number(variable.sill),
          Number(variable.range)
        );

        const modelExponentialWithContant = calBestAttitudeLastNode(
          vairiantNodeObjectConstant,
          "exponential"
        );

        minError["exponentialWithConstant"] =
          modelExponentialWithContant.errorPedictionModel;
        bestNugget["exponentialWithConstant"] = variable.nugget;
        bestSill["exponentialWithConstant"] = variable.sill;
        bestRange["exponentialWithConstant"] = variable.range;
        bestSum["exponentialWithConstant"] = modelExponentialWithContant.sum;
        semiVarioGram[
          "exponentialWithConstant"
        ] = vairiantNodeObjectConstant.map(({ exponential }) => exponential);
      }

      const modelExponential = calBestAttitudeLastNode(
        vairiantNodeObject,
        "exponential"
      );

      const modelLinear = calBestAttitudeLastNode(vairiantNodeObject, "linear");

      const modelSpherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        "spherical"
      );
      const modelPentaSpherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        "pentaspherical"
      );
      const modelGussian = calBestAttitudeLastNode(
        vairiantNodeObject,
        "gaussian"
      );
      const modelTrendline = calBestAttitudeLastNode(
        vairiantNodeObject,
        "exponentialPolynomialTrendlines"
      );

      minError["trendline"] = modelTrendline.errorPedictionModel;
      bestRange["trendline"] = maxRange;
      bestSum["trendline"] = modelTrendline.sum;
      semiVarioGram["trendline"] = vairiantNodeObject.map(
        ({ exponentialPolynomialTrendlines }) => exponentialPolynomialTrendlines
      );

      const ExponentialVairiantWithSubSill = tranformSemivariance(range)(
        +nuggetArray[i],
        +sillFromExponent[j],
        maxRange
      );

      const modelExponentialWithKIteration = calBestAttitudeLastNode(
        ExponentialVairiantWithSubSill,
        "exponential"
      );

      semiVarioGram["trendline"] = vairiantNodeObject.map(
        ({ exponentialPolynomialTrendlines }) => exponentialPolynomialTrendlines
      );

      minError["trendline"] = modelTrendline.errorPedictionModel;
      bestRange["trendline"] = maxRange;
      bestSum["trendline"] = modelTrendline.sum;
      semiVarioGram["trendline"] = vairiantNodeObject.map(
        ({ exponentialPolynomialTrendlines }) => exponentialPolynomialTrendlines
      );

      if (minError["exponentialWithKIteration"] === 0) {
        minError["exponentialWithKIteration"] =
          modelExponentialWithKIteration.errorPedictionModel;
        bestNugget["exponentialWithKIteration"] = nuggetArray[i];
        bestSill["exponentialWithKIteration"] = sillFromExponent[j];
        bestRange["exponentialWithKIteration"] = maxRange;
        bestSum["exponentialWithKIteration"] =
          modelExponentialWithKIteration.sum;
        semiVarioGram[
          "exponentialWithKIteration"
        ] = ExponentialVairiantWithSubSill.map(
          ({ exponential }) => exponential
        );
      }

      if (
        modelExponentialWithKIteration.errorPedictionModel <
        minError["exponentialWithKIteration"]
      ) {
        minError["exponentialWithKIteration"] =
          modelExponentialWithKIteration.errorPedictionModel;
        bestNugget["exponentialWithKIteration"] = nuggetArray[i];
        bestSill["exponentialWithKIteration"] = sillFromExponent[j];
        bestRange["exponentialWithKIteration"] = maxRange;
        bestSum["exponentialWithKIteration"] =
          modelExponentialWithKIteration.sum;
        semiVarioGram[
          "exponentialWithKIteration"
        ] = ExponentialVairiantWithSubSill.map(
          ({ exponential }) => exponential
        );
      }

      if (minError["gaussian"] === 0) {
        minError["gaussian"] = modelGussian.errorPedictionModel;
        bestNugget["gaussian"] = nuggetArray[i];
        bestSill["gaussian"] = sillArray[j];
        bestRange["gaussian"] = maxRange;
        bestSum["gaussian"] = modelGussian.sum;
        semiVarioGram["gaussian"] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      if (modelGussian.errorPedictionModel < minError["gaussian"]) {
        minError["gaussian"] = modelGussian.errorPedictionModel;
        bestNugget["gaussian"] = nuggetArray[i];
        bestSill["gaussian"] = sillArray[j];
        bestRange["gaussian"] = maxRange;
        bestSum["gaussian"] = modelGussian.sum;
        semiVarioGram["gaussian"] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      //

      if (minError["pentaspherical"] === 0) {
        minError["pentaspherical"] = modelPentaSpherical.errorPedictionModel;
        bestNugget["pentaspherical"] = nuggetArray[i];
        bestSill["pentaspherical"] = sillArray[j];
        bestRange["pentaspherical"] = maxRange;
        bestSum["pentaspherical"] = modelPentaSpherical.sum;
        semiVarioGram["pentaspherical"] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }
      if (
        modelPentaSpherical.errorPedictionModel < minError["pentaspherical"]
      ) {
        minError["pentaspherical"] = modelPentaSpherical.errorPedictionModel;
        bestNugget["pentaspherical"] = nuggetArray[i];
        bestSill["pentaspherical"] = sillArray[j];
        bestRange["pentaspherical"] = maxRange;
        bestSum["pentaspherical"] = modelPentaSpherical.sum;
        semiVarioGram["pentaspherical"] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }

      /*linear*/
      if (minError["linear"] === 0) {
        minError["linear"] = modelLinear.errorPedictionModel;
        bestNugget["linear"] = nuggetArray[i];
        bestSill["linear"] = sillArray[j];
        bestRange["linear"] = maxRange;
        bestSum["linear"] = modelLinear.sum;
        semiVarioGram["linear"] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      if (modelLinear.errorPedictionModel < minError["linear"]) {
        minError["linear"] = modelLinear.errorPedictionModel;
        bestNugget["linear"] = nuggetArray[i];
        bestSill["linear"] = sillArray[j];
        bestRange["linear"] = maxRange;
        bestSum["linear"] = modelLinear.sum;
        semiVarioGram["linear"] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      /*linear*/

      /* spherical */
      if (minError["spherical"] === 0) {
        minError["spherical"] = modelSpherical.errorPedictionModel;
        bestNugget["spherical"] = nuggetArray[i];
        bestSill["spherical"] = sillArray[j];
        bestRange["spherical"] = maxRange;
        bestSum["spherical"] = modelSpherical.sum;
        semiVarioGram["spherical"] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      if (modelSpherical.errorPedictionModel < minError["spherical"]) {
        minError["spherical"] = modelSpherical.errorPedictionModel;
        bestNugget["spherical"] = nuggetArray[i];
        bestSill["spherical"] = sillArray[j];
        bestRange["spherical"] = maxRange;
        bestSum["spherical"] = modelSpherical.sum;
        semiVarioGram["spherical"] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      /* spherical */

      /*exponential*/

      if (minError["exponential"] === 0) {
        minError["exponential"] = modelExponential.errorPedictionModel;
        bestNugget["exponential"] = nuggetArray[i];
        bestSill["exponential"] = sillArray[j];
        bestRange["exponential"] = maxRange;
        bestSum["exponential"] = modelExponential.sum;
        semiVarioGram["exponential"] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      if (modelExponential.errorPedictionModel < minError["exponential"]) {
        minError["exponential"] = modelExponential.errorPedictionModel;
        bestNugget["exponential"] = nuggetArray[i];
        bestSill["exponential"] = sillArray[j];
        bestRange["exponential"] = maxRange;
        bestSum["exponential"] = modelExponential.sum;
        semiVarioGram["exponential"] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      /*exponential*/
    }
  }

  return {
    bestRange,
    bestNugget,
    bestSill,
    bestSum,
    semiVarioGram,
    minError,
  };
};
