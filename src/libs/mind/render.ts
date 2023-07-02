// @ts-nocheck
import Konva from "konva";
import {Tree} from "./mind";

export const NODE_SPACE = 20;
export const NODE_SPACE_X = 50;

export let drawGroup = new Konva.Group({
    draggable: true,
});
export let nodeGroup = new Konva.Group();
export let mindLineGroup = new Konva.Group();
export let layer = null;

let prevDrawGroupOffsetX = null;
let prevDrawGroupOffsetY = null;

let isInitStageDone = false;
let isDrawRenderGridDone = false;
let stage = null;

// 绘制辅助网格
const renderGrid = (stage, width, height) => {
    let gridLayer = new Konva.Layer();
    stage.add(gridLayer);
    for (let i = 0; i < width; i += NODE_SPACE_X / 2) {
        let line = new Konva.Line({
            points: [i, 0, i, width],
            stroke: "rgba(255,255,255,0.04)",
            strokeWidth: 1,
        });
        gridLayer.add(line);
    }
    for (let i = 0; i < width; i += NODE_SPACE_X / 2) {
        let line = new Konva.Line({
            points: [0, i, width, i],
            stroke: "rgba(255,255,255,0.04)",
            strokeWidth: 1,
        });
        gridLayer.add(line);
    }
    gridLayer.draw();
};
// 绘制节点
export const drawNode = (x, y, name, w, h, type) => {
    let width = w || 30;
    let height = h || 20;

    const group = new Konva.Group();
    let rect = new Konva.Rect({
        x,
        y: y - height / 2,
        width,
        height,
        fill: "RGBA(46,77,46,.2)",
        stroke: "RGBA(121,216,116,1)",
        strokeWidth: 1,
        cornerRadius: 5,
    });

    let text = new Konva.Text({
        width,
        height,
        x: x,
        y: y,
        text: name,
        fontSize: 14,
        padding: 10,
        fontFamily: 'SF Pro SC,SF Pro Text,SF Pro Icons,PingFang SC,Helvetica Neue,Helvetica,Arial,sans-serif',
        // fontStyle: 'bold',
        fill: 'RGBA(255,255,255,1)',
        align: 'center',
    });

    text.offsetX(-(width - text.width()) / 2);
    text.offsetY(text.height() / 2);

    group.add(rect);
    group.add(text);


    // const inAnime = new Konva.Tween({
    //     node: group,
    //     fill: 'RGBA(46,77,46,1)',
    //     shadowOffsetX: 0,
    //     shadowOffsetY: 5,
    //     shadowBlur: 25,
    // });

    group.on('mouseenter', (e) => {
        rect.fill('RGBA(46,77,46,1)');
        rect.setAttr('shadowOffsetX', 0)
        rect.setAttr('shadowOffsetY', 3)
        rect.setAttr('shadowBlur', 10)
    });

    group.on('mouseleave', (e) => {
        rect.fill('RGBA(46,77,46,0.2)');
        rect.setAttr('shadowOffsetX', 0)
        rect.setAttr('shadowOffsetY', 0)
        rect.setAttr('shadowBlur', 0)
    });

    return group;
};

// 绘制思维导图连接线
export const drawMindLine = (tree, child) => {
    let line = new Konva.Line({
        points: [tree.x + tree.width, tree.y, child.x - NODE_SPACE_X / 2, tree.y, child.x - NODE_SPACE_X / 2, child.y, child.x, child.y],
        stroke: "#666",
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
        tension: 0
    });
    return line;
};

// 绘制多叉树
export const renderTree = (tree, type) => {
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        mindLineGroup.add(drawMindLine(tree, child));
        renderTree(child, type);
    }
    nodeGroup.add(drawNode(tree.x, tree.y, tree.name, tree.width, tree.height, type));
};
// 清除画布
export const clearDraw = () => {
    layer && layer.removeChildren()
}

export const render = (data: Tree, gridMountElement: HTMLElement, mountElement: HTMLElement) => {
    clearDraw();
    const stage = new Konva.Stage({
        container: mountElement,
        width: mountElement.clientWidth,
        height: mountElement.clientHeight,
    });
    layer = new Konva.Layer();
    stage.add(layer);
    renderGrid(stage, mountElement.clientWidth, mountElement.clientHeight);
    renderTree(data);
    drawGroup.add(mindLineGroup);
    drawGroup.add(nodeGroup);
    const {x, y, width, height} = drawGroup.getClientRect();
    const offsetX = (mountElement.clientWidth - width) / 2;
    const offsetY = (mountElement.clientHeight - height) / 2;
    drawGroup.setAttr('x', offsetX);
    drawGroup.setAttr('y', offsetY);

    stage.on('wheel', function (event) {
        event.evt.preventDefault();
        const scaleBy = 1.1;
        const oldScale = drawGroup.scaleX();
        // 根据滚轮方向决定缩放比例
        const newScale = event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        drawGroup.scale({x: newScale, y: newScale});
        layer.draw();
    });

    drawGroup.on('dragstart', function () {
        console.log('矩形开始拖拽');
    });

    drawGroup.on('dragmove', function (e) {
        // const paddingX = 40;
        // const paddingY = 20;
        // const minX = 0 - paddingX;
        // const maxX = mountElement.clientWidth - width - 60;
        // const minY = 0 - paddingY;
        // const maxY = mountElement.clientHeight - height - 40;
        // if (e.target.attrs.x < minX) {
        //     drawGroup.setAttr('x', minX);
        // }
        // if (e.target.attrs.x > maxX) {
        //     drawGroup.setAttr('x', maxX);
        // }
        // if (e.target.attrs.y < minY) {
        //     drawGroup.setAttr('y', minY);
        // }
        // if (e.target.attrs.y > maxY) {
        //     drawGroup.setAttr('y', maxY);
        // }
        return;
    });

    drawGroup.on('dragend', function (e) {
        console.log('矩形拖拽结束', e.target.attrs);
    });

    layer.add(drawGroup);
}