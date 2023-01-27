const dbc = require("../dbc")
// @ponicode
describe("dbc.hasSomeKeys", () => {
    test("0", () => {
        let result = dbc.hasSomeKeys(undefined, undefined)
        expect(result).toBe(false)
    })

    test("1", () => {
        let result = dbc.hasSomeKeys({ a: 'a' }, ["a", 'b'])
        expect(result).toBe(true)
    })

    test("2", () => {
        let result = dbc.hasSomeKeys({ a: 'a' }, undefined)
        expect(result).toBe(false)
    })

    test("3", () => {
        let result = dbc.hasSomeKeys(undefined, ['a', 'b'])
        expect(result).toBe(false)
    })
})

// @ponicode
describe("dbc.hasAllKeys", () => {
    test("0", () => {
        let result = dbc.hasAllKeys(undefined, undefined)
        expect(result).toBe(true)
    })

    test("1", () => {
        let result = dbc.hasAllKeys(undefined, ['a'])
        expect(result).toBe(false)
    })

    test("2", () => {
        let result = dbc.hasAllKeys({ a: 'a' }, undefined)
        expect(result).toBe(true)
    })

    test("3", () => {
        let result = dbc.hasAllKeys({ a: 'a' }, ['b'])
        expect(result).toBe(false)
    })
})
