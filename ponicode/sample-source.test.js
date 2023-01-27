const rewire = require("rewire")
const sample_source = rewire("../sample-source")
const getFileExtension = sample_source.__get__("getFileExtension")
const parseYamlFile = sample_source.__get__("parseYamlFile")
const convertObjectIntoSidebarDefinition = sample_source.__get__("convertObjectIntoSidebarDefinition")
// @ponicode
describe("getFileExtension", () => {
    test("0", () => {
        let result = getFileExtension(undefined)
        expect(result).toBe("")
    })

    test("1", () => {
        let result = getFileExtension("filename.first.hbs")
        expect(result).toBe("hbs")
    })
})

// @ponicode
describe("parseYamlFile", () => {
    test("0", () => {
        let callFunction = () => {
            parseYamlFile(undefined)
        }
    
        expect(callFunction).toThrow('ENOENT: no such file or directory, open')
    })

    test("1", () => {
        let callFunction = () => {
            parseYamlFile("../outline-old.yaml")
        }
    
        expect(callFunction).toThrow("ENOENT: no such file or directory, open '../outline-old.yaml'")
    })
})

// @ponicode
describe("convertObjectIntoSidebarDefinition", () => {
    test("0", () => {
        let result = convertObjectIntoSidebarDefinition({ "Label": { '@brief': 'text' } })
        expect(result).toEqual({ label: "Label", items: [], brief: "text" })
    })
})
