import React from 'react'

const ZoneBody = ({ zoneNumber, zoneBodyData, nodeLookupTable, isShowConstant }) => {
  const nodeId = zoneBodyData.id
  const predictAttitude = nodeLookupTable[nodeId].predictAttitude
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
    <tr key={zoneBodyData.id}>
      <td>{Number(zoneNumber) + 1}</td>
      <td>{zoneBodyData.latitude}</td>
      <td>{zoneBodyData.longtitude}</td>
      <td>{zoneBodyData.attitude}</td>
      {
        models.map((model) => {
          return (<td key={zoneBodyData.id + '-' + model}>{predictAttitude[model]}</td>)
        })
      }
    </tr>
  )
}

const ZoneTable = ({ zones, nodes, isShowConstant, ...props }) => {
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
              />)
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ZoneTable