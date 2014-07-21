
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


p = new Pathfinder();//pathfinding.js
p.InitNodesForLevel();
p.StartPathfindingByPosition([0,0],[40*6,40*14]);