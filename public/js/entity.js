Entity = function(data) {
    this.x = data.x;
    this.y = data.y;
    this.a = data.a;
    this.h = data.h;
    this.id = data.sessionId;
    this.type = 'CLIENT';
};

Entity.prototype.getData = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a,
        h: this.h,
        id: this.id,
        type: this.type
    };
};

Entity.prototype.getId = function() {
    return this.id;
};

Entity.prototype.moveTo = function(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.a = pos.a;
};

EntityManager = {
    entities: [],
    addEntity: function(eData) {
        var e = new Entity(eData);
        EntityManager.entities.push(e);
    },

    addEntities: function(entities) {
        for (var i = 0; i < entities.length; i++) {
            EntityManager.addEntity(entities[i]);
        }
    },

    getById: function(id) {
        for (var i = 0; i < EntityManager.entities.length; i++) {
            if (EntityManager.entities[i].getId() == id) {
                return EntityManager.entities[i];
            }
        }
        return null;
    },

    getAll: function(type) {
        if (typeof type == "undefined") {
            return EntityManager.entities;
        }
        var _entities = [];
        for (var i = 0; i < EntityManager.entities.length; i++) {
            if (EntityManager.entities[i].type == type) {
                _entities.push(EntityManager.entities[i]);
            }
        }
        return _entities;
    },

    /**
     * eData is expected to contain a sessionId to find the entity by
     *
     * eData {
     * sessionId: xx,
     * x: x,
     * y: x,
     * a: x
     * }
     *
     */
    moveEntity: function(eData) {
        var e = EntityManager.getById(eData.sessionId);
        e.moveTo(eData);
    },

    /**
     * this function takes a global sessionId as its sole argument
     */
    removeEntity: function(id) {
        for (var i = 0; i < EntityManager.entities.length; i++) {
            if (EntityManager.entities[i].getId() == id) {
                EntityManager.entities.splice(i, 1);
                break;
            }
        }        
    }
};
