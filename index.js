// 没用babel不能import
const axios = require('axios')
const qs = require('qs')
const fs = require('fs')

const instance = axios.create({
  baseURL: 'https://wx.17u.cn/pubapi/city/planecity.ashx'
})

const handleInternal = (item, char) => {
  const obj = {
    cname: item.CityName,
    ename: item.FullPY,
    short: item.ShortPY,
    code: item.airPortCode,
    countryCode: 'CN',
    countryName: '中国',
    firstLetter: char,
  }
  return obj
}
const handleForeign = (item, char) => {
  const obj = {
    cname: item.CNName,
    ename: item.ENName,
    code: item.Code,
    countryCode: item.CountryCode,
    countryName: item.CountryName,
    firstLetter: char
  }
  return obj
}

const forEachChar = async (fn, options = {}) => {
  const obj = {}
  for (let i = 0; i < 26; ++i) {
    const char = String.fromCharCode(65 + i)
    const params = {
      service: 'allcity',
      category: options.category,
      putIn: char
    }
    const res = await instance.get('/', { params })
    const data = res.data.Data
    obj[char] = []
    for (item of data) {
      if (fn instanceof Function ||
        Object.prototype.toString.call(fn) === '[object Function]') {
        obj[char].push(fn(item, char))
      }
    }
  }
  return obj
}

// 国内数据
forEachChar(handleInternal, { category: 0 }).then(res => {
  fs.writeFile('internal.json', JSON.stringify(res), err => {
    if (err) {
      console.log(err)
    }
  })
})

// 国外数据
forEachChar(handleForeign, { category: 1 }).then(res => {
  fs.writeFile('foreign.json', JSON.stringify(res), err => {
    if (err) {
      console.log(err)
    }
  })
})
