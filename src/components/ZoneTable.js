import React from 'react'
import { max, min } from 'simple-statistics';

const ZoneBody = ({ zoneNumber, zoneBodyData, nodeLookupTable, isShowConstant, sloveList, inputSlove }) => {
  const nodeId = zoneBodyData.id
  const predictAttitude = nodeLookupTable[nodeId].predictAttitude
  const isLessThjanInputSlove = inputSlove && sloveList[zoneNumber] < inputSlove
  const models = [
    'exponential',
    ...(isShowConstant ? ['exponentialWithConstant'] : []),
    'exponentialWithKIteration',
    'gaussian',
    'linear',
    'pentaspherical',
    'spherical',
    'trendline',
  ]
  return (
    <tr key={zoneBodyData.id + '-' + sloveList[zoneNumber]}>
      <td>{Number(zoneNumber) + 1}</td>
      <td>{zoneBodyData.latitude}</td>
      <td>{zoneBodyData.longtitude}</td>
      <td>{zoneBodyData.attitude}</td>
      {
        models.map((model) => {
          const tempModel = isLessThjanInputSlove ? 'exponentialWithKIteration' : model;

          return (<td key={zoneBodyData.id + '-' + model + '-' + inputSlove + '-' + sloveList[zoneNumber]}>{predictAttitude[tempModel]}</td>)
        })
      }
      <td>{sloveList[zoneNumber]}</td>
    </tr>
  )
}

const ZoneTable = ({ zones, nodes, isShowConstant, inputSlove }) => {
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
  // {
  //   1 :[],
  //   2: [],
  // }
  const getSloveZone = zoneKeys.reduce((acc, next) => {
    const nodesOfZone = zones[next]
    const latArr = nodesOfZone.map(n => Number(n.latitude))
    const lonArr = nodesOfZone.map(n => Number(n.longtitude))
    const attArr = nodesOfZone.map(n => Number(n.attitude))

    const maxLat = latArr.length > 1 ? max(latArr) : latArr[0]
    const minlat = min(latArr)

    const maxLon = max(lonArr)
    const minLon = min(lonArr)

    const maxAtt = max(attArr)
    const minAtt = min(attArr)

    const slove = (maxAtt - minAtt) / Math.sqrt(
      Math.pow(maxLat - minlat, 2) +
      Math.pow(maxLon - minLon, 2)
    )
    const isOnlyOneInZone = nodesOfZone.length === 1
    return {
      ...acc,
      [next]: !isOnlyOneInZone ? slove * 100 : 0
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
            <th>Slove %</th>
          </tr>
        </thead>
        <tbody>
          {
            zoneKeys.map((zoneNumber) => {
              const zoneBody = zones[zoneNumber]
              return zoneBody.map((zoneBodyData) => <ZoneBody
                key={zoneNumber + '-' + zoneBodyData.id}
                zoneNumber={zoneNumber}
                zoneBodyData={zoneBodyData}
                nodeLookupTable={nodeLookupTable}
                isShowConstant={isShowConstant}
                sloveList={getSloveZone}
                inputSlove={inputSlove}
              />)
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ZoneTable