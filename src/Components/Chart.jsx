import { useRef, useLayoutEffect, useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart(props) {  
    console.log('props',props);
    useEffect(()=>{

    var root = am5.Root.new("chartdiv"); 

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    var chart = root.container.children.push( 
      am5xy.XYChart.new(root, {
        panY: false,
        wheelY: "zoomX",
        layout: root.verticalLayout,
        maxTooltipDistance: 0
      }) 
    );
    
    // Define data
    var data = props.data;
    // var data = [{
    //   date: new Date(2021, 0, 1).getTime(),
    //   value: 1,
    //   value2: 2.5
    // }, {
    //   date: new Date(2021, 0, 2).getTime(),
    //   value: 3,
    //   value2: 2.1
    // }, {
    //   date: new Date(2021, 0, 3).getTime(),
    //   value: 2,
    //   value2: 3
    // }, {
    //   date: new Date(2021, 0, 4).getTime(),
    //   value: 1,
    //   value2: 2
    // }, {
    //   date: new Date(2021, 0, 5).getTime(),
    //   value: 1.5,
    //   value2: 0.5
    // }];
    
    // Create Y-axis
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraTooltipPrecision: 1,
        //baseValue: 2,
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );
    
    // Create X-Axis
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 20
        }),
      })
    );
    
    // Create series
    function createSeries(name, field) {
      var series = chart.series.push( 
        am5xy.LineSeries.new(root, { 
          name: name,
          xAxis: xAxis, 
          yAxis: yAxis, 
          valueYField: field, 
          valueXField: "date",
          tooltip: am5.Tooltip.new(root, {})
        }) 
      );
      
      series.get("tooltip").label.set("text", "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}");
      series.data.setAll(data);
    }
    
    createSeries("Series #1", "value");
    createSeries("Series #2", "value2");
    
    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));
    
    xAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));
    
    yAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));
  
},[]);
    // When the paddingRight prop changes it will update the chart
    return (
        <div id="chartdiv" style={{ width: props.width, height: props.height }}></div>
    );
  }

  export default Chart;
  