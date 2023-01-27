const rewire = require("rewire")
const ui_field_helpers = rewire("../ui-field-helpers")
const booleanField = ui_field_helpers.__get__("booleanField")
// @ponicode
describe("booleanField", () => {
    test("0", () => {
        let result = booleanField("label_1", {})
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result = booleanField("label_3", {})
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result = booleanField("ISO 9001", {})
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result = booleanField("AOP", {})
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result = booleanField("ISO 22000", {})
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result = booleanField("", {})
        expect(result).toMatchSnapshot()
    })
})
