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
    ename: item.FullPY.toUpperCase(),
    short: item.ShortPY.toUpperCase(),
    code: item.airPortCode.toUpperCase(),
    countryCode: 'CN',
    countryName: '中国',
    firstLetter: char,
  }
  return obj
}
const handleForeign = (item, char) => {
  const obj = {
    cname: item.CNName,
    ename: item.ENName.toUpperCase(),
    code: item.Code.toUpperCase(),
    countryCode: item.CountryCode,
    countryName: item.CountryName,
    firstLetter: char
  }
  return obj
}

const forEachChar = async (fn, options = {}) => {
  let output
  if (options.format === 'array') {
    output = []
  } else {
    output = {}
  }

  for (let i = 0; i < 26; ++i) {
    const char = String.fromCharCode(65 + i)
    const params = {
      service: 'allcity',
      category: options.category,
      putIn: char
    }
    const res = await instance.get('/', { params })
    const data = res.data.Data
    if (options.format !== 'array') {
      output[char] = []
    }
    for (item of data) {
      if (fn instanceof Function ||
        Object.prototype.toString.call(fn) === '[object Function]') {
        if (options.format === 'array') {
          output.push(fn(item, char))
        } else {
          output[char].push(fn(item, char))
        }
      }
    }
  }
  return output
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

// 国内机场数据格式化数组形式
forEachChar(handleInternal, { category: 0, format: 'array' }).then(res => {
  fs.writeFile('internal-array.json', JSON.stringify(res), err => {
    if (err) {
      console.log(err)
    }
  })
})

// 国外机场数据格式化数组形式
forEachChar(handleForeign, { category: 1, format: 'array' }).then(res => {
  fs.writeFile('foreign-array.json', JSON.stringify(res), err => {
    if (err) {
      console.log(err)
    }
  })
})
