import { xml2js } from "xml-js";
import { actions, meta } from "../state";

function deserializeSelector(source, dest) {
    function appendOrSetSelector(dest, selector) {
        if (dest.selector != null && Array.isArray(dest.selector)) {
            dest.selector.push(selector);
        }
        else {
            dest.selector = selector;
        }

        return selector;
    }

    if (source == null) {
        appendOrSetSelector(dest, { type: "none" });
        return;
    }

    switch (source.name) {
        case "all":
            appendOrSetSelector(dest, { type: "all" });
            break;
        case "has_type":
            appendOrSetSelector(dest, { type: "has_type", val: source.attributes.tag });
            break;
        case "current_player":
            appendOrSetSelector(dest, { type: "current_player" });
            break;
        case "union":
            var result = appendOrSetSelector(dest, { type: "union", selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "players":
            var result = appendOrSetSelector(dest, { type: "players", selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "tags":
            var result = appendOrSetSelector(dest, { type: "tags", selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "intersection":
            var result = appendOrSetSelector(dest, { type: "intersection", selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "not":
            var result = appendOrSetSelector(dest, { type: "not", selector: [] });
            
            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "tags":
            var result = appendOrSetSelector(dest, { type: "tags", selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "random":
            var result = appendOrSetSelector(dest, { type: "random", val: source.attributes.amount, selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "chance":
            var result = appendOrSetSelector(dest, { type: "chance", val: source.attributes.probability, selector: [] });

            if (source.elements == undefined) {
                return;
            }
            for (let sel of source.elements) {
                deserializeSelector(sel, result);
            }
            break;
        case "tag_group":
            appendOrSetSelector(dest, { type: "tag_group", val: source.attributes.name });
            break;
        default:
            var matches = source.name.match(/from_([a-z]+)_extract_([a-z]+)/);
            if (matches) {
                var result = appendOrSetSelector(dest, 
                    { 
                        type: "extract", 
                        from: matches[1] == "tag" ? "tags" : "players",
                        extract: matches[2] == "tag" ? "tags" : "players",
                        val: source.attributes.tag,
                        selector: [] 
                    });
                
                if (source.elements == undefined) {
                    return;
                }
                
                for (let sel of source.elements) {
                    deserializeSelector(sel, result);
                }
            }
            else {
                console.error("Erorr while deserializing: unknown selector type: " + source.type);
                return;
            }
    } 
}

function deserializeRequirement(element) {
    var req = { type: "requirement", selector: null };

    if (element.elements.length == 0) {
        return;
    }

    deserializeSelector(element.elements[0], req);

    actions.push(req);
}

function deserializeActivate(element) {
    var act = { type: "activate", rules: [] };

    for (let rule of element.elements[0].elements) {
        act.rules.push(rule.attributes.name);
    }

    actions.push(act);
}

function deserializeTag(source, dest) {
    var tag = {containsData: (source.elements != undefined), val: source.attributes.name, selector: null};

    if (tag.containsData) {
        deserializeSelector(source.elements[0], tag);
    }

    dest.tags.push(tag);
}

function deserializeAssign(element) {
    var assign = { type: "assign", together: element.together, selector: null, tags: [] };

    deserializeSelector(element.elements[0], assign);

    for (let tag of element.elements[1].elements) {
        deserializeTag(tag, assign);
    }

    actions.push(assign);
}

function deserializeFormattedHandout(source, dest) {
    dest.text = source.elements[0].attributes.text.replace("\\n", "\n");
}

function deserializeHandout(element) {
    var hand = { type: "handout", selector: null, text: "" };

    deserializeSelector(element.elements[0], hand);

    deserializeFormattedHandout(element.elements[1], hand);

    actions.push(hand);
}

function deserializeTagGroup(element) {

}

function deserializeElement(element) {
    switch (element.name) {
        case "requirements":
            for (let req of element.elements) {
                deserializeRequirement(req);
            }
            break;
        case "activate":
            deserializeActivate(element);
            break;
        case "assign":
            deserializeAssign(element);
            break;
        case "handout":
            deserializeHandout(element);
            break;
        case "tag_group":
            deserializeTagGroup(element);
    }
}

function deserializeActions(xml) {
    actions.splice(0);

    var root = xml.elements[0];

    for (let element of root.elements) {
        deserializeElement(element);

        actions[actions.length - 1].id = actions.length - 1;
    }
}

export function loadFile() {
    window.electron.ipcRenderer.invoke('load-file').then((fileContents) => {
        if (fileContents == null || fileContents == "") {
            return;
        }
    
        var xml = xml2js(fileContents, {
            compact: false
        });
    
        meta.name = xml.elements[0].attributes.name;
        meta.type = xml.elements[0].name;
    
        deserializeActions(xml);
    });
}