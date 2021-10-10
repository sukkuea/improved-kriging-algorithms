const RMSE = require('rmse')
const reduceParser = (
  lookupTable, model) => (acc, next) => {
    return [
      ...acc,
      {
        actual: next.attitude,
        predicted: lookupTable[next.id].predictAttitude[model]
      }
    ]
  }
export const getZoneRMSE = (zones, lookupTable) => {
  console.log({ zones, lookupTable })

  const groupModelExponential = zones.reduce(reduceParser(
    lookupTable,
    'exponential'
  ), [])
  const groupModelExponentialConst = zones.reduce(reduceParser(
    lookupTable,
    'exponentialWithConstant'
  ), [])
  const groupModelExponentialWithKIteration = zones.reduce(reduceParser(
    lookupTable,
    'exponentialWithKIteration'
  ), [])
  const groupModelGaussian = zones.reduce(reduceParser(
    lookupTable,
    'gaussian'
  ), [])
  const groupModelLinear = zones.reduce(reduceParser(
    lookupTable,
    'linear'
  ), [])
  const groupModelPentaspherical = zones.reduce(reduceParser(
    lookupTable,
    'pentaspherical'
  ), [])
  const groupModelSpherical = zones.reduce(reduceParser(
    lookupTable,
    'spherical'
  ), [])
  const groupModelTrendlinel = zones.reduce(reduceParser(
    lookupTable,
    'trendline'
  ), [])


  const rmseExponential = RMSE.rmse(groupModelExponential)
  const rmseExponentialConst = RMSE.rmse(groupModelExponentialConst)
  const rmseExponentialWithKIteration = RMSE.rmse(groupModelExponentialWithKIteration)
  const rmseGaussian = RMSE.rmse(groupModelGaussian)
  const rmseLinear = RMSE.rmse(groupModelLinear)
  const rmsePentaspherical = RMSE.rmse(groupModelPentaspherical)
  const rmseSpherical = RMSE.rmse(groupModelSpherical)
  const rmseTrendlinel = RMSE.rmse(groupModelTrendlinel)
  const errors = {
    'exponential': rmseExponential,
    'exponentialWithConstant': rmseExponentialConst,
    'exponentialWithKIteration': rmseExponentialWithKIteration,
    'gaussian': rmseGaussian,
    'linear': rmseLinear,
    'pentaspherical': rmsePentaspherical,
    'spherical': rmseSpherical,
    'trendline': rmseTrendlinel,
  }
  let key = Object.keys(errors).reduce((key, v) => errors[v] < errors[key] ? v : key);
  console.log(errors, key)
  return {
    errors,
    key
  }
}