"use strict";

Crafty.sprite("/sharedimages/brick.png", {
    brick: [0, 0, 40, 40],
    gravel: [40, 0, 40, 40]
});
Crafty.sprite("/sharedimages/colorsquare.png", {
    red: [0, 0, 40, 40],
    blue: [40, 0, 40, 40],
    yellow: [60, 0, 40, 40],
    green: [0, 40, 40, 40],
    orange: [40, 40, 40, 40],
    purple: [80, 40, 40, 40]
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

function Pathfinder(columns, rows) {
    var Nodes = [],
        levelWidth = columns,//nodes across
        levelHeight = rows,//nodes tall
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
                return array;
            }
        }
        return [];
    };

    Pathfinder.prototype.InitNodesForLevel = function () {
        var i = 0,
            j = 0,
            walkable = false;
        for (i = 0; i < levelWidth; i = i + 1) {
            Nodes.push([]);
            for (j = 0; j < levelHeight; j = j + 1) {
                walkable = ((i + j) % 3 > 0 || ((i + j) % 3 === 0 && i % 2 === 0));

                if (walkable) {
                    Nodes[i][j] = Crafty.e("brick,DOM,Color,TwoDNode")
                        .color("#969696")
                        .attr({ w: nodeWidth, h: nodeHeight, x: i * nodeWidth, y: j * nodeHeight, walkable: true });
                } else {
                    Nodes[i][j] = Crafty.e("gravel,DOM,Color,TwoDNode")
                            .color("#555555")
                            .attr({ w: nodeWidth, h: nodeHeight, x: i * nodeWidth, y: j * nodeHeight, walkable: false });
                }

            }
        }
        for (i = 0; i < levelWidth; i = i + 1) {
            for (j = 0; j < levelHeight; j = j + 1) {
                if (i - 1 >= 0 && j - 1 >= 0) {
                    Nodes[i][j].neighbors.push(Nodes[i - 1][j - 1]);
                }
                if (j - 1 >= 0) {
                    Nodes[i][j].neighbors.push(Nodes[i][j - 1]);
                }
                if (i + 1 < levelWidth && j - 1 >= 0) {
                    Nodes[i][j].neighbors.push(Nodes[i + 1][j - 1]);
                }
                if (i - 1 >= 0) {
                    Nodes[i][j].neighbors.push(Nodes[i - 1][j]);
                }
                if (i + 1 < levelWidth) {
                    Nodes[i][j].neighbors.push(Nodes[i + 1][j]);
                }
                if (i - 1 >= 0 && j + 1 < levelHeight) {
                    Nodes[i][j].neighbors.push(Nodes[i - 1][j + 1]);
                }
                if (j + 1 < levelHeight) {
                    Nodes[i][j].neighbors.push(Nodes[i][j + 1]);
                }
                if (i + 1 < levelWidth && j + 1 < levelHeight) {
                    Nodes[i][j].neighbors.push(Nodes[i + 1][j + 1]);
                }
            }
        }
    };

    Pathfinder.prototype.TotalFlushNodes = function () {
        this.FlushNodesContents();
        this.FlushList();
    };

    Pathfinder.prototype.FlushNodesContents = function () {
        var i,
            j;
        for (i = 0; i < levelWidth; i = i + 1) {
            for (j = 0; j < levelHeight; j = j + 1) {
                Nodes[i][j].parentNode = undefined;
                Nodes[i][j].g = undefined;
                Nodes[i][j].heir = 0;
            }
        }
    };

    Pathfinder.prototype.FlushList = function () {
        closedList = [];
        openList = [];
    };

    Pathfinder.prototype.StartPathfindingByPosition = function (start, end) {
        var i,
            j;
        this.TotalFlushNodes();
        for (i = 0; i < levelWidth; i = i + 1) {
            for (j = 0; j < levelHeight; j = j + 1) {
                if (Nodes[i][j].x === start[0] && Nodes[i][j].y === start[1]) {
                    this.SetupStartNode(Nodes[i][j], end);
                    if (openList.length > 0) {
                        this.FindPath(end);
                    }
                    break;
                }
            }
        }
        return path;
    };

    Pathfinder.prototype.StartPathfindingByGridPosition = function (start, end) {
        this.TotalFlushNodes();
        end = [end[0] * nodeWidth, end[1] * nodeHeight];
        this.SetupStartNode(Nodes[start[0]][start[1]], end);
        if (openList.length > 0) {
            this.FindPath(end);
        }
        return path;
    };

    Pathfinder.prototype.CalculateHeiristic = function (start, end) {
        var h = (9 * (Math.abs(start[0] - end[0])) + (10 * Math.abs(start[1] - end[1])));
        return h;
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
            if (openList[closestIndex].neighbors[i].walkable) {
                if (this.SetupChildNode(openList[closestIndex], openList[closestIndex].neighbors[i], end)) {
                    return;
                }
            }
        }

        closedList.push(openList[closestIndex]);
        openList.splice(closestIndex, 1);

        if (openList.length > 0) {
            this.FindPath(end);
        }
    };

    Pathfinder.prototype.SetupChildNode = function (parentNode, childNode, end) {
        var prospectiveG,
            i;

        childNode.heir = this.CalculateHeiristic([childNode.x, childNode.y], end);

        if (childNode.heir === 0) {
            childNode.parentNode = parentNode;
            this.StartSetupPath(childNode);
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
                    return false;
                }
            }

            for (i = 0; i < closedList.length; i = i + 1) {
                if (childNode === closedList[i]) {
                    closedList.splice(i, 1);
                    break;
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

    Pathfinder.prototype.StartSetupPath = function (childNode) {
        path.push(childNode);
        childNode.removeComponent('brick', false);
        childNode.addComponent('red');

        if (childNode.parentNode !== undefined) {
            this.SetupPath(childNode.parentNode);
        }
    };

    Pathfinder.prototype.SetupPath = function (childNode) {
        path.push(childNode);
        childNode.removeComponent('brick', false);

        if (childNode.parentNode !== undefined) {
            childNode.addComponent('blue');
            this.SetupPath(childNode.parentNode);
        } else {
            childNode.addComponent('green');
        }
    };
}