export let userSegments = [

];


let createSegment = function(book, chapter, verseStart, verseEnd = null){
    return {
        book,
        chapter: chapter,
        verseStart: verseStart,
        verseEnd: verseEnd && verseEnd,
        toString: ()=> `${book[0].toUpperCase() + book.substring(1)} ${chapter}:${verseStart}${verseEnd == null ? '' : `-${verseEnd}`}`,
    };
};

userSegments.push(createSegment('psalms', 119, 1, 8));

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

export let delimiters = [' ','.',',',':',';'];

function isDelimiter(word) {
    return delimiters.indexOf(word) !== -1;
}

function isWord(token) {
    return token !== undefined && !isDelimiter(token);
}

function getWords(text) {
    return text.split(/(?=[.,:; ])|(?<=[.,:; ])/g).filter(word=>isWord(word));    
}

export let tokeniseVerse = function(verse, userText, wordIndexOffset) {
    let referenceTokens = verse.split(/(?=[.,:; ])|(?<=[.,:; ])/g);
    // let userTokens = userText.split(/(?=[.,:; ])|(?<=[.,:; ])/g);
    let userWords = getWords(userText);
    
    function preprocess(word) {
        if(!word) return word;
        return word.replace('"', '').toLowerCase();
    }

    let referenceWord = null;
    let userWord = null;

    let userWordIndex = wordIndexOffset;
    let outputTokens = [];

    for(let i=0; i<referenceTokens.length; i++) {
        let nextReferenceToken=referenceTokens[i];
        let nextUserWord = userWords[userWordIndex];
        
        if(isWord(nextUserWord)) userWord = preprocess(nextUserWord);
        if(isWord(nextReferenceToken)) referenceWord = preprocess(nextReferenceToken);

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
            text: nextReferenceToken,
            match: isMatch,
            userAttempted,
            isDelimiter: isDelimiter(nextReferenceToken),
        };       
        
        outputTokens.push(token);
    }

    return outputTokens;
};
