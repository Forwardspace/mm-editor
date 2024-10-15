import { proxy } from "valtio";

export var meta = proxy({
    name: "Name",
    type: "rule"
});

export var actions = proxy([
    {
        id: 0,
        type: 'requirement',
        selector: {
            type: "players",
            selector: [
                {
                    type: 'has_type',
                    val: 'test-tag'
                },
                {
                    type: 'has_type',
                    val: 'mafia'
                }
            ]
        }
    },
    {
        id: 1,
        type: 'activate',
        rules: ['rule1', 'rule2', 'rule3']
    },
    {
        id: 2,
        type: 'assign',
        selector: {
            type: 'players',
            selector: [
                {
                    type: 'all'
                }
            ]
        },
        tags : [
            'example1', 'example2'
        ]
    }
]);

export var modalData = proxy({
    show: false,
    title: "",
    contents: {} as any
});