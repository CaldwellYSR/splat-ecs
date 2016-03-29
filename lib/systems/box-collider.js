"use strict";

var SAT = require("sat");

module.exports = function(ecs, game) {

    game.entities.registerSearch("boxCollider", ["box", "position", "size", "collisions"]);

    // OnRemoveComponent Collisions is missing... was causing errors with indexOf undefined.

    var i, j, idA, idB, collA, collB;
    var boxPool = [];
    var response = new SAT.Response();

    ecs.add(function boxCollider(entities, elapsed) { // eslint-disable-line no-unused-vars
        var ids = game.entities.find("boxCollider");
        ids.forEach(function(entity, i) {
            game.entities.get(entity, "collisions").length = 0;
            var position = game.entities.get(entity, "position");
            var size = game.entities.get(entity, "size");
            boxPool[i] = [entity, new SAT.Box(new SAT.Vector(position.x, position.y), size.width, size.height)];
        });

        for (i = 0; i < boxPool.length; i++) {
            for (j = i + 1; j < boxPool.length; j++) {
                if(SAT.testPolygonPolygon(boxPool[i][1].toPolygon(), boxPool[j][1].toPolygon(), response)) {
                    idA = boxPool[i][0];
                    idB = boxPool[j][0];
                    collA = game.entities.get(idA, "collisions").push(idB);
                    // This line is throwing an error (cannot find collisions of undefined)
                    collB = game.entities.get(idB, "collisions").push(idA);
                }
                response.clear();
            }
        }

    });

};
