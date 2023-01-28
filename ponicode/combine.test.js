const combine = require("../combine")
// @ponicode
describe("combine.combineWords", () => {
    test("0", () => {
        let callFunction = () => {
            combine.combineWords(undefined, undefined)
        }
    
        expect(callFunction).toThrow("Cannot read properties of undefined (reading 'trim')")
    })

    test("1", () => {
        let result = combine.combineWords("", "")
        expect(result).toBe("")
    })

    test("2", () => {
        combine.combineWords("user@host:300", "TestUpperCase@Example.com")
    })
})
