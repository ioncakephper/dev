const rewire = require("rewire")
const entity_management = rewire("../entity-management")

const buildOrderbyClause = entity_management.__get__("buildOrderbyClause")
const buildGroupbyClause = entity_management.__get__("buildGroupbyClause")
// @ponicode
describe("buildOrderbyClause", () => {
    test("0", () => {
        let result = buildOrderbyClause(undefined)
        expect(result).toBe("")
    })
})

// @ponicode
describe("buildGroupbyClause", () => {
    test("0", () => {
        let result = buildGroupbyClause(undefined)
        expect(result).toBe("")
    })

    test("1", () => {
        let result = buildGroupbyClause({})
        expect(result).toBe("")
    })

    test("2", () => {
        buildGroupbyClause(undefined)
    })
})

// @ponicode
describe("entity_management.getCountEntityRecords", () => {
    test("0", () => {
        let callFunction = () => {
            entity_management.getCountEntityRecords('    ', undefined)
        }
    
        expect(callFunction).toThrow('Expectation not met: "entityName"')
    })
})

// @ponicode
describe("entity_management.getEntityRecordById", () => {
    test("0", () => {
        let callFunction = () => {
            entity_management.getEntityRecordById('   ', undefined)
        }
    
        expect(callFunction).toThrow('Expectation not met: "entityName"')
    })

    test("1", () => {
        let callFunction = () => {
            entity_management.getEntityRecordById('  ', ' ')
        }
    
        expect(callFunction).toThrow('Expectation not met: "entityName"')
    })

    test("2", () => {
        let callFunction = () => {
            entity_management.getEntityRecordById('applications', undefined)
        }
    
        expect(callFunction).toThrow('Expectation not met: "id"')
    })

    test("3", () => {
        let result = entity_management.getEntityRecordById('applications', 5)
        expect(result).toEqual({ applicationsid: "10001" })
    })

    test("4", () => {
        let result = entity_management.getEntityRecordById('appliications', '10001   ')
        expect(result).toEqual({ applicationsid: "10001" })
    })
})

// @ponicode
describe("entity_management.getAllEntityNames", () => {
    test("0", () => {
        let callFunction = () => {
            entity_management.getAllEntityNames(undefined)
        }
    
        expect(callFunction).toThrow('Guarantees unmet: [null]')
    })
})
