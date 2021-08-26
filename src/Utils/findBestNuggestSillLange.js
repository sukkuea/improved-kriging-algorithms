import math from 'mathjs';
import createRangeTable from './createRangeTable';
import tranformSemivariance from './tranformSemivariance';
import createMatrix from './createMatrix';
export const calCulateAttitude = (prod = []) => {
  const { id, attitude } = prod[prod.length - 1];
  let maxRange = 0;
  const range = createRangeTable(prod); //calc range
  //   {
  //       range: [303.23,323.323]
  //   }
  range.map(({ range }) => {
    return range.map(v => {
      if (v > maxRange) {
        maxRange = v;
      }
    });
  });

  const allRangeOfNodes = range.map(({ range }) => range); //[303.23,323.323]
  const rangeArray = [];

  for (let i = 1; i <= 10; i++) {
    rangeArray.push((i * maxRange) / 10); // 100 [100,200,300,400]
  }
  //   let nuggetArray = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //11 //10
  //   let sillArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //  10

  let bestNugget = 0;
  let bestSill = 0.1;
  let min = 10;
  let bestSum = 0;
  let semiVarioGram;
  const vairiantNodeObject = tranformSemivariance(range)(
    bestNugget,
    bestSill,
    maxRange
  );
  const convertMatrix = createMatrix(vairiantNodeObject);
  let A = convertMatrix;
  let b = vairiantNodeObject[vairiantNodeObject.length - 1].semi;
  let w = math.multiply(math.inv(A), b);
  let sum = 0;
  for (let i = 0; i < vairiantNodeObject.length - 1; i += 1) {
    sum += vairiantNodeObject[i].attitude * w[i];
  }
  console.log({ sum });
  console.log({ vairiantNodeObject, w });
  const error = math.sum(
    math.dotMultiply(vairiantNodeObject[vairiantNodeObject.length - 1].semi, w)
  );
  //   for (let i = 0; i < nuggetArray.length; i++) {
  //     for (let j = 0; j < sillArray.length; j++) {
  //       for (let k = 0; k < rangeArray.length; k++) {
  //         const vairiantNodeObject = tranformSemivariance(range)(
  //           +nuggetArray[i],
  //           +sillArray[j],
  //           +rangeArray[k]
  //         );
  //         const convertMatrix = createMatrix(vario);
  //         let A = convertMatrix;
  //         let b = vairiantNodeObject[vario.length - 1].semi;
  //         let w = math.multiply(math.inv(A), b);

  //         let sum = 0;
  //         for (let i = 0; i < vario.length - 1; i += 1) {
  //           sum += vairiantNodeObject[i].attitude * w[i];
  //         }

  //         const error = math.sum(
  //           math.dotMultiply(
  //             vairiantNodeObject[vairiantNodeObject.length - 1].semi,
  //             w
  //           )
  //         );

  //         if (error < min) {
  //           min = error;
  //           bestNugget = i;
  //           bestSill = j;
  //           bestRange = k;
  //           bestSum = sum;
  //           semiVarioGram = vairiantNodeObject.map(({ semi }) => semi);
  //         }
  //       }
  //     }
  //   }

  console.log('CALCULATE WITH NODES FIND BEST  NUGGET, SILL, RANGE');
  console.log('***********RESULT***********');
  console.log(`find attitude in node id`);
  console.log(id);
  console.log('predict  error:');
  console.log(min);
  console.log('NUGGET');
  //   console.log(nuggetArray[bestNugget]);
  console.log('SILL');
  //   console.log(sillArray[bestSill]);
  console.log('RANGE');
  //   console.log(rangeArray[bestRange]);
  console.log(`EXPECT ATTITUDE NODE ${id}`);
  console.log(bestSum);
  console.log(`ACTUAL ATTITUDE NODE ${id}`);
  console.log(attitude);
  return {
    bestSum,
    allRangeOfNodes,
    semiVarioGram
  };
};
