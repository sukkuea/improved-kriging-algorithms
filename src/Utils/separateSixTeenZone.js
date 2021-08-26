import { findCenter, separateZone } from "./separateNode"

export const separateSixTeenZone = (zone) => {
  const sixteenZone = {}
  const arr = []
  const keys = Object.keys(zone)
  for (let i = 0; i < Object.keys(zone).length; i++) {
    const newCenter = findCenter(zone[keys[i]])
    const newZone = separateZone(zone[keys[i]], newCenter)
    const value = Object.values(newZone)
    arr.push(...value)
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > 0) {
      sixteenZone[i] = [
        ...arr[i]
      ]
    }
  }
  return sixteenZone
}
