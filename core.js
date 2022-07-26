
async function draw() {
    let ROOT_PATH = 'images';

    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);

    const data = await d3.csv('data/sample.csv', function(d) {
        return {
            lat: +d.lat,
            lon: +d.lon,
            id: +d["point_id"]
        }
    });
    const data2 = await d3.csv('data/sample2.csv', function(d) {
        return {
            lat: +d.lat,
            lon: +d.lon,
            id: +d["point_id"]
        }
    });
    console.log(data);
    function output(data) {
        let o = []
        let count = -1                 
        data.forEach(d => {
            let id = d.id
            if (id === 0) {
                count ++
                o[count] = [];
            }
            o[count][id] = [d.lon, d.lat];
        })
        return o
    }

    let rawData = output(data)
    let opt = {
        // progressive: 20000,
        backgroundColor: '#000',
        animation: true,
        globe: {

            baseTexture: ROOT_PATH + '/B4.png',
            // heightTexture:
            // ROOT_PATH + '/bathymetry_bw_composite_4k.jpg',
            shading: 'lambert',
            light: {
                ambient: {
                    intensity: 0.3
                },
                main: {
                    
                    intensity: 0.5
                }
            },
            viewControl: {
                autoRotate: false,
                rotateSensitivity: 2,
                autoRotateSpeed: 24,
                targetCoord: [113.27, 23.13],
                minDistance: 1,
                distance: 25
            }
        },
        series: {
            type: 'lines3D',
            coordinateSystem: 'globe',
            polyline: true,
            blendMode: 'lighter',
            // large: true,
            lineStyle: {
                width: 1,
                color: 'rgb(255,215,120)',
                opacity: 0.1
            },
            effect: {
                show: true,
                // period: 3,
                constantSpeed: 40,
                trailWidth: 3,
                trailLength: 0.1,
                trailOpacity: 1,
                // trailColor: 'rgb(255,0,121)'           
            },
            data: rawData.slice(0,1),
        }
    }
    myChart.setOption(opt);
    
    d3.select("body").on("keydown", function() {
        let beijing = [116.46, 39.92]
        let c = [120.2,34.04]
        let shanghai = [121.4, 31.4]
        let guangzhou = [113.27, 23.13]
        let sliceNum = 2
        //第一步推到青岛
        opt.globe.viewControl.targetCoord = c
        opt.globe.viewControl.distance = 40
        opt.globe.viewControl.animationDurationUpdate = 10000
        myChart.setOption(opt);
        //第二步周期性变数据
        setTimeout(function tick() {
            opt.series.data = rawData.slice(0, sliceNum)
            myChart.setOption(opt);   
            sliceNum = sliceNum + 1
            if (sliceNum !== rawData.length) {
                setTimeout(tick, 500); 
            }
        }, 1500);
        //第三步拉到整个地球
        setTimeout(() => {
            opt.globe.viewControl.distance = 150
            opt.globe.viewControl.animationDurationUpdate = 3000
            myChart.setOption(opt);   
        }, 15000);

    })
}

draw();

