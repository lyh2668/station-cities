const axios = require('axios')
const fs = require('fs')

const version = '1.9053'
const URL = `https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=${version}`

const instance = axios.create()

const getTrainStations = async () => {
  const res = await instance.get(URL)
  if (res && res.data) {
    // 提取字符串
    const stationsString = res.data.split('\'')
    const stations = stationsString[1].split('@')
    const arr = []
    for (let i = 1; i < stations.length; ++i) {
      const oneStation = stations[i].split('|')
      const obj = {
        name: oneStation[1],
        code: oneStation[2],
        ename: oneStation[3],
        sign: oneStation[0],
        short: oneStation[4],
        firstLetter: oneStation[0][0]
      }
      arr.push(obj)
    }
    return arr
  }
}

// train
getTrainStations().then((res) => {
  fs.writeFile('stations.json', JSON.stringify(res), err => {
    if (err) {
      console.log(err)
    }
  })
})
