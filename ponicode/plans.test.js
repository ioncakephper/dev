const rewire = require("rewire")
const plans = rewire("../plans")
const grid = plans.__get__("grid")
const getEntityView = plans.__get__("getEntityView")
// @ponicode
describe("grid", () => {
    test("0", () => {
        let param1 = [{ text: 'ID', data: 'entityId', sort: 'asc' }]
        let param2 = [['25']]
        grid(param1, param2, undefined)
    })
})

// @ponicode
describe("getEntityView", () => {
    test("0", () => {
        let result = getEntityView("Tenant", undefined)
        expect(result).toBe("<table><thead><tr><a href=\"?sb=title\">Title</a><a href=\"?sb=tenantId\">ID</a></tr></thead><tbody /></table>")
    })

    test("1", () => {
        let param2 = [{ "title": "Title 1", "tenantId": "25" }]
        let result = getEntityView("Tenant", param2)
        expect(result).toBe("<table><thead><tr><a href=\"?sb=title\">Title</a><a href=\"?sb=tenantId\">ID</a></tr></thead><tbody><tr><td>Title 1</td><td>25</td></tr></tbody></table>")
    })
})
