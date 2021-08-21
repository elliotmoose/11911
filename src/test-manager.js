// import { EventEmitter } from "EventEmitter";

import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

export let userSegments = [

];

let currentSegment;

export let memoryListEventEmitter = new EventEmitter();

export function setCurrentSegment(newCurrentSegment) {
    currentSegment = newCurrentSegment;
    memoryListEventEmitter.emit('onSetCurrentSegment', currentSegment);
}

let createSegment = function(book, chapter, verseStart, verseEnd = null, completionDate = null){
    return {
        book,
        chapter: chapter,
        verseStart: verseStart,
        verseEnd: verseEnd && verseEnd,
        completionDate,
        toString: ()=> `${book[0].toUpperCase() + book.substring(1)} ${chapter}:${verseStart}${verseEnd == null ? '' : `-${verseEnd}`}`,
    };
};

userSegments.push(createSegment('psalms', 119, 1, 8), createSegment('psalms', 119, 9, 16, new Date()));

export let loadSegmentData = function(segment, bible) {
    let segmentData = [];
    let book = bible[segment.book];
    let chapter = book[segment.chapter-1];

    for(let i=segment.verseStart-1; i<(segment.verseEnd==null ? segment.verseStart : segment.verseEnd); i++) {
        segmentData.push({
            text: chapter[i],
            verseNum: i+1,
        });
    }

    return segmentData;
};

export let delimiters = [' ','.',',',':',';','\n', '"', '!', '?', '(', ')'];

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

export let tokeniseVerse = function(verse, userText, wordIndexOffset) {
    let referenceTokens = getTokens(verse);
    let userWords = getWords(userText);
    
    function preprocess(word) {
        if(!word) return word;
        return word.toLowerCase();
    }

    let referenceWord = null;
    let userWord = null;

    let userWordIndex = wordIndexOffset;
    let outputTokens = [];

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
