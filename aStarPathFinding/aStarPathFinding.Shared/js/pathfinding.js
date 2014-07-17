
function Pathfinder() {
    var Nodes = [];

    var levelHeight = 20;//nodes tall
    var levelWidth = 40;//nodes across
    var nodeWidth = 40;
    var nodeHeight = 40;
    InitNodesForLevel();
    function InitNodesForLevel() {

        Crafty.sprite("/sharedimages/brick.png", {
            brick: [0, 0, 40, 40],
            gravel: [40, 0, 40, 40]
        });
        for (var i = 0; i < levelWidth; i++) {
            for (var j = 0; j < levelHeight; j++) {
                if ((i + j) % 3 > 0 || (i + j) % 3 == 0 && (i) % 2 == 0) {
                    Nodes.push(Crafty.e("brick,DOM,Color,TwoDNode")
                        .color("#969696")
                        .attr({ w: 1 * nodeWidth, h: 1 * nodeHeight, x: i * nodeWidth, y: j * nodeHeight }));
                    Nodes[i + j].walkable = true;
                    Nodes[i + j].neighbors.push([i - 1, j - 1]);
                    Nodes[i + j].neighbors.push([i + 1, j + -1]);
                    Nodes[i + j].neighbors.push([i, j - 1]);
                    Nodes[i + j].neighbors.push([i + 1, j]);
                    Nodes[i + j].neighbors.push([i - 1, j]);
                    Nodes[i + j].neighbors.push([i + 1, j + 1]);
                    Nodes[i + j].neighbors.push([i, j + 1]);
                    Nodes[i + j].neighbors.push([i - 1, j + 1]);
                    for(var k = 0; k < Nodes[i+j].neighbors.length;k++)
                    {
                        Nodes[i + j].neighbors[k][0];
                        if (Nodes[i + j].neighbors[k][0] < 0 || Nodes[i + j].neighbors[k][0] > levelWidth - 1
                            ||
                            Nodes[i + j].neighbors[k][1] < 0 || Nodes[i + j].neighbors[k][1] > levelHeight - 1)
                        {
                            delete Nodes[i + j].neighbors[k];
                        }
                    }

                    Nodes[i + j].neighbors = ReIndexArray(Nodes[i + j].neighbors);
                }
                else {
                    Nodes.push(Crafty.e("gravel,DOM,Color,TwoDNode")
                        .color("#000000")
                        .attr({ w: 1 * nodeWidth, h: 1 * nodeHeight, x: i * nodeWidth, y: j * nodeHeight }));
                    Nodes[i + j].walkable = false
                    Nodes[i + j].neighbors.push([i - 1, j - 1]);
                    Nodes[i + j].neighbors.push([i + 1, j + -1]);
                    Nodes[i + j].neighbors.push([i, j - 1]);
                    Nodes[i + j].neighbors.push([i + 1, j]);
                    Nodes[i + j].neighbors.push([i - 1, j]);
                    Nodes[i + j].neighbors.push([i + 1, j + 1]);
                    Nodes[i + j].neighbors.push([i, j + 1]);
                    Nodes[i + j].neighbors.push([i - 1, j + 1]);
                    for (var k = 0; k < Nodes[i + j].neighbors.length; k++) {
                        Nodes[i + j].neighbors[k][0];
                        if (Nodes[i + j].neighbors[k][0] < 0 || Nodes[i + j].neighbors[k][0] > levelWidth - 1
                            ||
                            Nodes[i + j].neighbors[k][1] < 0 || Nodes[i + j].neighbors[k][1] > levelHeight - 1) {
                            delete Nodes[i + j].neighbors[k];
                        }
                    }

                    Nodes[i + j].neighbors = ReIndexArray(Nodes[i + j].neighbors);
                }
            }
        }
    }
}

Crafty.c("TwoDNode",
    {
        init: function ()
        {
            this.neighbors =[];
            this.parent = {};
        },
        walkable:true,
        g : 0,
        h : 0,
        f: function () {
            return this.g + this.h;
        }

    });

function ReIndexArray(array)
{
    array.sort();
    for (k = 0; k < array.length; k++) {
        if (array[k] === undefined) {
            array.length = k;
            break;
        }
    }
    return array;
}