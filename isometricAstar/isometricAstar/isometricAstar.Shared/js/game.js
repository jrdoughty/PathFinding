﻿
Crafty.init();

Crafty.sprite(128, "sharedimages/sprite.png", {
    grass: [0, 0, 1, 1],
    stone: [1, 0, 1, 1]
});

iso = Crafty.isometric.size(128);
var z = 0;
for (var i = 20; i >= 0; i--) {
    for (var y = 0; y < 20; y++) {
        var which = Math.round(Math.random());
        var tile = Crafty.e("2D, DOM, " + (!which ? "grass" : "stone") + ", Mouse")
		.attr('z', i + 1 * y + 1).areaMap([64, 0], [128, 32], [128, 96], [64, 128], [0, 96], [0, 32]).bind("Click", function (e) {
			//destroy on right click
			if (e.button === 1) this.destroy();
		}).bind("MouseOver", function () {
			if (this.has("grass")) {
			    this.sprite(0, 1, 1, 1);
			} else {
			    this.sprite(1, 1, 1, 1);
			}
		}).bind("MouseOut", function () {
			if (this.has("grass")) {
			    this.sprite(0, 0, 1, 1);
			} else {
			    this.sprite(1, 0, 1, 1);
			}
		});

        iso.place(i, y, 0, tile);
    }
}

Crafty.addEvent(this, Crafty.stage.elem, "MouseDown", function (e) {
    if (e.button > 1) return;
    var base = { x: e.clientX, y: e.clientY };

    function scroll(e) {
        var dx = base.x - e.clientX,
			dy = base.y - e.clientY;
        base = { x: e.clientX, y: e.clientY };
        Crafty.viewport.x -= dx;
        Crafty.viewport.y -= dy;
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "MouseUp", function () {
        Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
});