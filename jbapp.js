
let output = commonLetters('teste', 'teae');
console.log(output)


function commonLetters(s1, s2) {

    
    let items = [];
    let q = [s1, s2].sort().pop();

    for (let i = 0; i < q.length; i++) {
        let l = q[i];

        // If letter already processed, skip to next letter
        if (items.some(item => item['letter'] === l)) {
            continue;
        }

        // If current letter is not common to both strings, skip to next letter
        let isCommonLetter = [s1, s2].every(item => item.indexOf(l) > -1)
        if (!isCommonLetter) {
            continue;
        }

        let letterRegExp = new RegExp(`(${l})`, 'g');

        // Get the most frequent letter count in the subject string.
        let fs = [s1, s2].map(s => s.match(letterRegExp).length)
        let freq = fs.sort().shift()
        
        items.push({letter: l, freq: freq})
    }

    // Sort the items by frequency and then alphabetically.
    let sortedItems = items.sort((a, b) => {
        return (a.freq > b.freq) ? -1 : ((a.freq === b.freq) ? 0 : 1)
    })

    // Sort the items by letter and frequency, and map them to a string, which is the result of the function.
    return sortedItems.map((item) => {
        let {letter, freq} = item;
        return `${letter}${freq}`
    }).join('')
}