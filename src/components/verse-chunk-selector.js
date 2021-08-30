import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { bookExists, chapterExists, verseExists } from '../managers/bible-manager';
import { createVerseChunk, loadVerseChunkData } from '../helpers/verse-helper';

const textInputHeight = 27;

const LabeledTextInput = ({style, placeholder, outlineColor, onChangeText, autoFocus, ...props}) => {
    return (<View style={{...style}} {...props}>
        <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
        <TextInput style={{...styles.textInput, borderColor: outlineColor}} autoFocus={autoFocus} onChangeText={onChangeText} />
    </View>);
};

const VerseChunkSelector = ({ currentBible, onChangeVerseChunk }) => {
    let [book, setBook] = useState("");
    let [chapter, setChapter] = useState("");
    let [verseStart, setVerseStart] = useState("");
    let [verseEnd, setVerseEnd] = useState("");

    let validateBook = bookExists(currentBible, book);
    let validateChapter = chapterExists(currentBible, book, chapter);
    let validateVerseStart = verseExists(currentBible, book, chapter, verseStart);
    let validateVerseEnd = verseExists(currentBible, book, chapter, verseEnd);
    
    useEffect(()=>{
        if(validateBook && validateChapter && validateVerseStart) {
            let verseChunk = createVerseChunk(book.toLowerCase(), parseInt(chapter), parseInt(verseStart), validateVerseEnd ? parseInt(verseEnd) : undefined);
            onChangeVerseChunk(verseChunk);
        }
        else {
            onChangeVerseChunk(null);
        }
    }, [book, chapter, verseStart, verseEnd]);

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 24, marginTop: 8}} >
            <LabeledTextInput autoFocus outlineColor={validateBook ? 'black' : Colors.red} placeholder="Book" style={{width: 100, marginRight: 20,}} onChangeText={(text)=>setBook(text)}/>
            <LabeledTextInput outlineColor={validateChapter ? 'black' : Colors.red} placeholder="Chapter" keyboardType="numeric" style={{width: 45}} onChangeText={(text)=>setChapter(text)}/>
            <Text style={{lineHeight: textInputHeight,...Fonts.h2, marginHorizontal: 10}}>:</Text>
            <LabeledTextInput outlineColor={validateVerseStart ? 'black' : Colors.red} placeholder="Verse" keyboardType="numeric" style={{width: 40}} onChangeText={(text)=>setVerseStart(text)}/>
            <Text style={{height: 20, lineHeight: 20, ...Fonts.h2, marginHorizontal: 6}}>-</Text>
            <LabeledTextInput outlineColor={validateVerseEnd ? 'black' : (verseEnd.length == 0) ? Colors.gray : Colors.red} keyboardType="number-pad" style={{width: 40}} onChangeText={(text)=>setVerseEnd(text)}/>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        ...Fonts.primary,
        ...Fonts.small,
    },
});

const mapStateToProps = (state) => ({
    currentBible: state.bible.currentBible
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(VerseChunkSelector);
