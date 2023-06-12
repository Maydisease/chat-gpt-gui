import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {
    forceCollide,
    forceLink,
    forceManyBody,
    forceSimulation,
    select,
    zoom,
    zoomIdentity,
} from 'd3';

@Component({
    selector: 'layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

    @ViewChild('svgRef', {static: true}) svgRef!: ElementRef<SVGElement>

    constructor() {
    }

    ngOnInit() {
        console.log('svgRef', this.svgRef.nativeElement)
        const svg = select(this.svgRef.nativeElement)
            .attr("width", 800)
            .attr("height", 600);


        // 添加文本并设置属性
        const text = svg.append("text")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("AAAAAAA")

        // 获取文本的宽度和高度
        const textBBox = text.node()!.getBBox()
        const textWidth = textBBox.width;
        const textHeight = textBBox.height;

        console.log('textBBox:', textBBox)

        // 设置矩形的宽度和高度以适应文本
        const padding = 10; // 矩形与文本间的间距
        const rectWidth = textWidth + 2 * padding;
        const rectHeight = textHeight + 2 * padding;

        // 绘制矩形并设置属性
        const rect1 = svg.insert("rect", "text")
            .attr("x", rectWidth)
            .attr("y", textHeight)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("fill", "lightblue");

        // 将文本移到矩形的垂直中心
        text.attr("dy", (rectHeight - textHeight) / 2);

        const rect2 = svg.append("rect")
            .attr("x", 350)
            .attr("y", 100)
            .attr("width", 200)
            .attr("height", 100)
            .attr("fill", "green");


        // 获取矩形的位置信息以确定线的端点
        const rect1X = +rect1.attr("x") + +rect1.attr("width");
        const rect1Y = +rect1.attr("y") + (+rect1.attr("height") / 2);
        const rect2X = +rect2.attr("x");
        const rect2Y = +rect2.attr("y") + (+rect2.attr("height") / 2);

        // 绘制连接线并设置属性
        const line = svg.append("line")
            .attr("x1", rect1X) // 线的起点 x 坐标
            .attr("y1", rect1Y) // 线的起点 y 坐标
            .attr("x2", rect2X) // 线的终点 x 坐标
            .attr("y2", rect2Y) // 线的终点 y 坐标
            .attr("stroke", "black") // 线的颜色
            .attr("stroke-width", 2); // 线的宽度
    }
}
