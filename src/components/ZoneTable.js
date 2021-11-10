import dayjs from 'dayjs';
import React from 'react'
import { max, min, mean } from 'simple-statistics';
import { getZoneRMSE } from '../Utils/calculateRMSEzone';

const models = (isShowConstant) => ([
  'exponential',
  ...(isShowConstant ? ['exponentialWithConstant'] : []),
  'exponentialWithKIteration',
  'gaussian',
  'linear',
  'pentaspherical',
  'spherical',
  'trendline',
])

const ZoneBody = ({ zoneNumber, zoneBodyData, nodeLookupTable, isShowConstant, slopeList, inputSlope,
  errorAndSelectedModel, time }) => {
  const nodeId = zoneBodyData.id
  const predictAttitude = nodeLookupTable[nodeId].predictAttitude
  const isLessThjanInputSlope = inputSlope && slopeList[zoneNumber] > inputSlope
  const { key, errors } = errorAndSelectedModel
  return (
    <tr key={zoneBodyData.id + '-' + slopeList[zoneNumber]}>
      <td>{Number(zoneNumber) + 1}</td>
      <td>{zoneBodyData.latitude}</td>
      <td>{zoneBodyData.longtitude}</td>
      <td>{zoneBodyData.attitude}</td>
      {
        models(isShowConstant).map((model) => {
          const tempModel = isLessThjanInputSlope ? key : model;

          return (<td key={zoneBodyData.id + '-' + model + '-' + inputSlope + '-' + slopeList[zoneNumber]}>{predictAttitude[tempModel]}</td>)
        })
      }
      <td>{slopeList[zoneNumber]}</td>
      <td>{isLessThjanInputSlope ? key : 'use default'}</td>
      {
        models(isShowConstant).map((model) => {

          return (<td key={zoneBodyData.id + '-' + model + '-' + inputSlope + '-' + errors[model]}>{errors[model]}</td>)
        })
      }
      <td>{`${time.hours} h ${time.minutes} m ${time.seconds}s`}</td>
    </tr>
  )
}

const ZoneTable = ({ zones, nodes, isShowConstant, inputSlope, startTime = dayjs(), endTime = dayjs() }) => {
  const nodeLookupTable = nodes.reduce((acc, next) => {
    const key = next.id
    return {
      ...acc,
      [key]: {
        ...next
      }
    }
  }, {})
  const zoneKeys = Object.keys(zones)
  const errorAndKeyEachZone = []
  for (let i = 0; i < zoneKeys.length; i++) {
    const result = getZoneRMSE(zones[zoneKeys[i]], nodeLookupTable)
    errorAndKeyEachZone.push({
      zone: +zoneKeys[i] + 1,
      ...result
    })
  }
  const hours = endTime.diff(startTime, 'h');
  const minutes = endTime.diff(startTime, 'm');
  const seconds = endTime.diff(startTime, 's');
  const time = {
    seconds,
    minutes,
    hours
  }
  console.log(errorAndKeyEachZone)
  // {
  //   1 :[],
  //   2: [],
  // }
  const getSlopeZone = zoneKeys.reduce((acc, next) => {
    const nodesOfZone = zones[next]
    const latArr = nodesOfZone.map(n => Number(n.latitude))
    const lonArr = nodesOfZone.map(n => Number(n.longtitude))
    const attArr = nodesOfZone.map(n => Number(n.attitude))

    const maxLat = latArr.length > 1 ? max(latArr) : latArr[0]
    const minlat = min(latArr)

    const maxLon = max(lonArr)
    const minLon = min(lonArr)

    const maxAtt = mean(attArr)
    const minAtt = min(attArr)

    const slope = (maxAtt - minAtt) / Math.sqrt(
      Math.pow(maxLat - minlat, 2) +
      Math.pow(maxLon - minLon, 2)
    )
    const isOnlyOneInZone = nodesOfZone.length === 1
    return {
      ...acc,
      [next]: !isOnlyOneInZone ? slope * 100 : 0
    }

  }, {})

  return (
    <div style={{ display: 'none' }}>
      <table id="zone-table">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Latitude</th>
            <th>Longtitude</th>
            <th>Attitude</th>
            <th>Predict Exponential</th>
            {isShowConstant && <th>Predict Exponential With Constant</th>}
            <th>Predict Exponential With K Iteration</th>
            <th>Predict Gaussian</th>
            <th>Predict Linear</th>
            <th>Predict Pentaspherical</th>
            <th>Predict Spherical</th>
            <th>Predict Trendline</th>
            <th>Slope %</th>
            <th>Selected Model</th>
            <th>Error Exponential</th>
            {isShowConstant && <th>Error Exponential With Constant</th>}
            <th>Error Exponential With K Iteration</th>
            <th>Error Gaussian</th>
            <th>Error Linear</th>
            <th>Error Pentaspherical</th>
            <th>Error Spherical</th>
            <th>Error Trendline</th>
            <th>Time HH:MM:SS</th>
          </tr>
        </thead>
        <tbody>
          {
            zoneKeys.map((zoneNumber, index) => {
              const zoneBody = zones[zoneNumber]
              const errorAndSelectedModel = errorAndKeyEachZone[index]
              return zoneBody.map((zoneBodyData) => <ZoneBody
                key={zoneNumber + '-' + zoneBodyData.id}
                zoneNumber={zoneNumber}
                zoneBodyData={zoneBodyData}
                nodeLookupTable={nodeLookupTable}
                isShowConstant={isShowConstant}
                slopeList={getSlopeZone}
                inputSlope={inputSlope}
                errorAndSelectedModel={errorAndSelectedModel}
                time={time}
              />)
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ZoneTable