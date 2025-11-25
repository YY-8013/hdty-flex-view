<template>
  <div class="hdty-container">
    <hd-map-arcgis
      :markers="markers"
      :clusterer="true"
      @currentLoaded="handleMapLoad"
      @currentZoomend="handleMapZoom"
      @currentClick="handleMapClick">
    </hd-map-arcgis>
  </div>
</template>

<script>
  export default {
    name: "ExampleArcgis",
    data() {
      return {
        // 点坐标
        markers: [
          {
            lng: 111.66596384513255,
            lat: 40.83072634050404,
            label: '你好开发者',
            icon: 'b11'
          },
          {
            lng: 111.7653123249837,
            lat: 40.81810908086256,
            label: '你好HdtyAdmin',
            icon: 'b15'
          },
          {
            lat: 40.93189445997847,
            lng: 111.77635740621244,
            label: '你好华动泰越',
          }
        ]
      }
    },
    methods: {
      // 地图加载完成
      handleMapLoad(e) {
        console.log('地图加载完成：', e);
      },
      // 地图缩放
      handleMapZoom(val) {
        console.log('地图缩放：', val);
      },
      // 地图点击
      handleMapClick(e, map) {
        console.log('地图点击：', e, map);
      }
    }
  }
</script>

<style scoped>

</style>
