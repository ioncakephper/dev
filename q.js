const LETTER_CHOICE = {
    'Vowel': 0,
    'Cons': 1,
    'Random': 2,
}

function buildWord(s, l = 15) {
    while (s.length < l) {
        switch (getChoices(s)) {
            case LETTER_CHOICE.Vowel:
                s = `${s}${pickRandomVowel()}`;
                break;
            case LETTER_CHOICE.Cons:
                s = `${s}${pickRandomCons()}`;
                break;
            case LETTER_CHOICE.Random:
                s = `${s}${pickRandomLetter()}`
            default:
                break;
        }
    }
    return s
}

function getChoices(s) {
    let twoCons = /[^aeiou]{2}$/;
    let twoVowels = /[aeiou]{2}$/;
    let lastVowel = /[aeiou]$/
    if (twoCons.test(s)) {
        return LETTER_CHOICE.Vowel;
    }
    if (twoVowels.test(s)) {
        return LETTER_CHOICE.Cons;
    }
    if (lastVowel.test(s)) {
        return LETTER_CHOICE.Random;
    }
    return LETTER_CHOICE.Random;
}

function pickRandomVowel() {
    return pickRandom("aeiou")
}

function pickRandomCons() {
    return pickRandom("bcdfghjklmnpqrstvwzyz")
}

function pickRandomLetter() {
    let r = Math.random();
    return (r < 5/18) ? pickRandomVowel() : pickRandomCons() 
    return pickRandom("abcdefghijklmnopqrstuvwxyz")
}

function pickRandom(s) {
    let i = Math.floor(Math.random() * s.length - 1);
    return s.substr(i, 1);
}

let r = buildWord('d', 6)
console.log(r)