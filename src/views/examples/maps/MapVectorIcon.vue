<template>
  <div class="hdty-container hdty-scroll">
    <div class="hdty-row">
      <div v-for="item in iconData" class="hdty-col-md12">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              {{ item.title }}
            </div>
          </div>
          <div class="hdty-card-body">
            <ul class="hdty-row hdty-icon-list">
              <li v-for="icon in item.icons" class="hdty-col-md1 hdty-col-sm2 hdty-col-xs6">
                <div class="hdty-icon-content">
                  <div class="hdty-icon-item">
                    <img :src="icon.icon">
                    <cite>{{ icon.name }}</cite>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import iconSeriesA from '@/components/hd-map-baidu/src/icon/icon-series-a.svg';
  import iconSeriesB from '@/components/hd-map-baidu/src/icon/icon-series-b.svg';
  import iconSeriesC from '@/components/hd-map-baidu/src/icon/icon-series-c.svg';
  import iconSeriesD from '@/components/hd-map-baidu/src/icon/icon-series-d.svg';
  import iconSeriesE from '@/components/hd-map-baidu/src/icon/icon-series-e.svg';
  import iconSeriesF from '@/components/hd-map-baidu/src/icon/icon-series-f.svg';
  export default {
    name: "MapVectorIcon",
    data() {
      return {
        iconData: [
          {
            title: 'a系列',
            icons: [
              {
                name: 'a101',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 0
                }
              }, {
                name: 'a102',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 0
                }
              }, {
                name: 'a103',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 0
                }
              }, {
                name: 'a104',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 0
                }
              }, {
                name: 'a105',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 0
                }
              }, {
                name: 'a106',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 0
                }
              }, {
                name: 'a107',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 0
                }
              }, {
                name: 'a108',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 0
                }
              }, {
                name: 'a109',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 0
                }
              }, {
                name: 'a110',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 0
                }
              }, {
                name: 'a111',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 0
                }
              }, {
                name: 'a112',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 0
                }
              }, {
                name: 'a113',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 0
                }
              }, {
                name: 'a114',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 0
                }
              }, {
                name: 'a115',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 0
                }
              }, {
                name: 'a116',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 0
                }
              }, {
                name: 'a117',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 0
                }
              }, {
                name: 'a118',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 0
                }
              }, {
                name: 'a119',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 0
                }
              }, {
                name: 'a120',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 0
                }
              }, {
                name: 'a201',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 42
                }
              }, {
                name: 'a202',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 42
                }
              }, {
                name: 'a203',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 42
                }
              }, {
                name: 'a204',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 42
                }
              }, {
                name: 'a205',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 42
                }
              }, {
                name: 'a206',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 42
                }
              }, {
                name: 'a207',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 42
                }
              }, {
                name: 'a208',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 42
                }
              }, {
                name: 'a209',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 42
                }
              }, {
                name: 'a210',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 42
                }
              }, {
                name: 'a211',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 42
                }
              }, {
                name: 'a212',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 42
                }
              }, {
                name: 'a213',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 42
                }
              }, {
                name: 'a214',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 42
                }
              }, {
                name: 'a215',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 42
                }
              }, {
                name: 'a216',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 42
                }
              }, {
                name: 'a217',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 42
                }
              }, {
                name: 'a218',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 42
                }
              }, {
                name: 'a219',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 42
                }
              }, {
                name: 'a220',
                image: iconSeriesA,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 42
                }
              }
            ]
          },
          {
            title: 'b系列',
            icons: [
              {
                name: 'b1',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 16
                }
              }, {
                name: 'b2',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 16
                }
              }, {
                name: 'b3',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 16
                }
              }, {
                name: 'b4',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 16
                }
              }, {
                name: 'b5',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 16
                }
              }, {
                name: 'b6',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 74
                }
              }, {
                name: 'b7',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 74
                }
              }, {
                name: 'b8',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 74
                }
              }, {
                name: 'b9',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 74
                }
              }, {
                name: 'b10',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 74
                }
              }, {
                name: 'b11',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 132
                }
              }, {
                name: 'b12',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 132
                }
              }, {
                name: 'b13',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 132
                }
              }, {
                name: 'b14',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 132
                }
              }, {
                name: 'b15',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 132
                }
              }, {
                name: 'b16',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 190
                }
              }, {
                name: 'b17',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 190
                }
              }, {
                name: 'b18',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 190
                }
              }, {
                name: 'b19',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 190
                }
              }, {
                name: 'b20',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 190
                }
              }, {
                name: 'b21',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 248
                }
              }, {
                name: 'b22',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 248
                }
              }, {
                name: 'b23',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 248
                }
              }/*, {
                name: 'b24',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 248
                }
              }, {
                name: 'b25',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 248
                }
              }, {
                name: 'b26',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 306
                }
              }, {
                name: 'b27',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 58,
                  y: 306
                }
              }, {
                name: 'b28',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 100,
                  y: 306
                }
              }, {
                name: 'b29',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 142,
                  y: 306
                }
              }, {
                name: 'b30',
                image: iconSeriesB,
                offset: {
                  width: 26,
                  height: 42,
                  x: 184,
                  y: 306
                }
              }*/
            ]
          },
          {
            title: 'c系列',
            icons: [
              {
                name: 'c1',
                image: iconSeriesC,
                offset: {
                  width: 26,
                  height: 42,
                  x: 16,
                  y: 16
                }
              }
            ]
          },
          {
            title: 'd系列',
            icons: [
              {
                name: 'd1',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 16,
                  y: 16
                }
              }, {
                name: 'd2',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 68,
                  y: 16
                }
              }, {
                name: 'd3',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 120,
                  y: 16
                }
              }, {
                name: 'd4',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 172,
                  y: 16
                }
              }, {
                name: 'd5',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 224,
                  y: 16
                }
              }, {
                name: 'd6',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 16,
                  y: 74
                }
              }, {
                name: 'd7',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 68,
                  y: 74
                }
              }, {
                name: 'd8',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 120,
                  y: 74
                }
              }, {
                name: 'd9',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 172,
                  y: 74
                }
              }, {
                name: 'd10',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 224,
                  y: 74
                }
              }, {
                name: 'd11',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 16,
                  y: 132
                }
              }, {
                name: 'd12',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 68,
                  y: 132
                }
              }, {
                name: 'd13',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 120,
                  y: 132
                }
              }, {
                name: 'd14',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 172,
                  y: 132
                }
              }, {
                name: 'd15',
                image: iconSeriesD,
                offset: {
                  width: 36,
                  height: 42,
                  x: 224,
                  y: 132
                }
              }
            ]
          },
          {
            title: 'e系列',
            icons: [
              {
                name: 'e1',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 0
                }
              }, {
                name: 'e2',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 0
                }
              }, {
                name: 'e3',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 0
                }
              }, {
                name: 'e4',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 0
                }
              }, {
                name: 'e5',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 0
                }
              }, {
                name: 'e6',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 0
                }
              }, {
                name: 'e7',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 0
                }
              }, {
                name: 'e8',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 0
                }
              }, {
                name: 'e9',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 0
                }
              }, {
                name: 'e10',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 0
                }
              }, {
                name: 'e11',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 0
                }
              }, {
                name: 'e12',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 0
                }
              }, {
                name: 'e13',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 0
                }
              }, {
                name: 'e14',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 0
                }
              }, {
                name: 'e15',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 0
                }
              }, {
                name: 'e16',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 0
                }
              }, {
                name: 'e17',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 0
                }
              }, {
                name: 'e18',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 0
                }
              }, {
                name: 'e19',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 0
                }
              }, {
                name: 'e20',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 0
                }
              }, {
                name: 'e21',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 42
                }
              }, {
                name: 'e22',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 42
                }
              }, {
                name: 'e23',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 42
                }
              }, {
                name: 'e24',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 42
                }
              }, {
                name: 'e25',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 42
                }
              }, {
                name: 'e26',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 42
                }
              }, {
                name: 'e27',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 42
                }
              }, {
                name: 'e28',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 42
                }
              }, {
                name: 'e29',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 42
                }
              }, {
                name: 'e30',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 42
                }
              }, {
                name: 'e31',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 42
                }
              }, {
                name: 'e32',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 42
                }
              }, {
                name: 'e33',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 42
                }
              }, {
                name: 'e34',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 42
                }
              }, {
                name: 'e35',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 42
                }
              }, {
                name: 'e36',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 42
                }
              }, {
                name: 'e37',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 42
                }
              }, {
                name: 'e38',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 42
                }
              }, {
                name: 'e39',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 42
                }
              }, {
                name: 'e40',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 42
                }
              }, {
                name: 'e41',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 84
                }
              }, {
                name: 'e42',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 84
                }
              }, {
                name: 'e43',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 84
                }
              }, {
                name: 'e44',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 84
                }
              }, {
                name: 'e45',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 84
                }
              }, {
                name: 'e46',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 84
                }
              }, {
                name: 'e47',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 84
                }
              }, {
                name: 'e48',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 84
                }
              }, {
                name: 'e49',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 84
                }
              }, {
                name: 'e50',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 84
                }
              }, {
                name: 'e51',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 84
                }
              }, {
                name: 'e52',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 84
                }
              }, {
                name: 'e53',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 84
                }
              }, {
                name: 'e54',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 84
                }
              }, {
                name: 'e55',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 84
                }
              }, {
                name: 'e56',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 84
                }
              }, {
                name: 'e57',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 84
                }
              }, {
                name: 'e58',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 84
                }
              }, {
                name: 'e59',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 84
                }
              }, {
                name: 'e60',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 84
                }
              }, {
                name: 'e61',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 0,
                  y: 126
                }
              }, {
                name: 'e62',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 26,
                  y: 126
                }
              }, {
                name: 'e63',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 52,
                  y: 126
                }
              }, {
                name: 'e64',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 78,
                  y: 126
                }
              }, {
                name: 'e65',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 104,
                  y: 126
                }
              }, {
                name: 'e66',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 130,
                  y: 126
                }
              }, {
                name: 'e67',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 156,
                  y: 126
                }
              }, {
                name: 'e68',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 182,
                  y: 126
                }
              }, {
                name: 'e69',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 208,
                  y: 126
                }
              }, {
                name: 'e70',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 234,
                  y: 126
                }
              }, {
                name: 'e71',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 260,
                  y: 126
                }
              }, {
                name: 'e72',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 286,
                  y: 126
                }
              }, {
                name: 'e73',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 312,
                  y: 126
                }
              }, {
                name: 'e74',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 338,
                  y: 126
                }
              }, {
                name: 'e75',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 364,
                  y: 126
                }
              }, {
                name: 'e76',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 390,
                  y: 126
                }
              }, {
                name: 'e77',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 416,
                  y: 126
                }
              }/*, {
                name: 'e78',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 442,
                  y: 126
                }
              }, {
                name: 'e79',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 468,
                  y: 126
                }
              }, {
                name: 'e80',
                image: iconSeriesE,
                offset: {
                  width: 26,
                  height: 42,
                  x: 494,
                  y: 126
                }
              }*/
            ]
          },
          {
            title: 'f系列',
            icons: [
              {
                name: 'f101',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 0,
                  y: 0
                }
              }, {
                name: 'f102',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 36,
                  y: 0
                }
              }, {
                name: 'f103',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 72,
                  y: 0
                }
              }, {
                name: 'f104',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 108,
                  y: 0
                }
              }, {
                name: 'f105',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 144,
                  y: 0
                }
              }, {
                name: 'f106',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 180,
                  y: 0
                }
              }, {
                name: 'f107',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 216,
                  y: 0
                }
              }, {
                name: 'f108',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 252,
                  y: 0
                }
              }, {
                name: 'f109',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 288,
                  y: 0
                }
              }, {
                name: 'f110',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 324,
                  y: 0
                }
              }, {
                name: 'f111',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 360,
                  y: 0
                }
              }, {
                name: 'f112',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 396,
                  y: 0
                }
              }, {
                name: 'f113',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 432,
                  y: 0
                }
              }, {
                name: 'f114',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 468,
                  y: 0
                }
              }, {
                name: 'f115',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 504,
                  y: 0
                }
              }, {
                name: 'f116',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 540,
                  y: 0
                }
              }, {
                name: 'f117',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 576,
                  y: 0
                }
              }, {
                name: 'f118',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 612,
                  y: 0
                }
              }, {
                name: 'f119',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 648,
                  y: 0
                }
              }, {
                name: 'f120',
                image: iconSeriesF,
                offset: {
                  width: 36,
                  height: 46,
                  x: 684,
                  y: 0
                }
              }
            ]
          },
        ]
      }
    },
    mounted() {
      let _this = this;
      for (let series of _this.iconData) {
        for (let item of series.icons) {
          _this.$utilFile.captureImage({
            url: item.image,
            newWidth: item.offset.width,
            newHeight: item.offset.height,
            offsetX: item.offset.x,
            offsetY: item.offset.y,
            callback: function (val) {
              _this.$set(item, 'icon', val);
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
