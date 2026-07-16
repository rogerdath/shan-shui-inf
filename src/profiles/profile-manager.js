var SceneProfiles = new function() {
  var registry = {};
  var resolved = {};
  var activeId = "original";

  function isPlainObject(value) {
    return value != null && typeof value == "object" && !Array.isArray(value);
  }

  function clone(value) {
    if (Array.isArray(value)) {
      return value.map(clone);
    }
    if (isPlainObject(value)) {
      var copy = {};
      Object.keys(value).forEach(function(key) {
        copy[key] = clone(value[key]);
      });
      return copy;
    }
    return value;
  }

  function merge(base, override) {
    var result = clone(base || {});
    Object.keys(override || {}).forEach(function(key) {
      var next = override[key];
      if (isPlainObject(next) && isPlainObject(result[key])) {
        result[key] = merge(result[key], next);
      } else {
        result[key] = clone(next);
      }
    });
    return result;
  }

  function deepFreeze(value) {
    if (value == null || typeof value != "object" || Object.isFrozen(value)) {
      return value;
    }
    Object.keys(value).forEach(function(key) {
      deepFreeze(value[key]);
    });
    return Object.freeze(value);
  }

  function resolve(id, resolving) {
    if (resolved[id] != undefined) {
      return resolved[id];
    }
    if (registry[id] == undefined) {
      return undefined;
    }

    resolving = resolving || [];
    if (resolving.indexOf(id) != -1) {
      throw new Error("Circular scene profile inheritance: " + resolving.concat([id]).join(" -> "));
    }

    var profile = registry[id];
    var parent = profile.extends
      ? resolve(profile.extends, resolving.concat([id]))
      : {};

    if (profile.extends && parent == undefined) {
      throw new Error("Unknown parent scene profile: " + profile.extends);
    }

    resolved[id] = deepFreeze(merge(parent, profile));
    return resolved[id];
  }

  this.register = function(profile) {
    if (!profile || typeof profile.id != "string" || profile.id == "") {
      throw new Error("A scene profile must have a non-empty string id.");
    }
    if (registry[profile.id] != undefined) {
      throw new Error("Duplicate scene profile: " + profile.id);
    }
    registry[profile.id] = clone(profile);
    resolved = {};
    return profile.id;
  };

  this.get = function(id) {
    return resolve(id);
  };

  this.list = function() {
    return Object.keys(registry);
  };

  this.activate = function(id) {
    var requestedId = id || "original";
    if (registry[requestedId] == undefined) {
      console.warn("Unknown scene profile '" + requestedId + "'. Falling back to 'original'.");
      requestedId = "original";
    }
    activeId = requestedId;
    return resolve(activeId);
  };

  this.getActive = function() {
    return resolve(activeId);
  };

  this.getActiveId = function() {
    return activeId;
  };
}();

SceneProfiles.register(SceneProfileOriginal);
SceneProfiles.register(SceneProfileNorway);

var ACTIVE_PROFILE = SceneProfiles.activate("original");
