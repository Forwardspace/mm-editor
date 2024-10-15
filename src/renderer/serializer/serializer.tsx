import { meta, actions } from '../state.tsx';

import { js2xml } from 'xml-js'

function serializeSelector(selector, elems) {
    switch (selector.type) {
        case "players":
            var newLen = elems.push({ type: "element", name: "players", elements: [] });
            for (let sel of selector.selector) {
                serializeSelector(sel, elems[newLen - 1].elements);
            }
            break;
        case "union":
            var newLen = elems.push({ type: "element", name: "union", elements: [] });
            for (let sel of selector.selector) {
                serializeSelector(sel, elems[newLen - 1].elements);
            }
            break;
        case "intersection":
            var newLen = elems.push({ type: "element", name: "intersection", elements: [] });
            for (let sel of selector.selector) {
                serializeSelector(sel, elems[newLen - 1].elements);
            }
            break;
        case "random":
            var newLen = elems.push({ type: "element", name: "random", elements: [], attributes: { amount: selector.val }});
            for (let sel of selector.selector) {
                serializeSelector(sel, elems[newLen - 1].elements);
            }
            break;
        case "all":
            elems.push({ type: "element", name: "all" });
            break;
        case "has_type":
            elems.push({ type: "element", name: "has_type", attributes: { tag: selector.val } });
            break;
        case null:
            elems.push({ type: "element", name: "empty" });
            break;
        default:
            console.error("Erorr while serializing: unknown selector type: " + selector.type);
            return;
    }
}

function serializeTag(tag, elems) {
    elems.push({ type: "element", name: "tag", attributes: { name: tag } });
}

function serializeRequire(action, elems) {
    var newLen = elems.push({ type: "element", name: "requirement", elements: [] });

    serializeSelector(action.selector, elems[newLen - 1].elements);
}

function serializeActivate(action, elems) {
    let newLen;

    newLen = elems.push({ type: "element", name: "activate", elements: [] });   
    elems = elems[newLen - 1];

    newLen = elems.elements.push({ type: "element", name: "rules", elements: [] });
    elems = elems.elements[newLen - 1];

    for (let rule of action.rules) {
        elems.elements.push({ type: "element", name: "rule", attributes: { name: rule } });
    }
}

function serializeAssign(action, elems) {
    var newLen = elems.push({ type: "element", name: "assign", elements: [] });

    serializeSelector(action.selector, elems[newLen - 1].elements);

    elems = elems[newLen - 1].elements
    newLen = elems.push({ type: "element", name: "tags", elements: [] });

    for (let tag of action.tags) {
        serializeTag(tag, elems[newLen - 1].elements);
    }
}

function serializeHandout(action, elems) {

}

function serializeTagGroup(action, elems) {

}

function serializeAction(action, elems) {
    switch (action.type) {
        case "require":
            serializeRequire(action, elems);
            break;
        case "activate":
            serializeActivate(action, elems);
            break;
        case "assign":
            serializeAssign(action, elems);
            break;
        case "handout":
            serializeHandout(action, elems);
            break;
        case "tag_group":
            serializeTagGroup(action, elems);
    }
}

function serializeActions() {
    var xmlFormat : any = { elements: [ { type: "element", name: meta.type, attributes: { name: meta.name }, elements: [] } ] };

    for (let action of actions) {
        serializeAction(action, xmlFormat.elements[0].elements);
    }

    var finalXml = js2xml(xmlFormat);
    console.log(finalXml);
    
    return finalXml;
}

export function saveFile() {
    var serialized = serializeActions();
}