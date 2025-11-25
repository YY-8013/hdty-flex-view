// FK  工作台  关注人员流动分布
const queryData = {
  orgId: "",
  ldTime: []
};
export const data = {
  regionDataList: [
    {
      regionId: "150602",
      regionName: "东胜区",
      lr: 20, // 从其他地区流入到当前地区的数量
      lc: 50 // 从当前地区流出的数量
    },
    // ...
    {
      regionId: "otherCity",
      regionName: "市外",
      lr: 20, // 流出到市外
      lc: 0
    }
  ],
  flowDataList: [
    // 地区间流动明细  (流入地和流出地机构的前6为地区编码来)
    // 出参，startRegionId,startRegionName,endRegionId,endRegionName,ldNum
    { startRegionId: "150602", endRegionId: "150611", ldNum: 32 }, // 东胜区→康巴什区
    { startRegionId: "150611", endRegionId: "150602", ldNum: 28 }, // 康巴什区→东胜区
    { startRegionId: "150621", endRegionId: "150602", ldNum: 18 }, // 达拉特旗→东胜区
    { startRegionId: "150602", endRegionId: "150621", ldNum: 12 }, // 东胜区→达拉特旗
    { startRegionId: "150622", endRegionId: "150623", ldNum: 45 }, // 准格尔旗→鄂托克前旗
    { startRegionId: "150624", endRegionId: "150625", ldNum: 8 }, // 鄂托克旗→杭锦旗
    { startRegionId: "150626", endRegionId: "150602", ldNum: 15 }, // 乌审旗→东胜区
    { startRegionId: "150627", endRegionId: "150626", ldNum: 6 }, // 伊金霍洛旗→乌审旗
    { startRegionId: "150611", endRegionId: "150627", ldNum: 22 }, // 康巴什→伊金霍洛旗
    { startRegionId: "150623", endRegionId: "150622", ldNum: 38 }, // 鄂托克前旗→准格尔旗
    { startRegionId: "150625", endRegionId: "150624", ldNum: 9 }, // 杭锦旗→鄂托克旗
    { startRegionId: "150621", endRegionId: "150623", ldNum: 7 }, // 达拉特旗→鄂托克前旗
    { startRegionId: "150627", endRegionId: "150611", ldNum: 31 }, // 伊金霍洛旗→康巴什
    { startRegionId: "150602", endRegionId: "150627", ldNum: 27 }, // 东胜区→伊金霍洛旗
    { startRegionId: "150622", endRegionId: "150621", ldNum: 14 }, // 准格尔旗→达拉特旗
    { startRegionId: "150624", endRegionId: "150622", ldNum: 11 }, // 鄂托克旗→准格尔旗
    { startRegionId: "150623", endRegionId: "150624", ldNum: 5 }, // 鄂托克前旗→鄂托克旗
    { startRegionId: "150626", endRegionId: "150627", ldNum: 19 }, // 乌审旗→伊金霍洛旗
    { startRegionId: "150625", endRegionId: "150626", ldNum: 13 }, // 杭锦旗→乌审旗
    { startRegionId: "150627", endRegionId: "150602", ldNum: 41 }, // 伊金霍洛旗→东胜区
    { startRegionId: "150602", endRegionId: "otherCity", ldNum: 41 } // 东胜区 -> 市外
  ]
};
