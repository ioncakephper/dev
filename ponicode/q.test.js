const rewire = require("rewire")
const q = rewire("../q")
const buildFilename = q.__get__("buildFilename")
// @ponicode
describe("buildFilename", () => {
    test("0", () => {
        let result = buildFilename("file.com")
        expect(result).toBe("file.com")
    })

    test("1", () => {
        let result = buildFilename("path to file/sublevel")
        expect(result).toBe("path_to file/sublevel")
    })

    test("2", () => {
        let result = buildFilename("p to file")
        expect(result).toBe("p_to_file")
    })
})
