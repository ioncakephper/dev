const index = require("../index")
// @ponicode
describe("index.DB.buildSelectColumnsClause", () => {
    test("0", () => {
        let result = index.DB.buildSelectColumnsClause({ "columns": ['*'] })
        expect(result).toBe("*")
    })

    test("1", () => {
        let object = [{ "name": "aName", alias: "a" }]
        let result = index.DB.buildSelectColumnsClause({ "columns": object })
        expect(result).toBe("aName a")
    })

    test("2", () => {
        let object = [{ "name": "aName" }]
        let result = index.DB.buildSelectColumnsClause({ "columns": object })
        expect(result).toBe("aName")
    })

    test("3", () => {
        let result = index.DB.buildSelectColumnsClause({ "columns": ["aName"] })
        expect(result).toBe("aName")
    })

    test("4", () => {
        let result = index.DB.buildSelectColumnsClause({ "columns": ["aName alias"] })
        expect(result).toBe("aName alias")
    })

    test("5", () => {
        let callFunction = () => {
            index.DB.buildSelectColumnsClause({ "columns": [" "] })
        }
    
        expect(callFunction).toThrow('Attribute description has no name')
    })

    test("6", () => {
        let object = ["*", { "name": "aName" }, { "name": "aName", alias: "alias" }]
        let result = index.DB.buildSelectColumnsClause({ "columns": object })
        expect(result).toBe("*, aName, aName alias")
    })
})

// @ponicode
describe("index.DB.buildSelectJoinClause", () => {
    let inst

    beforeEach(() => {
        inst = new index.DB()
    })

    test("0", () => {
        let result = inst.buildSelectJoinClause(undefined)
        expect(result).toBe("")
    })

    test("1", () => {
        let result = inst.buildSelectJoinClause({})
        expect(result).toBe("")
    })

    test("2", () => {
        let result = inst.buildSelectJoinClause({ "table": "table" })
        expect(result).toBe("WHERE table")
    })

    test("3", () => {
        let result = inst.buildSelectJoinClause({ "table": "table t" })
        expect(result).toBe("WHERE table t")
    })
})

// @ponicode
describe("index.DB.buildSelectJoinClause", () => {
    test("0", () => {
        let callFunction = () => {
            index.DB.buildSelectJoinClause(undefined)
        }
    
        expect(callFunction).toThrow('Table not specified.')
    })

    test("1", () => {
        let result = index.DB.buildSelectJoinClause({ table: "tn" })
        expect(result).toBe("FROM tn")
    })

    test("2", () => {
        let result = index.DB.buildSelectJoinClause({ table: "tn ta" })
        expect(result).toBe("FROM tn ta")
    })

    test("3", () => {
        let callFunction = () => {
            index.DB.buildSelectJoinClause({ table: {} })
        }
    
        expect(callFunction).toThrow('Table not specified.')
    })

    test("4", () => {
        let callFunction = () => {
            index.DB.buildSelectJoinClause({ table: { name: "" } })
        }
    
        expect(callFunction).toThrow('Table description has no name')
    })

    test("5", () => {
        let result = index.DB.buildSelectJoinClause({ table: { name: "tn" } })
        expect(result).toBe("FROM tn")
    })

    test("6", () => {
        let result = index.DB.buildSelectJoinClause({ table: { name: "tn", alias: "ta" } })
        expect(result).toBe("FROM tn ta")
    })
})

// @ponicode
describe("index.DB.buildSelectLimitClause", () => {
    test("0", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [] })
        expect(result).toBe("")
    })

    test("1", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [5] })
        expect(result).toBe("LIMIT 5")
    })

    test("2", () => {
        let result = index.DB.buildSelectLimitClause(undefined)
        expect(result).toBe("")
    })

    test("3", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [5, 10] })
        expect(result).toBe("LIMIT 5, 10")
    })
})

// @ponicode
describe("index.DB.buildSelectClauses", () => {
    test("0", () => {
        let result = index.DB.buildSelectClauses(undefined)
        expect(result).toEqual({ columnsClause: "*", joinClause: "", limitClause: "" })
    })

    test("1", () => {
        let result = index.DB.buildSelectClauses({ columns: ['*'], table: 'tn', limit: [] })
        expect(result).toEqual({ columnsClause: "*", joinClause: "WHERE tn", limitClause: "" })
    })

    test("2", () => {
        let object = ['name n', { name: "gender", alias: "g" }]
        let result = index.DB.buildSelectClauses({ columns: object, limit: [5] })
        expect(result).toEqual({ columnsClause: "name n, gender g", joinClause: "", limitClause: "LIMIT 5" })
    })

    test("3", () => {
        index.DB.buildSelectClauses({ limit: {} })
    })
})

// @ponicode
describe("index.DB.buildSelectStatement", () => {
    test("0", () => {
        let callFunction = () => {
            index.DB.buildSelectStatement(undefined)
        }
    
        expect(callFunction).toThrow('Table not specified.')
    })

    test("1", () => {
        let result = index.DB.buildSelectStatement({ table: "a" })
        expect(result).toBe("SELECT * FROM a WHERE ( 1 )")
    })

    test("2", () => {
        let callFunction = () => {
            index.DB.buildSelectStatement({})
        }
    
        expect(callFunction).toThrow('Table not specified.')
    })
})

// @ponicode
describe("index.DB.buildSelectWhereClause", () => {
    test("0", () => {
        let result = index.DB.buildSelectWhereClause(undefined)
        expect(result).toBe("")
    })

    test("1", () => {
        let result = index.DB.buildSelectWhereClause({})
        expect(result).toBe("")
    })

    test("2", () => {
        let result = index.DB.buildSelectWhereClause({ conditions: [] })
        expect(result).toBe("")
    })

    test("3", () => {
        let object = [['a', '=', '"25"']]
        let object2 = ['and', object]
        let callFunction = () => {
            index.DB.buildSelectWhereClause({ conditions: object2 })
        }
    
        expect(callFunction).toThrow('group.items is not a function')
    })
})
