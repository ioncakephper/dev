const rewire = require("rewire")
const html = rewire("../html")
const tagAttributes = html.__get__("tagAttributes")
const tagStart = html.__get__("tagStart")
const shortTag = html.__get__("shortTag")
const tag = html.__get__("tag")
// @ponicode
describe("tagAttributes", () => {
    test("0", () => {
        let result = tagAttributes({ name: "dale" })
        expect(result).toBe("name=\"dale\"")
    })

    test("1", () => {
        let result = tagAttributes({ name: "a", id: "b" })
        expect(result).toBe("name=\"a\" id=\"b\"")
    })
})

// @ponicode
describe("tagStart", () => {
    test("0", () => {
        let result = tagStart("p", { name: "a", id: "b" })
        expect(result).toBe("<p name=\"a\" id=\"b\"")
    })
})

// @ponicode
describe("shortTag", () => {
    test("0", () => {
        let result = shortTag("p", { name: "a", id: "b" })
        expect(result).toBe("<p name=\"a\" id=\"b\" />")
    })
})

// @ponicode
describe("tag", () => {
    test("0", () => {
        let result = tag("p", undefined, undefined)
        expect(result).toBe("<p />")
    })

    test("1", () => {
        let result = tag("p", "example", undefined)
        expect(result).toBe("<p>example</p>")
    })

    test("2", () => {
        let result = tag("p", ["a", "b"], undefined)
        expect(result).toBe("<p>ab</p>")
    })

    test("3", () => {
        let result = tag("p", ["a", "b"], { name: "a", id: "b" })
        expect(result).toBe("<p name=\"a\" id=\"b\">ab</p>")
    })
})

// @ponicode
describe("html.tbody", () => {
    test("0", () => {
        let result = html.tbody("", {})
        expect(result).toBe("<tbody />")
    })

    test("1", () => {
        html.tbody("location", {})
    })
})

// @ponicode
describe("html.thead", () => {
    test("0", () => {
        let result = html.thead("", {})
        expect(result).toBe("<thead />")
    })

    test("1", () => {
        let result = html.thead(undefined, undefined)
        expect(result).toBe("<thead />")
    })
})

// @ponicode
describe("html.tr", () => {
    test("0", () => {
        let result = html.tr("", {})
        expect(result).toBe("<tr />")
    })

    test("1", () => {
        let result = html.tr(undefined, undefined)
        expect(result).toBe("<tr />")
    })
})

// @ponicode
describe("html.th", () => {
    test("0", () => {
        let result = html.th("", {})
        expect(result).toBe("<th />")
    })

    test("1", () => {
        let result = html.th(undefined, undefined)
        expect(result).toBe("<th />")
    })
})
