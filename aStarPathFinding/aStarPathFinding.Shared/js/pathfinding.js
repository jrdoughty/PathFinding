// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

"use strict";


Crafty.sprite("/sharedimages/brick.png", {
    brick: [0, 0, 40, 40],
    gravel: [40, 0, 40, 40]
});

Crafty.c("TwoDNode",
    {
        init: function () {
            this.neighbors = [];
            this.parentNode = {};
        },
        walkable: true,
        g: undefined,
        heir: 0,
        f: function () {
            return this.g + this.heir;
        }

    });


function Pathfinder() {
    var Nodes = [],
        levelHeight = 15,//nodes tall
        levelWidth = 15,//nodes across
        nodeWidth = 40,
        nodeHeight = 40,
        openList = [],
        closedList = [],
        path = [];

    Pathfinder.prototype.ReIndexArray = function (array) {
        var k = 0;
        array.sort();
        for (k = 0; k < array.length; k = k + 1) {
            if (array[k] === undefined) {
                array.length = k;
                break;
            }
        }
        return array;
    };
    Pathfinder.prototype.GetNodeByXY = function (pointxy) {
        var i = 0;
        for (i = 0; i < Nodes.length; i = i + 1) {
            if (Nodes[i].x === pointxy[0] && Nodes[i].y === pointxy[1]) {
                return Nodes[i];
            }
        }
        return;

    };
    Pathfinder.prototype.InitNodesForLevel = function () {
        var i = 0,
            j = 0,
            k = 0,
            walkable = false;

        for (i = 0; i < levelWidth; i = i + 1) {
            for (j = 0; j < levelHeight; j = j + 1) {
                walkable = true;//(i + j) % 3 > 0 || ((i + j) % 3 === 0 && i % 2 === 0));

                if (walkable) {
                    Nodes.push(Crafty.e("brick,DOM,Color,TwoDNode")
                        .color("#969696")
                        .attr({ w: nodeWidth, h: nodeHeight, x: i * nodeWidth, y: j * nodeHeight, walkable: true }));
                } else {
                    Nodes.push(Crafty.e("gravel,DOM,Color,TwoDNode")
                            .color("#555555")
                            .attr({ w: nodeWidth, h: nodeHeight, x: i * nodeWidth, y: j * nodeHeight, walkable: false }));
                }
            }
        }
        for (i = 0; i < Nodes.length; i = i + 1) {

            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x - nodeWidth, Nodes[i].y - nodeHeight]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x, Nodes[i].y - nodeHeight]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x + nodeWidth, Nodes[i].y - nodeHeight]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x - nodeWidth, Nodes[i].y]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x + nodeWidth, Nodes[i].y]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x - nodeWidth, Nodes[i].y + nodeHeight]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x, Nodes[i].y + nodeHeight]));
            Nodes[i].neighbors.push(this.GetNodeByXY([Nodes[i].x + nodeWidth, Nodes[i].y + nodeHeight]));

            for (k = 0; k < Nodes.length; k = k + 1) {
                Nodes[k].neighbors = this.ReIndexArray(Nodes[k].neighbors);//look into this later. new seems odd to need
            }
            for (k = 0; k < Nodes[Nodes.length - 1].neighbors.length; k = k + 1) {
                if (Nodes[Nodes.length - 1].neighbors[k].x < 0 || Nodes[Nodes.length - 1].neighbors[k].x > levelWidth || Nodes[Nodes.length - 1].neighbors[k].y < 0 || Nodes[Nodes.length - 1].neighbors[k].y > levelHeight - 1) {
                    delete Nodes[Nodes.length - 1].neighbors[k];
                }
            }
        }

        for (i = 0; i < Nodes.length; i = i + 1) {
            Nodes[i].neighbors = this.ReIndexArray(Nodes[i].neighbors);//look into this later. new seems odd to need
        }
    };
    Pathfinder.prototype.TotalFlushNodes = function () {
        this.FlushNodesContents();
        this.FlushList();
    };

    Pathfinder.prototype.FlushNodesContents = function () {
        var i = 0;
        for (i = 0; i < Nodes.length; i = i + 1) {
            Nodes[i].parentNode = undefined;
            Nodes[i].g = undefined;
            Nodes[i].heir = 0;
        }
    };

    Pathfinder.prototype.FlushList = function () {

        closedList = [];
        openList = [];

    };
    Pathfinder.prototype.StartPathfindingByPosition = function (start, end) {
        var i = 0;
        this.TotalFlushNodes();
        for (i = 0; i < Nodes.length; i = i + 1) {
            if (Nodes[i].x === start[0] && Nodes[i].y === start[1]) {
                this.SetupStartNode(Nodes[i], end);
                if (openList.length > 0) {
                    this.FindPath(end);
                }
                break;
            }
        }
    };
    Pathfinder.prototype.SetupStartNode = function (startNode, end) {
        startNode.g = 0;
        startNode.heir = this.CalculateHeiristic([startNode.x, startNode.y], end);
        openList.push(startNode);
    };

    Pathfinder.prototype.FindPath = function (end) {
        var i = 0,
            closestIndex;
        for (i = 0; i < openList.length; i = i + 1) {
            if (closestIndex === undefined) {
                closestIndex = i;
            } else if (openList[i].f < closestIndex.f) {
                closestIndex = i;
            }
        }
        for (i = 0; i < openList[closestIndex].neighbors.length; i = i + 1) {

            if (this.SetupChildNode(openList[closestIndex], openList[closestIndex].neighbors[i], end)) {
                return;
            }
        }
        closedList.push(openList[closestIndex]);
        openList.splice(closestIndex, 1);
        this.ReIndexArray(openList);
        if (openList.length > 0) {
            this.FindPath(end);
        }
    };
    Pathfinder.prototype.SetupPath = function (childNode) {
        path.push(childNode);
        childNode.removeComponent('brick', false);
        childNode.addComponent('gravel');
        if (childNode.parentNode !== undefined) {
            this.SetupPath(childNode.parentNode);
        }
    };
    Pathfinder.prototype.SetupChildNode = function (parentNode, childNode, end) {
        var prospectiveG,
            i;
        childNode.heir = this.CalculateHeiristic([childNode.x, childNode.y], end);
        if (childNode.heir === 0) {
            childNode.parentNode = parentNode;
            this.SetupPath(childNode);
            return true;
        }

        if (parentNode.x === childNode.x || parentNode.y === childNode.y) {
            prospectiveG = parentNode.g + 10;
        } else {
            prospectiveG = parentNode.g + 14;
        }
        if (prospectiveG + childNode.heir < childNode.f || childNode.g === undefined) {
            childNode.parentNode = parentNode;
            childNode.g = prospectiveG;
            for (i = 0; i < openList.length; i = i + 1) {
                if (childNode === openList[i]) {
                    return;
                }
            }
            for (i = 0; i < closedList.length; i = i + 1) {
                if (childNode === closedList[i]) {
                    closedList.splice(i, 1);
                }
            }
            openList.push(childNode);
            return false;
        }
        if (childNode.g === 0) {

            openList.push(childNode);
            return false;
        }
    };
    Pathfinder.prototype.CalculateHeiristic = function (start, end) {
        var h = (10 * (Math.abs(start[0] - end[0])) + (10 * Math.abs(start[1] - end[1])));
        return h;
    };
}
