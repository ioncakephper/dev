const rewire = require("rewire")
const quick = rewire("../quick")
const buildStandardItem = quick.__get__("buildStandardItem")
// @ponicode
describe("buildStandardItem", () => {
    test("0", () => {
        buildStandardItem("Text")
    })
})
