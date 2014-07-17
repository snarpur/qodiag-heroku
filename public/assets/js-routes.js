(function() {
  var NodeTypes, ParameterMissing, Utils, createGlobalJsRoutesObject, defaults, root,
    __hasProp = {}.hasOwnProperty;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  ParameterMissing = function(message) {
    this.message = message;
  };

  ParameterMissing.prototype = new Error();

  defaults = {
    prefix: "",
    default_url_options: {}
  };

  NodeTypes = {"GROUP":1,"CAT":2,"SYMBOL":3,"OR":4,"STAR":5,"LITERAL":6,"SLASH":7,"DOT":8};

  Utils = {
    serialize: function(object, prefix) {
      var element, i, key, prop, result, s, _i, _len;

      if (prefix == null) {
        prefix = null;
      }
      if (!object) {
        return "";
      }
      if (!prefix && !(this.get_object_type(object) === "object")) {
        throw new Error("Url parameters should be a javascript hash");
      }
      if (root.jQuery) {
        result = root.jQuery.param(object);
        return (!result ? "" : result);
      }
      s = [];
      switch (this.get_object_type(object)) {
        case "array":
          for (i = _i = 0, _len = object.length; _i < _len; i = ++_i) {
            element = object[i];
            s.push(this.serialize(element, prefix + "[]"));
          }
          break;
        case "object":
          for (key in object) {
            if (!__hasProp.call(object, key)) continue;
            prop = object[key];
            if (!(prop != null)) {
              continue;
            }
            if (prefix != null) {
              key = "" + prefix + "[" + key + "]";
            }
            s.push(this.serialize(prop, key));
          }
          break;
        default:
          if (object) {
            s.push("" + (encodeURIComponent(prefix.toString())) + "=" + (encodeURIComponent(object.toString())));
          }
      }
      if (!s.length) {
        return "";
      }
      return s.join("&");
    },
    clean_path: function(path) {
      var last_index;

      path = path.split("://");
      last_index = path.length - 1;
      path[last_index] = path[last_index].replace(/\/+/g, "/");
      return path.join("://");
    },
    set_default_url_options: function(optional_parts, options) {
      var i, part, _i, _len, _results;

      _results = [];
      for (i = _i = 0, _len = optional_parts.length; _i < _len; i = ++_i) {
        part = optional_parts[i];
        if (!options.hasOwnProperty(part) && defaults.default_url_options.hasOwnProperty(part)) {
          _results.push(options[part] = defaults.default_url_options[part]);
        }
      }
      return _results;
    },
    extract_anchor: function(options) {
      var anchor;

      anchor = "";
      if (options.hasOwnProperty("anchor")) {
        anchor = "#" + options.anchor;
        delete options.anchor;
      }
      return anchor;
    },
    extract_trailing_slash: function(options) {
      var trailing_slash;

      trailing_slash = false;
      if (defaults.default_url_options.hasOwnProperty("trailing_slash")) {
        trailing_slash = defaults.default_url_options.trailing_slash;
      }
      if (options.hasOwnProperty("trailing_slash")) {
        trailing_slash = options.trailing_slash;
        delete options.trailing_slash;
      }
      return trailing_slash;
    },
    extract_options: function(number_of_params, args) {
      var last_el;

      last_el = args[args.length - 1];
      if (args.length > number_of_params || ((last_el != null) && "object" === this.get_object_type(last_el) && !this.look_like_serialized_model(last_el))) {
        return args.pop();
      } else {
        return {};
      }
    },
    look_like_serialized_model: function(object) {
      return "id" in object || "to_param" in object;
    },
    path_identifier: function(object) {
      var property;

      if (object === 0) {
        return "0";
      }
      if (!object) {
        return "";
      }
      property = object;
      if (this.get_object_type(object) === "object") {
        if ("to_param" in object) {
          property = object.to_param;
        } else if ("id" in object) {
          property = object.id;
        } else {
          property = object;
        }
        if (this.get_object_type(property) === "function") {
          property = property.call(object);
        }
      }
      return property.toString();
    },
    clone: function(obj) {
      var attr, copy, key;

      if ((obj == null) || "object" !== this.get_object_type(obj)) {
        return obj;
      }
      copy = obj.constructor();
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        attr = obj[key];
        copy[key] = attr;
      }
      return copy;
    },
    prepare_parameters: function(required_parameters, actual_parameters, options) {
      var i, result, val, _i, _len;

      result = this.clone(options) || {};
      for (i = _i = 0, _len = required_parameters.length; _i < _len; i = ++_i) {
        val = required_parameters[i];
        if (i < actual_parameters.length) {
          result[val] = actual_parameters[i];
        }
      }
      return result;
    },
    build_path: function(required_parameters, optional_parts, route, args) {
      var anchor, opts, parameters, result, trailing_slash, url, url_params;

      args = Array.prototype.slice.call(args);
      opts = this.extract_options(required_parameters.length, args);
      if (args.length > required_parameters.length) {
        throw new Error("Too many parameters provided for path");
      }
      parameters = this.prepare_parameters(required_parameters, args, opts);
      this.set_default_url_options(optional_parts, parameters);
      anchor = this.extract_anchor(parameters);
      trailing_slash = this.extract_trailing_slash(parameters);
      result = "" + (this.get_prefix()) + (this.visit(route, parameters));
      url = Utils.clean_path("" + result);
      if (trailing_slash === true) {
        url = url.replace(/(.*?)[\/]?$/, "$1/");
      }
      if ((url_params = this.serialize(parameters)).length) {
        url += "?" + url_params;
      }
      url += anchor;
      return url;
    },
    visit: function(route, parameters, optional) {
      var left, left_part, right, right_part, type, value;

      if (optional == null) {
        optional = false;
      }
      type = route[0], left = route[1], right = route[2];
      switch (type) {
        case NodeTypes.GROUP:
          return this.visit(left, parameters, true);
        case NodeTypes.STAR:
          return this.visit_globbing(left, parameters, true);
        case NodeTypes.LITERAL:
        case NodeTypes.SLASH:
        case NodeTypes.DOT:
          return left;
        case NodeTypes.CAT:
          left_part = this.visit(left, parameters, optional);
          right_part = this.visit(right, parameters, optional);
          if (optional && !(left_part && right_part)) {
            return "";
          }
          return "" + left_part + right_part;
        case NodeTypes.SYMBOL:
          value = parameters[left];
          if (value != null) {
            delete parameters[left];
            return this.path_identifier(value);
          }
          if (optional) {
            return "";
          } else {
            throw new ParameterMissing("Route parameter missing: " + left);
          }
          break;
        default:
          throw new Error("Unknown Rails node type");
      }
    },
    visit_globbing: function(route, parameters, optional) {
      var left, right, type, value;

      type = route[0], left = route[1], right = route[2];
      if (left.replace(/^\*/i, "") !== left) {
        route[1] = left = left.replace(/^\*/i, "");
      }
      value = parameters[left];
      if (value == null) {
        return this.visit(route, parameters, optional);
      }
      parameters[left] = (function() {
        switch (this.get_object_type(value)) {
          case "array":
            return value.join("/");
          default:
            return value;
        }
      }).call(this);
      return this.visit(route, parameters, optional);
    },
    get_prefix: function() {
      var prefix;

      prefix = defaults.prefix;
      if (prefix !== "") {
        prefix = (prefix.match("/$") ? prefix : "" + prefix + "/");
      }
      return prefix;
    },
    _classToTypeCache: null,
    _classToType: function() {
      var name, _i, _len, _ref;

      if (this._classToTypeCache != null) {
        return this._classToTypeCache;
      }
      this._classToTypeCache = {};
      _ref = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this._classToTypeCache["[object " + name + "]"] = name.toLowerCase();
      }
      return this._classToTypeCache;
    },
    get_object_type: function(obj) {
      if (root.jQuery && (root.jQuery.type != null)) {
        return root.jQuery.type(obj);
      }
      if (obj == null) {
        return "" + obj;
      }
      if (typeof obj === "object" || typeof obj === "function") {
        return this._classToType()[Object.prototype.toString.call(obj)] || "object";
      } else {
        return typeof obj;
      }
    }
  };

  createGlobalJsRoutesObject = function() {
    var namespace;

    namespace = function(mainRoot, namespaceString) {
      var current, parts;

      parts = (namespaceString ? namespaceString.split(".") : []);
      if (!parts.length) {
        return;
      }
      current = parts.shift();
      mainRoot[current] = mainRoot[current] || {};
      return namespace(mainRoot[current], parts.join("."));
    };
    namespace(root, "Routes");
    root.Routes = {
// accept_user_invitation => /invitation/edit(.:format)
  accept_user_invitation_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"invitation",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// admin_user => /admin/users/:id(.:format)
  admin_user_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"admin",false]],[7,"/",false]],[6,"users",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// admin_users => /admin/users(.:format)
  admin_users_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"admin",false]],[7,"/",false]],[6,"users",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// all_surveys => /all_surveys(.:format)
  all_surveys_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"all_surveys",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// caretaker => /caretaker/:id(.:format)
  caretaker_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// caretaker_index => /caretaker(.:format)
  caretaker_index_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"caretaker",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// caretaker_subject => /caretaker/:caretaker_id/subjects/:id(.:format)
  caretaker_subject_path: function(_caretaker_id, _id, options) {
  return Utils.build_path(["caretaker_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"caretaker_id",false]],[7,"/",false]],[6,"subjects",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// caretaker_subjects => /caretaker/:caretaker_id/subjects(.:format)
  caretaker_subjects_path: function(_caretaker_id, options) {
  return Utils.build_path(["caretaker_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"caretaker_id",false]],[7,"/",false]],[6,"subjects",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// destroy_user_session => /users/sign_out(.:format)
  destroy_user_session_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"sign_out",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_admin_user => /admin/users/:id/edit(.:format)
  edit_admin_user_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"admin",false]],[7,"/",false]],[6,"users",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_caretaker => /caretaker/:id/edit(.:format)
  edit_caretaker_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_caretaker_subject => /caretaker/:caretaker_id/subjects/:id/edit(.:format)
  edit_caretaker_subject_path: function(_caretaker_id, _id, options) {
  return Utils.build_path(["caretaker_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"caretaker_id",false]],[7,"/",false]],[6,"subjects",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_entry_field => /entry_fields/:id/edit(.:format)
  edit_entry_field_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_fields",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_entry_set => /entry_sets/:id/edit(.:format)
  edit_entry_set_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_entry_set_response => /entry_set_responses/:id/edit(.:format)
  edit_entry_set_response_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_set_responses",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_entry_set_section => /entry_sets/:entry_set_id/sections/:id/edit(.:format)
  edit_entry_set_section_path: function(_entry_set_id, _id, options) {
  return Utils.build_path(["entry_set_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"entry_set_id",false]],[7,"/",false]],[6,"sections",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_entry_value => /entry_values/:id/edit(.:format)
  edit_entry_value_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_values",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_inverse_relation => /inverse_relations/:id/edit(.:format)
  edit_inverse_relation_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"inverse_relations",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_invitation_item => /invitation_items/:id/edit(.:format)
  edit_invitation_item_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"invitation_items",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_person => /people/:id/edit(.:format)
  edit_person_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_person_responder_item => /people/:person_id/responder_items/:id/edit(.:format)
  edit_person_responder_item_path: function(_person_id, _id, options) {
  return Utils.build_path(["person_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_pre_registration => /pre_registrations/:id/edit(.:format)
  edit_pre_registration_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"pre_registrations",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_relationship => /relationships/:id/edit(.:format)
  edit_relationship_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"relationships",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_responder_item => /responder_items/:id/edit(.:format)
  edit_responder_item_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_responder_item_person => /responder_items/:responder_item_id/people/:id/edit(.:format)
  edit_responder_item_person_path: function(_responder_item_id, _id, options) {
  return Utils.build_path(["responder_item_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"responder_item_id",false]],[7,"/",false]],[6,"people",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_section => /sections/:id/edit(.:format)
  edit_section_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_section_entry_field => /sections/:section_id/entry_fields/:id/edit(.:format)
  edit_section_entry_field_path: function(_section_id, _id, options) {
  return Utils.build_path(["section_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"entry_fields",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_section_sections_entry_field => /sections/:section_id/sections_entry_fields/:id/edit(.:format)
  edit_section_sections_entry_field_path: function(_section_id, _id, options) {
  return Utils.build_path(["section_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"sections_entry_fields",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_subject => /people/:id/edit(.:format)
  edit_subject_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_subject_responder_item => /people/:subject_id/responder_items/:id/edit(.:format)
  edit_subject_responder_item_path: function(_subject_id, _id, options) {
  return Utils.build_path(["subject_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"subject_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_user => /users/:id/edit(.:format)
  edit_user_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// edit_user_password => /users/password/edit(.:format)
  edit_user_password_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"password",false]],[7,"/",false]],[6,"edit",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_field => /entry_fields/:id(.:format)
  entry_field_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_fields",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_field_option => /entry_field_options/:id(.:format)
  entry_field_option_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_field_options",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_fields => /entry_fields(.:format)
  entry_fields_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"entry_fields",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set => /entry_sets/:id(.:format)
  entry_set_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set_response => /entry_set_responses/:id(.:format)
  entry_set_response_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_set_responses",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set_response_section => /entry_set_responses/:entry_set_response_id/section/:section_id(.:format)
  entry_set_response_section_path: function(_entry_set_response_id, _section_id, options) {
  return Utils.build_path(["entry_set_response_id","section_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_set_responses",false]],[7,"/",false]],[3,"entry_set_response_id",false]],[7,"/",false]],[6,"section",false]],[7,"/",false]],[3,"section_id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set_responses => /entry_set_responses(.:format)
  entry_set_responses_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"entry_set_responses",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set_section => /entry_sets/:entry_set_id/sections/:id(.:format)
  entry_set_section_path: function(_entry_set_id, _id, options) {
  return Utils.build_path(["entry_set_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"entry_set_id",false]],[7,"/",false]],[6,"sections",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_set_sections => /entry_sets/:entry_set_id/sections(.:format)
  entry_set_sections_path: function(_entry_set_id, options) {
  return Utils.build_path(["entry_set_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"entry_set_id",false]],[7,"/",false]],[6,"sections",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_sets => /entry_sets(.:format)
  entry_sets_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"entry_sets",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_value => /entry_values/:id(.:format)
  entry_value_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_values",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// entry_values => /entry_values(.:format)
  entry_values_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"entry_values",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// family => /national_registers/family/:kennitala(.:format)
  family_path: function(_kennitala, options) {
  return Utils.build_path(["kennitala"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"national_registers",false]],[7,"/",false]],[6,"family",false]],[7,"/",false]],[3,"kennitala",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// image_upload => /people/:id/image_upload(.:format)
  image_upload_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"image_upload",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// inverse_relation => /inverse_relations/:id(.:format)
  inverse_relation_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"inverse_relations",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// inverse_relations => /inverse_relations(.:format)
  inverse_relations_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"inverse_relations",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// invitation_item => /invitation_items/:id(.:format)
  invitation_item_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"invitation_items",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// invitation_item_step => /invitation_items/:id/invite/:type/step/:step_no(.:format)
  invitation_item_step_path: function(_id, _type, _step_no, options) {
  return Utils.build_path(["id","type","step_no"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"invitation_items",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"invite",false]],[7,"/",false]],[3,"type",false]],[7,"/",false]],[6,"step",false]],[7,"/",false]],[3,"step_no",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// invitation_items => /invitation_items(.:format)
  invitation_items_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"invitation_items",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// login => /login(.:format)
  login_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"login",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// login_as => /user/login_as/:id(.:format)
  login_as_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"user",false]],[7,"/",false]],[6,"login_as",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// logout_as => /user/logout_as/:id(.:format)
  logout_as_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"user",false]],[7,"/",false]],[6,"logout_as",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// lookup => /national_registers/:kennitala(.:format)
  lookup_path: function(_kennitala, options) {
  return Utils.build_path(["kennitala"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"national_registers",false]],[7,"/",false]],[3,"kennitala",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_admin_user => /admin/users/new(.:format)
  new_admin_user_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"admin",false]],[7,"/",false]],[6,"users",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_caretaker => /caretaker/new(.:format)
  new_caretaker_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_caretaker_subject => /caretaker/:caretaker_id/subjects/new(.:format)
  new_caretaker_subject_path: function(_caretaker_id, options) {
  return Utils.build_path(["caretaker_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"caretaker",false]],[7,"/",false]],[3,"caretaker_id",false]],[7,"/",false]],[6,"subjects",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_entry_field => /entry_fields/new(.:format)
  new_entry_field_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_fields",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_entry_set => /entry_sets/new(.:format)
  new_entry_set_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_entry_set_response => /entry_set_responses/new(.:format)
  new_entry_set_response_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_set_responses",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_entry_set_section => /entry_sets/:entry_set_id/sections/new(.:format)
  new_entry_set_section_path: function(_entry_set_id, options) {
  return Utils.build_path(["entry_set_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"entry_sets",false]],[7,"/",false]],[3,"entry_set_id",false]],[7,"/",false]],[6,"sections",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_entry_value => /entry_values/new(.:format)
  new_entry_value_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"entry_values",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_inverse_relation => /inverse_relations/new(.:format)
  new_inverse_relation_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"inverse_relations",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_invitation_item => /invitation_items/new(.:format)
  new_invitation_item_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"invitation_items",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_person => /people/new(.:format)
  new_person_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_person_responder_item => /people/:person_id/responder_items/new(.:format)
  new_person_responder_item_path: function(_person_id, options) {
  return Utils.build_path(["person_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_pre_registration => /pre_registrations/new(.:format)
  new_pre_registration_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pre_registrations",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_relationship => /relationships/new(.:format)
  new_relationship_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"relationships",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_responder_item => /responder_items/new(.:format)
  new_responder_item_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_responder_item_person => /responder_items/:responder_item_id/people/new(.:format)
  new_responder_item_person_path: function(_responder_item_id, options) {
  return Utils.build_path(["responder_item_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"responder_item_id",false]],[7,"/",false]],[6,"people",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_section => /sections/new(.:format)
  new_section_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_section_entry_field => /sections/:section_id/entry_fields/new(.:format)
  new_section_entry_field_path: function(_section_id, options) {
  return Utils.build_path(["section_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"entry_fields",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_section_sections_entry_field => /sections/:section_id/sections_entry_fields/new(.:format)
  new_section_sections_entry_field_path: function(_section_id, options) {
  return Utils.build_path(["section_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"sections_entry_fields",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_subject => /people/new(.:format)
  new_subject_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_subject_responder_item => /people/:subject_id/responder_items/new(.:format)
  new_subject_responder_item_path: function(_subject_id, options) {
  return Utils.build_path(["subject_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"subject_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_user => /users/new(.:format)
  new_user_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_user_invitation => /users/invitation/new(.:format)
  new_user_invitation_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"invitation",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_user_password => /users/password/new(.:format)
  new_user_password_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"password",false]],[7,"/",false]],[6,"new",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// new_user_session => /users/sign_in(.:format)
  new_user_session_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"sign_in",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pages_browser_update => /pages/browser_update(.:format)
  pages_browser_update_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pages",false]],[7,"/",false]],[6,"browser_update",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pages_error_401 => /pages/error_401(.:format)
  pages_error_401_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pages",false]],[7,"/",false]],[6,"error_401",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pages_help => /pages/help(.:format)
  pages_help_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pages",false]],[7,"/",false]],[6,"help",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pages_landing => /pages/landing(.:format)
  pages_landing_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pages",false]],[7,"/",false]],[6,"landing",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// people => /people(.:format)
  people_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"people",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// person => /people/:id(.:format)
  person_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// person_address => /people/:person_id/address(.:format)
  person_address_path: function(_person_id, options) {
  return Utils.build_path(["person_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"address",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// person_entry_set_items => /person/:person_id/entry_set_responder_items(/:id)(.:format)
  person_entry_set_items_path: function(_person_id, options) {
  return Utils.build_path(["person_id"], ["id","format"], [2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"person",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"entry_set_responder_items",false]],[1,[2,[7,"/",false],[3,"id",false]],false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// person_responder_item => /people/:person_id/responder_items/:id(.:format)
  person_responder_item_path: function(_person_id, _id, options) {
  return Utils.build_path(["person_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// person_responder_items => /people/:person_id/responder_items(.:format)
  person_responder_items_path: function(_person_id, options) {
  return Utils.build_path(["person_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"person_id",false]],[7,"/",false]],[6,"responder_items",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pre_registration => /pre_registrations/:id(.:format)
  pre_registration_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"pre_registrations",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pre_registration_step => /pre_registrations/:id(/step/:step_no)(.:format)
  pre_registration_step_path: function(_id, options) {
  return Utils.build_path(["id"], ["step_no","format"], [2,[2,[2,[2,[2,[7,"/",false],[6,"pre_registrations",false]],[7,"/",false]],[3,"id",false]],[1,[2,[2,[2,[7,"/",false],[6,"step",false]],[7,"/",false]],[3,"step_no",false]],false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// pre_registrations => /pre_registrations(.:format)
  pre_registrations_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"pre_registrations",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// relationship => /relationships/:id(.:format)
  relationship_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"relationships",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// relationships => /relationships(.:format)
  relationships_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"relationships",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// responder_item => /responder_items/:id(.:format)
  responder_item_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// responder_item_people => /responder_items/:responder_item_id/people(.:format)
  responder_item_people_path: function(_responder_item_id, options) {
  return Utils.build_path(["responder_item_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"responder_item_id",false]],[7,"/",false]],[6,"people",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// responder_item_person => /responder_items/:responder_item_id/people/:id(.:format)
  responder_item_person_path: function(_responder_item_id, _id, options) {
  return Utils.build_path(["responder_item_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[3,"responder_item_id",false]],[7,"/",false]],[6,"people",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// responder_items => /responder_items(.:format)
  responder_items_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"responder_items",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// root => /
  root_path: function(options) {
  return Utils.build_path([], [], [7,"/",false], arguments);
  },
// section => /sections/:id(.:format)
  section_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// section_entry_field => /sections/:section_id/entry_fields/:id(.:format)
  section_entry_field_path: function(_section_id, _id, options) {
  return Utils.build_path(["section_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"entry_fields",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// section_entry_fields => /sections/:section_id/entry_fields(.:format)
  section_entry_fields_path: function(_section_id, options) {
  return Utils.build_path(["section_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"entry_fields",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// section_sections_entry_field => /sections/:section_id/sections_entry_fields/:id(.:format)
  section_sections_entry_field_path: function(_section_id, _id, options) {
  return Utils.build_path(["section_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"sections_entry_fields",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// section_sections_entry_fields => /sections/:section_id/sections_entry_fields(.:format)
  section_sections_entry_fields_path: function(_section_id, options) {
  return Utils.build_path(["section_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"sections",false]],[7,"/",false]],[3,"section_id",false]],[7,"/",false]],[6,"sections_entry_fields",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// sections => /sections(.:format)
  sections_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"sections",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// sign_up_user => /sign_up/user(.:format)
  sign_up_user_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"sign_up",false]],[7,"/",false]],[6,"user",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// subject => /people/:id(.:format)
  subject_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// subject_index => /people(.:format)
  subject_index_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"people",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// subject_responder_item => /people/:subject_id/responder_items/:id(.:format)
  subject_responder_item_path: function(_subject_id, _id, options) {
  return Utils.build_path(["subject_id","id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"subject_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// subject_responder_items => /people/:subject_id/responder_items(.:format)
  subject_responder_items_path: function(_subject_id, options) {
  return Utils.build_path(["subject_id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"subject_id",false]],[7,"/",false]],[6,"responder_items",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// survey => /people/:subject_id/responder_items/survey/:survey_id(.:format)
  survey_path: function(_subject_id, _survey_id, options) {
  return Utils.build_path(["subject_id","survey_id"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"people",false]],[7,"/",false]],[3,"subject_id",false]],[7,"/",false]],[6,"responder_items",false]],[7,"/",false]],[6,"survey",false]],[7,"/",false]],[3,"survey_id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// survey_responses => /responder_items/responses(.:format)
  survey_responses_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"responder_items",false]],[7,"/",false]],[6,"responses",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// surveyor.available_surveys => /surveys/
  surveyor_available_surveys_path: function(options) {
  return Utils.build_path([], [], [2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]], arguments);
  },
// surveyor.take_survey => /surveys/:survey_code(.:format)
  surveyor_take_survey_path: function(_survey_code, options) {
  return Utils.build_path(["survey_code"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]],[3,"survey_code",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// surveyor.export_survey => /surveys/:survey_code(.:format)
  surveyor_export_survey_path: function(_survey_code, options) {
  return Utils.build_path(["survey_code"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]],[3,"survey_code",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// surveyor.view_my_survey => /surveys/:survey_code/:response_set_code(.:format)
  surveyor_view_my_survey_path: function(_survey_code, _response_set_code, options) {
  return Utils.build_path(["survey_code","response_set_code"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]],[3,"survey_code",false]],[7,"/",false]],[3,"response_set_code",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// surveyor.edit_my_survey => /surveys/:survey_code/:response_set_code/take(.:format)
  surveyor_edit_my_survey_path: function(_survey_code, _response_set_code, options) {
  return Utils.build_path(["survey_code","response_set_code"], ["format"], [2,[2,[2,[2,[2,[2,[2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]],[3,"survey_code",false]],[7,"/",false]],[3,"response_set_code",false]],[7,"/",false]],[6,"take",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// surveyor.update_my_survey => /surveys/:survey_code/:response_set_code(.:format)
  surveyor_update_my_survey_path: function(_survey_code, _response_set_code, options) {
  return Utils.build_path(["survey_code","response_set_code"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"surveys",false]],[7,"/",false]],[3,"survey_code",false]],[7,"/",false]],[3,"response_set_code",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user => /users/:id(.:format)
  user_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user_confirmation => /invitation/update(.:format)
  user_confirmation_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"invitation",false]],[7,"/",false]],[6,"update",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user_invitation => /users/invitation(.:format)
  user_invitation_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"invitation",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user_password => /users/password(.:format)
  user_password_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"password",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user_root => /users(.:format)
  user_root_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"users",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user_session => /users/sign_in(.:format)
  user_session_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"users",false]],[7,"/",false]],[6,"sign_in",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// users => /users(.:format)
  users_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"users",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  }}
;
    root.Routes.options = defaults;
    return root.Routes;
  };

  if (typeof define === "function" && define.amd) {
    define([], function() {
      return createGlobalJsRoutesObject();
    });
  } else {
    createGlobalJsRoutesObject();
  }

}).call(this);
