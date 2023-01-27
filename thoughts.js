const { isObject, isArray } = require("lodash")

const LOGICAL_CONNECTORS = {
    'AND': 0,
    'OR': 1
}

let conditions = {
    type: LOGICAL_CONNECTORS.AND,
    items: [
        {
            type: LOGICAL_CONNECTORS.OR,
            items: [
                ['application', '=', `"Standard Features"`],
                {
                    type: LOGICAL_CONNECTORS.OR,
                    items: [
                        ['a', '=', `"5"`],
                        ['b', '>', `"7"`]
                    ]
                }
            ]
        }
    ]
}

function renderConditions(conditions) {

    // 
    if (isArray(conditions)) {
        return conditions.map(item => {
            if (isArray(item)) {
                let [left, op, expr] = item;
                return `( ${left} ${op} ${expr} )`
            }
            if (isObject(item))
                return renderConditions(item)
        })
    }
    if (isObject(conditions)) {
        let { items } = conditions;
        let connector = Object.keys(LOGICAL_CONNECTORS).find(k => LOGICAL_CONNECTORS[k] === conditions.type)
        return renderConditions(items).join(` ${connector} `)
    }
}

let a = renderConditions(conditions);
console.log(a)