import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'

export function listToIdObject(list) {
    if(!list) return {};

    let output = {};

    for(let item of list) {
        output[item.id] = item;
    }

    return output;
}
export let createVerseChunk = function({id=uuidv4(), book, chapter, verseStart, verseEnd = null, version='NIV', completionDate = null, dateCreated = new Date()}){
    return {
        id,
        book,
        chapter,
        verseStart,
        verseEnd,
        version,
        completionDate,
        dateCreated,
        toString: ()=> `${book[0].toUpperCase() + book.substring(1)} ${chapter}:${verseStart}${verseEnd == null ? '' : `-${verseEnd}`}`,
    };
};
export let createMemoryPack = function({id=uuidv4(), name, verseChunks={}, completionDate = null, dateCreated = new Date()}){

    let newVerseChunks = {};
    Object.values(verseChunks).forEach(chunk => newVerseChunks[chunk.id] = createVerseChunk(chunk));

    let newMemoryPack = {
        id,
        name,
        verseChunks: newVerseChunks,
        getCompletionDate(){
            let completeDate;
            let completed = true;
            for(let verseChunk of Object.values(this.verseChunks)) {
                if(!verseChunk.completionDate) {
                    completed = false;
                    break;
                }
                else if(completeDate === undefined || moment(completeDate).isBefore(verseChunk.completionDate)){
                    completeDate = verseChunk.completionDate;
                }
            }

            if(!completed) return null;

            return completeDate;
        },
        dateCreated,
        getNameWithCompletion(){
            return `${this.name} (${this.getCompletionCount()}/${Object.values(this.verseChunks).length} completed)`;
        },
        getCompletionCount(){
            let count = 0;
            for(let verseChunk of Object.values(this.verseChunks)) {
                if(verseChunk.completionDate) count++;
            }
            return count;
        },
    };

    return newMemoryPack;
};

export let verseChunkTitle = function (verseChunk) {
    if(!verseChunk) return "";    
    let { book, chapter, verseStart, verseEnd } = verseChunk;
    return `${book[0].toUpperCase() + book.substring(1)} ${chapter}:${verseStart}${verseEnd == null ? '' : `-${verseEnd}`}`;
}

export let loadVerseChunkData = function(verseChunk, bible) {
    let verseChunkData = [];
    if(!bible) return [];
    let book = bible[verseChunk.book];
    if(!book) return [];
    let chapter = book[verseChunk.chapter-1];
    if(!chapter) return [];

    for(let i=verseChunk.verseStart-1; i<(verseChunk.verseEnd==null ? verseChunk.verseStart : verseChunk.verseEnd); i++) {
        verseChunkData.push({
            text: chapter[i],
            verseNum: i+1,
        });
    }

    return verseChunkData;
};

export let verseChunkStringData = function(verseChunk, bible) {
    let book = bible[verseChunk.book];
    if(!book) return "";
    let chapter = book[verseChunk.chapter-1];
    if(!chapter) return "";    
    let output = ""
    for(let i=verseChunk.verseStart-1; i<(verseChunk.verseEnd==null ? verseChunk.verseStart : verseChunk.verseEnd); i++) {
        output += `${i+1} ${chapter[i]} `;
    }

    return output;
}

export const delimiters = [' ','.',',',':',';','\n', '"', '!', '?', '(', ')'];

function isDelimiter(word) {
    return delimiters.indexOf(word) !== -1;
}

function isWord(token) {
    return token !== null && token !== undefined && !isDelimiter(token) && token.length !== 0;
}

function getTokens(text) {
    let string = '';
    let output = [];

    for(let char of text) {
        let isDelimiter = (delimiters.indexOf(char) !== -1);
        if(isDelimiter) {
            if(string.length !== 0) output.push(string);
            string = '';
            output.push(char);
        }
        else {
            string += char;
        }
    }

    if(string.length !== 0) output.push(string);

    return output;
}

