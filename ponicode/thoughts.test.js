const rewire = require("rewire")
const thoughts = rewire("../thoughts")
const loadFileContent = thoughts.__get__("loadFileContent")

const Router = thoughts.__get__("Router")
// @ponicode
describe("Router.extractRoute", () => {
    let inst

    beforeEach(() => {
        inst = new Router()
    })

    test("0", () => {
        inst.extractRoute('tenants/index')
    })
})
