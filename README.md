# Improved Kriging Algorithms\

Prediction on Spatial Elevation Using Improved Kriging Algorithms: An Application in Environmental Management

# Guide
this project create by [ReactJS](https://reactjs.org/)

so first you should install [NodeJS](https://nodejs.org/en/) on your computer or maching
download [here](https://nodejs.org/dist/v14.17.5/node-v14.17.5.pkg) 

# Start Project

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


# Core and function

```
Utils/calBestAttitude.js

function calCulateAttitude(node:Array, variable:Object): result: Array

```
purpose to get the last node attitude and predict all node model

> `@param` nodes is array contain like ``[{latitude, longtitude, attitude}]``

>`@params` variable is object contain `{nugget:number, sill:number, range: number}`

 @result array of object like 
 ```
   {
     bestSumList: [number] 
     bestSum: number,
     allRangOfNodes: [ rage:number ],  
     semiVarioGram: {
       exponential: Array,
       spherical: Array,
       pentaspherical: Array.
       gaussian: Array,
       exponentialPolynomialTrendlines: Array,
       trendline: Array
     },
     error,
     bestNugget,
     bestSill,
     bestRange
   }
 ```
 > `@bestSumList` nunber is the number of best of prediction Attitude all node  
 > `@bestSum`  is the result attitude of latest node  
 > `@allRangOfNodes`  all nodejs range  
 > `@semiVarioGram` is the `semivariance` for each model and deep each node eg.  
 
 > `@error` is the `error` for for each model and deep each node.  
 > `@bestNugget` is the `bestNugget`  for for each model and deep each node
  > `@bestSill` is the `bestSill`  for for each model and deep each node
 > `@bestRange`  is the `bestRange`  for for each model and deep each node 


