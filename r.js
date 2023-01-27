let availableWords = [
    "denisa",
    "delimiter",
    "demonic",
    "denigrate",
    "denaturat",
]
/**
 * Takes in a partial word and returns an array of suggestions for the word.
 * @param {string} partialWord - the partial word to search for.
 * @returns {string[]} - an array of suggestions for the word.
 */
function suggestTrailing(partialWord) {
    let segments = availableWords.filter(w => w.startsWith(partialWord)).sort();
    return segments;
}

/**
 * Takes in a partial word and returns the first letter of each word that starts with the
 * partial word.
 * @param {string} partialWord - the partial word to search for in the available words array
 * @returns {string[]} - an array of the first letter of each word that starts with the partial word
 */
function suggestSegments(partialWord) {
    let segments = availableWords.filter(w => w.startsWith(partialWord)).sort();
    segments = segments.map(w => {
        return w.substr(partialWord.length, 1)
    })
    return segments;
}

function suggestContextualSegments(partialWord) {
    let segments = availableWords.filter(w => w.indexOf(partialWord) > -1).sort();
    let results = []
    segments.forEach(w => {
        let regEx = new RegExp(partialWord, 'g');
        let matches = regEx.exec(w);
        if (matches) {
            results.push(w.substr(matches.index + 1, 1))
            // matches = regEx.exec(w)
        }
    })
    return results;
}

function suggestContextual(partialWord, trailLength = 2, size = 25) {
    while (partialWord.length < size) {
        let results = []
        for (var i = 0; i < Math.min(trailLength, partialWord.length); i++) {
            let startIndex = partialWord.length - i - 1;
            let segments = suggestContextualSegments(partialWord.substr(startIndex, i + 1))
            results = [...results, ...segments]
        }
        // return results;

        if (results.length === 0) {
            break;
        }
        let r = Math.random()
        let expr = r * results.length;
        let idx = Math.floor(expr)
        let letter = results[idx]

        partialWord = `${partialWord}${letter}`;
    }
    return partialWord;
}

let parts = suggestTrailing('den');
console.table(parts)

let sg = suggestSegments('den');
console.table(sg)

let r = suggestContextual('den', 3, 7);
console.table(r)