

/**
 * Takes in two strings and returns the letters that are common to both strings.           
 * @param {string} s1 - the first string           
 * @param {string} s2 - the second string           
 * @returns {string} - the letters that are common to both strings           
 */
function combineWords(s1, s2) {
    s1 = s1.trim();
    s2 = s2.trim();

    let q = [s1, s2].sort().shift();
    let items = [];

    const getCommonLetters = (source, s1, s2) => {
        let commonLetters = []
        for (let l of source.split('')) {
            if (commonLetters.indexOf(l) > -1) {
                continue;
            }

            if ([s1, s2].some((s) => s.indexOf(l) < 0)) {
                continue;
            }

            commonLetters.push(l)
        }

        commonLetters = commonLetters.sort()

        return commonLetters;
    }

    let commonLetters = getCommonLetters(q, s1, s2);
    
    lastLength = -1;
    for (let letter of commonLetters) {
        let r = new RegExp(`(${letter})`, 'g');

        // get letter frequency in each strings
        let freq = [s1, s2].map(s => {
            return s.match(r).length;
        })

        // then get only those number of letter occurrences less than previous length
        .filter(sl => {
            if (lastLength < 0)
                 return true;
            return sl === lastLength - 1;
        })
        // get the first result from the resulting array
        [0]

        // ignore letters where feasible number not found.
        if (!freq)
            continue;

        items.push({letter: letter, freq: freq})
        lastLength = freq;

    }
    
    // Sort the items by letter and frequency, descending.
    let sortedItems = items.sort((a, b) => {
        if (a.letter < b.letter && a.freq > b.freq) return -1;
        if (a.letter === b.letter && a.freq === b.freq) return 0;
        return 1;
    })

    // Build letter and frequency elements, and join them together.
    return sortedItems.map(item => {
        return `${item.letter}${item.freq}`;
    }).join("")
}

let r = combineWords("teste", "teae");
// let r = combineWords("emailGooglecom",
// "ponicodecom");

module.exports = {
    combineWords,
}