function getWords(text) {
    return getTokens(text).filter(word=>isWord(word));    
}

export let tokeniseVerse = function(verse, userText) {
    let referenceTokens = getTokens(verse);
    let userWords = getWords(userText);
    
    function preprocess(word) {
        if(!word) return word;
        return word.toLowerCase();
    }

    let referenceWord = null;
    let userWord = null;

    let userWordIndex = 0;
    let outputTokens = [];
    let allMatch = true;

    for(let i=0; i<referenceTokens.length; i++) {
        let nextReferenceTokenRaw = referenceTokens[i];
        let nextReferenceToken = preprocess(nextReferenceTokenRaw);
        let nextUserWord = preprocess(userWords[userWordIndex]);
        
        if(isWord(nextUserWord)) userWord = nextUserWord;
        if(isWord(nextReferenceToken)) referenceWord = nextReferenceToken;

        let userAttempted = userWordIndex < userWords.length && !(userWords.length === 1 && userWord.length === 0);        
        let isMatch = (userWord === referenceWord);

        
        //we look at a user word until we see a reference WORD that either matches, or mismatches
        //to do this, we need to first make sure the reference word is a word
        //a comparison constitutes an increment
        //a comparison happens when both are words
        //IMPLEMENTATION NOTE:
        //userWord waits for the next reference token
        if(isWord(nextReferenceToken) && isWord(userWord)) {
            userWordIndex++;
        }
        
        if(isMatch) {
            //reset
            userWord = null;
            referenceWord = null;
        }
        else {
            allMatch = false;
        }
        

        let token = {
            text: nextReferenceTokenRaw,
            match: isMatch,
            userAttempted,
            isDelimiter: isDelimiter(nextReferenceToken),
        };
        
        outputTokens.push(token);
    }

    return outputTokens;
};

export function tokenise(verseChunkData, currentVerseIndex, userText, peeking, mode='practice') {
    let output = []; //list of verses, where each verse is a list of tokens

    for(let verse of verseChunkData) {
        let verseTokenObjects = [];
        let verseTokens = getTokens(verse);

        for(let verseToken of verseTokens) {
            verseTokenObjects.push({
                text: verseToken,
                state: 'hidden', // hidden | correct | peeked | delimiter
                show: false
            })
        }

        output.push(verseTokenObjects);
    }

    return output;
}

export function fuzzyMatch(verse, userText) {
    let referenceTokens = getTokens(verse);
    let userWords = getWords(userText);
    
    function preprocess(word) {
        if(!word) return word;
        return word.toLowerCase();
    }

    let referenceWord = null;
    let userWord = null;

    let userWordIndex = 0;

    for(let i=0; i<referenceTokens.length; i++) {
        let nextReferenceTokenRaw = referenceTokens[i];
        let nextReferenceToken = preprocess(nextReferenceTokenRaw);
        let nextUserWord = preprocess(userWords[userWordIndex]);
        
        if(isWord(nextUserWord)) userWord = nextUserWord;
        if(isWord(nextReferenceToken)) referenceWord = nextReferenceToken;

        let isMatch = (userWord === referenceWord);

        
        //we look at a user word until we see a reference WORD that either matches, or mismatches
        //to do this, we need to first make sure the reference word is a word
        //a comparison constitutes an increment
        //a comparison happens when both are words
        //IMPLEMENTATION NOTE:
        //userWord waits for the next reference token
        if(isWord(nextReferenceToken) && isWord(userWord)) {
            userWordIndex++;
        }
        
        if(isMatch) {
            //reset
            userWord = null;
            referenceWord = null;
        }
        
        if(!isMatch && !isDelimiter(nextReferenceToken)){
            return false;
        }        
    }

    return true;
}

// export function tokeniseVerseChunk(verseChunk, userText) {
//     let userTextTokens = getTokens(userText);
//     for(let verse of verseChunk) {
//         let verseTokens = getTokens(verse);
//     }
// }