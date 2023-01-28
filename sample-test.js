
let {combineWords} = require("./combine.js")
/**
 * @feature: Use two strings to get a third string that has common letters and letter frequency in descending order.
 */

const { italic } = require("colors")

describe("Use two strings to get third string with letters and letter count", () => {
    /**
     * @scenario: A function receives two strings
     */
    describe("Function receives two strings", () => {

        /**
         * @given: s1 as a string with letters
         * @given: s2 as a string with letters
         */
        describe("Given two strings s1, s2", () => {

            /**
             * @when: s1 is "teste" and s2 is "teae"
             * @then: the result must be "e2t1"
             */
            it("Generates e2t1", () => {

                let r = "e2t1";
                expect(combineWords("teste", "teae")).toEqual(r)
            })

            it("Generates ...", () => {
                expect(combineWords("a", "b")).toEqual("a1b1")
            })

            it("Generates ...", () => {
                expect(combineWords("", "b")).toEqual("b1")
            })

            it("Generates ...", () => {
                expect(combineWords("", "bb")).toEqual("b2")
            })

            it("Generates ...", () => {
                expect(combineWords("bb", "")).toEqual("b2")
            })

            it("Matches expected format: letter followed by number", () {
                let regExp = new RegExp(/^([a-bA-B]\d+)*$/,g)
                let r = combineWords("a", "b")
                expect(regExp.test(r)).toBeTrue()
            })
        })
    })
})

