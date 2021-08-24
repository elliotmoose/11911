import React, { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { bookExists, chapterExists, verseExists } from '../managers/bible-manager';
import { createVerseChunk, loadVerseChunkData, userSegments } from '../managers/test-manager';

const headerHeight = 35;
const textInputHeight = 27;

const LabeledTextInput = ({style, placeholder, outlineColor, onChangeText, ...props}) => {
    return (<View style={{...style}} {...props}>
        <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
        <TextInput style={{...styles.textInput, borderColor: outlineColor}} onChangeText={onChangeText} />
    </View>);
};

const AddVerseChunkScreen = ({ navigation, currentBible, addVerseChunk}) => {
    const insets = useSafeAreaInsets();
    let [book, setBook] = useState("");
    let [chapter, setChapter] = useState("");
    let [verseStart, setVerseStart] = useState("");
    let [verseEnd, setVerseEnd] = useState("");

    const [ selectedVerseChunk, setSelectedVerseChunk ] = useState(null);

    let validateBook = bookExists(currentBible, book);
    let validateChapter = chapterExists(currentBible, book, chapter);
    let validateVerseStart = verseExists(currentBible, book, chapter, verseStart);
    let validateVerseEnd = verseExists(currentBible, book, chapter, verseEnd);
    
    let verses = [];
    if(validateBook && validateChapter && validateVerseStart) {
        let verseChunk = createVerseChunk(book.toLowerCase(), parseInt(chapter), parseInt(verseStart), validateVerseEnd ? parseInt(verseEnd) : undefined);
        verses = loadVerseChunkData(verseChunk, currentBible);
    }

    function onPressAdd() {
        let verseChunk = createVerseChunk(book.toLowerCase(), parseInt(chapter), parseInt(verseStart), validateVerseEnd ? parseInt(verseEnd) : undefined);
        addVerseChunk(verseChunk);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1, padding: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: headerHeight}}>
                    <Text style={{...Fonts.h1, lineHeight: headerHeight, color: Colors.black}}>Commit a verse</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity style={{height: headerHeight, justifyContent: 'center', marginTop: 4}} onPress={onPressAdd}>
                        <Text style={{...Fonts.large, ...Fonts.primary, color: '#538862', lineHeight: headerHeight}}>Add</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{ marginTop: 8, padding: 8}}>
                        {verses.map((verse, i)=><Text style={{...Fonts.primary, ...Fonts.small}} key={`${i}`}><Text style={{fontWeight: 'bold'}}>{verse.verseNum}</Text> {verse.text}</Text>)}
                    </View>
                </ScrollView>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 24, marginTop: 8}} >
                        <LabeledTextInput outlineColor={validateBook ? 'black' : Colors.red} autoFocus placeholder="Book" style={{width: 100, marginRight: 20,}} onChangeText={(text)=>setBook(text)}/>
                        <LabeledTextInput outlineColor={validateChapter ? 'black' : Colors.red} placeholder="Chapter" keyboardType="numeric" style={{width: 45}} onChangeText={(text)=>setChapter(text)}/>
                        <Text style={{lineHeight: textInputHeight,...Fonts.h2, marginHorizontal: 10}}>:</Text>
                        <LabeledTextInput outlineColor={validateVerseStart ? 'black' : Colors.red} placeholder="Verse" keyboardType="numeric" style={{width: 40}} onChangeText={(text)=>setVerseStart(text)}/>
                        <Text style={{height: 20, lineHeight: 20, ...Fonts.h2, marginHorizontal: 6}}>-</Text>
                        <LabeledTextInput outlineColor={validateVerseEnd ? 'black' : (verseEnd.length == 0) ? Colors.gray : Colors.red} keyboardType="number-pad" style={{width: 40}} onChangeText={(text)=>setVerseEnd(text)}/>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
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

import { addVerseChunk } from '../redux/verse-chunk/verse-chunk-actions';

const mapStateToProps = (state) => ({
    currentBible: state.bible.currentBible
});

const mapDispatchToProps = {
    addVerseChunk
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVerseChunkScreen);
