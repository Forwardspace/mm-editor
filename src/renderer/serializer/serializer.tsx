import { snapshot } from 'valtio';
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
        case "tags":
            var newLen = elems.push({ type: "element", name: "tags", elements: [] });
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
        case "not":
            var newLen = elems.push({ type: "element", name: "complement", elements: [] });
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
        case "chance":
            var newLen = elems.push({ type: "element", name: "chance", elements: [], attributes: { probability: selector.val }});
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

function serializeRequires(action, elems) {
    // Create a 'requirements' node below the root
    // if such a node doesn't already exist
    var requirements = elems.find((el) => { return el.name == "requirements" });
    if (requirements == undefined) {
        elems.push({ type: "element", name: "requirements", elements: [] })
        requirements = elems[elems.length - 1];
    }

    var newLen = requirements.elements.push({ type: "element", name: "requirement", elements: [] });

    serializeSelector(action.selector, requirements.elements[newLen - 1].elements);
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

function serializeFormattedHandout(text, elems) {
    // Todo: add mutiple text tags support,
    //       add formatting support

    // Make sure to escape newlines to they don't break xml formatting
    elems.push({ type: "element", name: "text", attributes: { text: text.replace("\n", "\\n") }});
}

function serializeHandout(action, elems) {
    var newLen = elems.push({ type: "element", name: "assign", elements: [] });
    elems = elems[newLen - 1].elements;

    serializeSelector(action.selector, elems);

    newLen = elems.push({ type: "element", name: "handouts", elements: [] });
    elems = elems[newLen - 1].elements;

    serializeFormattedHandout(action.text, elems);
}

function serializeTagGroup(action, elems) {

}

function serializeAction(action, elems) {
    switch (action.type) {
        case "requirement":
            serializeRequires(action, elems);
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
    var actions_snaphot = snapshot(actions);
    var meta_snapshot = snapshot(meta);

    var xmlFormat : any = { elements: [ { type: "element", name: meta_snapshot.type, attributes: { name: meta_snapshot.name }, elements: [] } ] };

    for (let action of actions_snaphot) {
        serializeAction(action, xmlFormat.elements[0].elements);
    }

    return js2xml(xmlFormat, {
        compact: false,
        spaces: 4
    });
}

export function saveFile() {
    var serialized = serializeActions();

    window.electron.ipcRenderer.sendMessage('save-file', serialized);
}