var json=[
  {
    "fid": "B001",
    "pid": "A001",
    "type": "1",
    "name": "竞价/价格大幅波动",
    "remark": "功能很强大"
  },
  {
    "fid": "B002",
    "pid": "A001",
    "type": "1",
    "name": "竞价/成交量大幅放量",
    "remark": "可以加自选"
  },
  {
    "fid": "B003",
    "pid": "A001",
    "type": "2",
    "name": "竞价/3日连续价格波动",
    "remark": "波动超出正常范围5%"
  },
  {
    "fid": "B004",
    "pid": "A001",
    "type": "2",
    "name": "竞价/3日成交量大幅放量",
    "remark": "连续五日内最高"
  },
  {
    "fid": "B005",
    "pid": "A002",
    "type": "1",
    "name": "开盘/高开",
    "remark": "高开幅度5%"
  },
  {
    "fid": "B006",
    "pid": "A002",
    "type": "1",
    "name": "开盘/低开",
    "remark": "低开幅度6%"
  },
  {
    "fid": "B007",
    "pid": "A002",
    "type": "1",
    "name": "开盘/放量",
    "remark": "连续五日内最高"
  },
  {
    "fid": "B008",
    "pid": "A002",
    "type": "1",
    "name": "开盘/缩量",
    "remark": "连续五日内最低"
  },
  {
    "fid": "B009",
    "pid": "A002",
    "type": "1",
    "name": "开盘/创新高",
    "remark": "超过近15日最高价"
  },
  {
    "fid": "B010",
    "pid": "A002",
    "type": "1",
    "name": "开盘/创新低",
    "remark": "低于近15日最低价"
  },
  {
    "fid": "B011",
    "pid": "A002",
    "type": "2",
    "name": "开盘/连续高开",
    "remark": "连续3日及以上开盘价高于常态"
  },
  {
    "fid": "B012",
    "pid": "A002",
    "type": "2",
    "name": "开盘/连续低开",
    "remark": "连续4日及以上开盘价低于常态"
  },
  {
    "fid": "B013",
    "pid": "A009",
    "type": "1",
    "name": "箱体/中上部",
    "remark": "50%-75%"
  },
  {
    "fid": "B014",
    "pid": "A009",
    "type": "1",
    "name": "箱体/中下部",
    "remark": "50%-25%"
  },
  {
    "fid": "B015",
    "pid": "A009",
    "type": "1",
    "name": "箱体/上部",
    "remark": "75%以上"
  },
  {
    "fid": "B016",
    "pid": "A009",
    "type": "1",
    "name": "箱体/下部",
    "remark": "25%以下"
  }
]

// 定义数据出口
module.exports = {
  data: json
}