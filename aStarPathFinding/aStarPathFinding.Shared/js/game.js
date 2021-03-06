﻿
WinJS.Namespace.define("Stage", {
    baseXAspect: 0,
    baseYAspect: 0,
    stageW: 0,
    stageH:0
});

if (document.body.clientHeight < document.body.clientWidth) {

    Stage.stageW = document.body.clientWidth;
    Stage.stageH = document.body.clientHeight;
}
else {
    Stage.stageW = document.body.clientHeight;
    Stage.stageH = document.body.clientWidth;
}

Stage.baseXAspect = Stage.stageW / 1280;
Stage.baseYAspect = Stage.stageH / 720;


Crafty.init(Stage.stageW, Stage.stageH);


p = new Pathfinder(32, 18);//pathfinding.js
p.InitNodesForLevel();
p.StartPathfindingByGridPosition([0, 0], [12,6]);
p.StartPathfindingByGridPosition([5, 5], [24,16]);