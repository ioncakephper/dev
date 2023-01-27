const rewire = require("rewire")
const docexperiment = rewire("../docexperiment")
const isValidItem = docexperiment.__get__("isValidItem")
const convertObjectToStandardItem = docexperiment.__get__("convertObjectToStandardItem")
// @ponicode
describe("isValidItem", () => {
    test("0", () => {
        let result = isValidItem(undefined)
        expect(result).toBe(false)
    })

    test("1", () => {
        let result = isValidItem({})
        expect(result).toBe(false)
    })

    test("2", () => {
        let result = isValidItem({ label: '' })
        expect(result).toBe(false)
    })

    test("3", () => {
        let result = isValidItem({ label: '  ' })
        expect(result).toBe(false)
    })

    test("4", () => {
        let result = isValidItem({ label: 'title' })
        expect(result).toBe(true)
    })
})

// @ponicode
describe("convertObjectToStandardItem", () => {
    test("0", () => {
        let callFunction = () => {
            convertObjectToStandardItem({})
        }
    
        expect(callFunction).toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            convertObjectToStandardItem({ '': 'label' })
        }
    
        expect(callFunction).toThrow()
    })
})
