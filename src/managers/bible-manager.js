let niv = require('../../assets/niv.json');

let Bible = niv;

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

export default Bible;
