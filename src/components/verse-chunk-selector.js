import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Bible, { bookExists, chapterExists, verseExists } from '../managers/bible-manager';
import { createVerseChunk, loadVerseChunkData } from '../helpers/verse-helper';
import LabeledTextInput from './labeled-input';
import LabeledPicker from './labeled-picker';
import LabeledAutocompleteInput from './labeled-autocomplete-input';
const textInputHeight = 27;

class VerseChunkSelector extends React.Component{

    state = {
        book: "",
        chapter: "",
        verseStart: "",
        verseEnd: "",
        validateBook: "",
        validateChapter: "",
        validateVerseStart: "",
        validateVerseEnd: "",
    }

    clearTextInputs() {
        this.setState({book: "", chapter: "", verseStart: "", verseEnd: ""});
        this.bookTextInput.clear();
        this.chapterTextInput.clear();
        this.verseStartTextInput.clear();
        this.verseEndTextInput.clear();
        this.props.onChangeVerseChunk(null);
    }

    onTextInputChange(key, value) {
        this.setState({[key]: value}, ()=>{
            let { currentBible, onChangeVerseChunk } = this.props;
            let { book, chapter, verseStart, verseEnd } = this.state;
    
            let validateBook = bookExists(Bible, book);
            let validateChapter = chapterExists(Bible, book, chapter);
            let validateVerseStart = verseExists(Bible, book, chapter, verseStart);
            let validateVerseEnd = verseExists(Bible, book, chapter, verseEnd);

            this.setState({ validateBook, validateChapter, validateVerseStart, validateVerseEnd });
    
            if(validateBook && validateChapter && validateVerseStart) {
                let verseChunk = createVerseChunk({
                    book: book.toLowerCase(), 
                    chapter: parseInt(chapter), 
                    verseStart: parseInt(verseStart), 
                    verseEnd: validateVerseEnd ? parseInt(verseEnd) : undefined
                });
                
                onChangeVerseChunk(verseChunk);
            }
            else {
                onChangeVerseChunk(null);
            }
        });
    }
    
    render() {
        let { verseEnd, validateBook, validateChapter, validateVerseStart, validateVerseEnd } = this.state;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 24, marginTop: 8}} >                 
                <LabeledAutocompleteInput ref={ref=>this.bookTextInput = ref} 
                    autoFocus 
                    outlineColor={validateBook ? 'black' : Colors.red} 
                    placeholder="Book" 
                    style={{width: 100, marginRight: 20,}} 
                    onChangeText={(text)=>this.onTextInputChange('book', text)}
                    onSubmitEditing={()=>this.chapterTextInput.focus()}
                    />
                <LabeledTextInput ref={ref=>this.chapterTextInput = ref} 
                    outlineColor={validateChapter ? 'black' : Colors.red} 
                    placeholder="Chapter" 
                    keyboardType="number-pad" 
                    returnKeyType="done"
                    style={{width: 45}} 
                    onChangeText={(text)=>this.onTextInputChange('chapter', text)}
                    onSubmitEditing={()=>this.verseStartTextInput.focus()}
                    />
                <Text style={{lineHeight: textInputHeight,...Fonts.h2, marginHorizontal: 10}}>:</Text>
                <LabeledTextInput ref={ref=>this.verseStartTextInput = ref} 
                    outlineColor={validateVerseStart ? 'black' : Colors.red} 
                    placeholder="Verse" 
                    keyboardType="number-pad" 
                    returnKeyType="done"
                    style={{width: 40}} 
                    onChangeText={(text)=>this.onTextInputChange('verseStart', text)}
                    onSubmitEditing={()=>this.verseEndTextInput.focus()}
                    />
                <Text style={{height: 20, lineHeight: 20, ...Fonts.h2, marginHorizontal: 6}}>-</Text>
                <LabeledTextInput ref={ref=>this.verseEndTextInput = ref} 
                    outlineColor={validateVerseEnd ? 'black' : (verseEnd.length == 0) ? Colors.gray : Colors.red} 
                    keyboardType="number-pad" 
                    returnKeyType="done"
                    style={{width: 40}} 
                    onChangeText={(text)=>this.onTextInputChange('verseEnd', text)}
                    onSubmitEditing={()=>this.verseEndTextInput.blur()}
                />
            </View>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef : true})(VerseChunkSelector);
