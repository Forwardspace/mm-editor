import { proxy } from "valtio";

export var meta = proxy({
    name: "Name",
    type: "rule"
});

export var actions : any[] = proxy([]);

export var modalData = proxy({
    show: false,
    contents: {} as any
});