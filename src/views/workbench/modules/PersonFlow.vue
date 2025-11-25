<template>
  <div class="work-section">
    <div class="work-section-title">关注人员流动分布</div>
    <div class="work-section-body">
      <div id="flowChart" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
import { gzryLdgjTotal } from "./api";
import { regionFLowData } from "./data";

export default {
  name: "PersonFlow",
  inject: ["WorkBenchPage"],
  data() {
    return {
      flowChart: null,
      geoCoordMap: {
        东胜区: [109.98945, 39.81788],
        康巴什区: [109.790076, 39.618472],
        达拉特旗: [110.040281, 40.404076],
        准格尔旗: [111.238332, 39.865221],
        鄂托克前旗: [107.48172, 38.183257],
        鄂托克旗: [107.982604, 39.095752],
        杭锦旗: [108.736324, 39.831789],
        乌审旗: [108.842454, 38.596611],
        伊金霍洛旗: [109.787402, 39.404312],
        市外: [110.38945, 38.183257]
      },
      tableData: [],
      option: null,
      provinceJSON: null,
      cityDataList: [],

      mapComplated: false,

      flowDataList: [],
      regionDataList: []
    };
  },
  created() {
    this.provinceJSON = require("/public/static/data/map/150600_full.json");
    this.$echarts.registerMap("鄂尔多斯", this.provinceJSON);

    this.loadMapData();
  },
  mounted() {},
  beforeDestroy() {
    if (this.flowChart) this.flowChart.dispose();
    window.removeEventListener("resize", this.resizeChart);
  },
  methods: {
    loadMap() {},
    initData() {
      this.$nextTick(() => {
        this.loadData();
      });
    },
    loadMapData() {
      let otherCity = {
        ldNum: 0,
        lr: 0,
        lc: 0,
        name: "市外",
        orgId: "outside",
        regionId: "outside",
        value: "outside"
      };
      // 解析 GeoJSON 数据
      this.cityDataList = this.provinceJSON.features
        .map((feature) => {
          return {
            name: feature.properties.name, // 假设你的 GeoJSON 中有名称属性
            regionId: feature.properties.adcode,
            orgId: feature.properties.adcode.toString() + "000000",
            value: Number(feature.properties.adcode), // 随机值，你需要使用实际的数据
            geometry: feature.geometry,

            ldNum: 0,
            lr: 0,
            lc: 0
          };
        })
        .concat([otherCity]);
    },
    // 加载数据
    loadData() {
      let _this = this;
      let defaultQuery = _this.WorkBenchPage.gzryLdQueryData;
      const params = {
        ldTime: defaultQuery.ldsj || [],
        isShowZero: false
      };
      gzryLdgjTotal(params)
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            this.flowDataList = data.flowDataList || [];
            this.regionDataList = data.regionDataList || [];
            this.initChart();
          }
        })
        .catch((err) => console.error(err));
    },

    initChart() {
      if (this.flowChart) {
        this.flowChart.clear();
        this.flowChart.dispose();
      }

      this.flowChart = this.$echarts.init(document.getElementById("flowChart"));
      this.flowChart.showLoading();

      const flowData = this.buildFlowData();

      this.option = {
        backgroundColor: "transparent",

        tooltip: {
          trigger: "item",
          formatter: (params) => {
            console.log("params", params);

            if (params.data && params.data.fromName) {
              return `${params.data.fromName} → ${params.data.toName}<br/>流动人次：${params.data.value}`;
            } else if (
              params.data &&
              params.data.pointType &&
              params.data.pointType === "point" &&
              params.data.name
            ) {
              return `${params.name} <br/>流入人次：${params.data.lr}<br/>流出人次：${params.data.lc}`;
            } else if (params.name) {
              return `${params.name}`;
            }
            return "";
          },
          backgroundColor: "rgba(12, 30, 79,0.8)",
          borderColor: "#4EE9E6",
          borderWidth: 1,
          padding: [8, 10],
          textStyle: { color: "#fff", fontSize: 14 }
        },

        geo: {
          map: "鄂尔多斯",
          zoom: 1.2,
          roam: true,
          label: { emphasis: { show: false } },
          itemStyle: {
            normal: {
              borderColor: "#2581D1",
              borderWidth: 1,
              color: "#0F2662"
            },
            emphasis: { color: "rgba(37, 43, 61, .5)" }
          }
        },

        // ✅ 分段视觉映射（右下角图例）
        visualMap: {
          type: "piecewise",
          show: true,
          right: 5,
          bottom: 5,
          textStyle: { color: "#fff", fontSize: 13 },
          pieces: [
            { min: 30, label: "≥30", color: "#FF6F18" },
            { min: 20, max: 30, label: "20-30", color: "#0066ff" },
            { min: 10, max: 20, label: "10-20", color: "#ffde00" },
            { min: 5, max: 10, label: "5-10", color: "#228b22" },
            { min: 0, max: 5, label: "0-5", color: "#00eaff" }
          ],
          align: "left", // ✅ 颜色块在左、文字在右
          inverse: false, // 从上到下显示（可改 true 反转顺序）
          textGap: 10,
          calculable: false,
          orient: "vertical",
          itemWidth: 20,
          itemHeight: 10,
          backgroundColor: "rgba(12, 30, 79,0.8)",
          borderColor: "#206FB9",
          borderWidth: 1,
          padding: [8, 10]
        },
        // ✅ 用 graphic 添加标题
        graphic: [
          {
            type: "text",
            right: 12, // 与 visualMap 的 right 对齐
            bottom: 135, // 调整这个值，使文字刚好在 visualMap 上方
            style: {
              text: "流动频次区间",
              fill: "#00eaff", // 标题颜色
              font: "bold 13px Microsoft YaHei",
              textAlign: "left"
            }
          }
        ],

        series: [
          // ✅ 流动线条
          {
            name: "人员流动",
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.02,
              symbolSize: 5
            },
            lineStyle: {
              width: 1.5,
              opacity: 0.9,
              curveness: 0.3,
              color: "auto" // 根据 visualMap 自动映射颜色
            },
            data: flowData.lines
          },

          // ✅ 源点 + 目标点（带涟漪）
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              scale: 2,
              period: 3,
              brushType: "stroke"
            },
            label: {
              show: true,
              position: "inside",
              fontSize: 13,
              color: "#FFFFFF",
              formatter: (params) => {
                return params.data.name;
              }
            },
            symbol: "circle",
            symbolSize: (val) => Math.max(5, Math.min(val[2] / 2.5, 35)),
            itemStyle: {
              color: "#ff5b00",
              shadowBlur: 10,
              shadowColor: "#333"
            },
            data: this.cityDataList.map((cityItem) => ({
              name: cityItem.name,
              value: this.geoCoordMap[cityItem.name].concat(cityItem.ldNum),
              lr: cityItem.lr,
              lc: cityItem.lc,
              pointType: "point"
            }))
          }
        ]
      };

      this.flowChart.hideLoading();
      this.flowChart.setOption(this.option);
      window.addEventListener("resize", this.resizeChart);
    },

    resizeChart() {
      if (this.flowChart) {
        this.flowChart.resize();
      }
    },

    // 构造迁徙数据
    buildFlowData(regionFLowData) {
      const lines = [];
      let regionData = this.flowDataList || [];

      // 初始化城市数据
      this.cityDataList = this.cityDataList.map((item) => {
        item.ldNum = 0;
        let itemRegion = this.regionDataList.find(
          (rItem) => rItem.regionId.toString() === item.regionId.toString()
        );
        if (itemRegion) {
          console.log("itemRegion", itemRegion);

          item.ldNum = Number(itemRegion.lr);
          item.lr = Number(itemRegion.lr);
          item.lc = Number(itemRegion.lc);
        }

        return item;
      });

      console.log("this.cityDataList", this.cityDataList);

      (regionData || []).forEach((item) => {
        const lcd = item.startRegionId; // 流出地
        const lrd = item.endRegionId; // 流入地
        if (!lcd || !lrd) return;

        let lcdRegion = this.cityDataList.find(
          (item) => item.regionId.toString() === lcd
        );
        let lrdRegion = this.cityDataList.find(
          (item) => item.regionId.toString() === lrd
        );

        const fromCoord = lcdRegion ? this.geoCoordMap[lcdRegion.name] : null;
        const toCoord = lrdRegion ? this.geoCoordMap[lrdRegion.name] : null;

        if (fromCoord && toCoord) {
          // 生成路线唯一标识
          const routeKey = `${lcdRegion.name}-${lrdRegion.name}`;

          const newLine = {
            fromName: lcdRegion.name,
            toName: lrdRegion.name,
            coords: [fromCoord, toCoord],
            value: item.ldNum
          };
          lines.push(newLine);
        }
      });

      return { lines };
    },

    resizeChart() {
      if (this.flowChart) {
        this.flowChart.resize();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/common.scss";
</style>
