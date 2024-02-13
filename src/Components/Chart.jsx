import { useRef, useLayoutEffect, useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart(props) {
    console.log('props', props);
    useEffect(() => {
        if (props.inputs.data == undefined || props.inputs.data.length == 0) {
            props.inputs.data = [];
        }

        am5.array.each(am5.registry.rootElements, function (root) {
            if (root.dom.id === "chartdiv") {
                root.dispose();
            }
        });

        getChartsData();
    }, [props]);

    const getChartsData = () => {
        var root = am5.Root.new("chartdiv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                focusable: true,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true
            })
        );

        var easing = am5.ease.linear;
        chart.get("colors").set("step", 3);

        var xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                maxDeviation: 0.1,
                groupData: false,
                baseInterval: {
                    timeUnit: "day",
                    count: 1
                },
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            })
        );

        // Create one y-axis outside the loop
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 1,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        function createAxisAndSeries(Values, Employeename) {
            // No need to create a new y-axis for each series
            // Just use the one created above
            var series = chart.series.push(
                am5xy.LineSeries.new(root, {
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value",
                    categoryXField: "name",
                    valueXField: "date",

                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        //labelText: "{valueZ}{valueY}",
                        labelHTML: "{categoryX}: {valueY}h"
                    })
                })
            );

            series.strokes.template.setAll({ strokeWidth: 1 });

            // No need to sync and hide the y-axis
            // Just set the appearance of the y-axis once
            if (yAxis.renderer && yAxis.renderer.grid) {
                yAxis.renderer.grid.template.set("strokeOpacity", 0.05);
            }

            if (yAxis.renderer && yAxis.renderer.labels) {
                yAxis.renderer.labels.template.set("fill", series.get("fill"));
            }

            if (yAxis.renderer) {
                yAxis.renderer.setAll({
                    stroke: series.get("fill"),
                    strokeOpacity: 1,
                    opacity: 1
                });
            }
            series.data.processor = am5.DataProcessor.new(root, {
                dateFields: "date"
            });

            series.data.setAll(generateChartData(Values, Employeename));
        }

        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis,
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));
        for (var i = 0; i < props?.inputs?.data?.length; i++) {
            createAxisAndSeries(props?.inputs?.data[i]?.dateSummaries, props?.inputs?.data[i]?.employeeName);
        }

        chart.appear(1000, 100);

        function generateChartData(values, name) {
            var data = [];
            for (var i = 0; i < props?.inputs?.diff; i++) {
                var firstDate = new Date(props?.inputs?.startFrom);
                firstDate.setDate(firstDate.getDate() + i);
                firstDate.setHours(0, 0, 0, 0);
                var val = 0;
                var name = name
                var array = isInArray(values, firstDate);
                if (array != null) {
                    val = array.totalHours;
                }
                data.push({
                    date: firstDate,
                    value: val,
                    name: name
                })
            }
            return data;

            function isInArray(array, value) {
                var dt = new Date(value);
                var tocheck = dt.toISOString().split("T")[0];
                for (var x = 0; x < array.length; x++) {
                    if (array[x].date.split("T")[0] == tocheck) {
                        return array[x];
                    }
                }
                return null;
            }
        }
    }

    return (
        <div id="chartdiv" style={{ width: props.inputs.width, height: props.inputs.height }}></div>
    );
}

export default Chart;
