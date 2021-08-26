export const separateNineZone = (nodes = [], n) => {
  const perZone = Math.floor(nodes.length / n)
  let zone = {}
  const tempNode = [
    ...nodes
  ]
  for (let i = 0; i < n; i++) {
    let tempZone = []
    for (let j = 0; j < perZone; j++) {
      const nodeObj = tempNode.shift()
      tempZone.push(nodeObj)
    }
    zone[i] = tempZone

  }
  zone[n - 1] = [
    ...zone[n - 1],
    ...tempNode
  ]


  return zone
}