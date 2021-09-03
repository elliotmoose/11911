let niv = require('../../assets/niv.json');

let Bible = niv;

export function bookNames() {
    return Object.keys(Bible);
}

export function bookExists(bible, bookStr) { 
    if(!bookStr) return false;
    let book = bible[bookStr.toLowerCase()];
    return book !== undefined;
}

export function chapterExists(bible, bookStr, chapterStr) {
    if(!bookStr) return false;
    if(!chapterStr) return false;
    let chapterNum = parseInt(chapterStr);
    if(!chapterNum) return false;
    let book = bible[bookStr.toLowerCase()];
    if(!book) return false;
    let chapter = book[chapterNum-1];
    if(!chapter) return false;
    return true;
}

export function verseExists(bible, bookStr, chapterStr, verseStr) {
    if(!bookStr) return false;
    if(!chapterStr) return false;
    let chapterNum = parseInt(chapterStr);
    if(!chapterNum) return false;
    let verseNum = parseInt(verseStr);
    if(!verseNum) return false;
    let book = bible[bookStr.toLowerCase()];
    if(!book) return false;
    let chapter = book[chapterNum-1];
    if(!chapter) return false;
    let verse = chapter[verseNum-1];
    if(!verse) return false;
    return true;
}

export function autocompleteBook(input) {
    if(input.length == 0) return "";
    const names = bookNames();
    let inputProcessed = input.toLowerCase();
    for(let name of names) {
        let processedName = name.toLowerCase();
        let indexSearch = processedName.indexOf(inputProcessed);
        let match = (indexSearch == 0);        
        
        if(match) {
            let isNumber = !isNaN(parseInt(inputProcessed[0]));
            if(isNumber && inputProcessed.replace(" ", "").length <= 1) continue;
            return processedName;
        }
    }

    return "";
}

export default Bible;
