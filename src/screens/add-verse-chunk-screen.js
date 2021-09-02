import React, { useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData } from '../helpers/verse-helper';
import VerseChunkSelector from '../components/verse-chunk-selector';

const headerHeight = 35;
const textInputHeight = 27;

const LabeledTextInput = ({style, placeholder, outlineColor, onChangeText, autoFocus, ...props}) => {
    return (<View style={{...style}} {...props}>
        <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
        <TextInput style={{...styles.textInput, borderColor: outlineColor}} autoFocus={autoFocus} onChangeText={onChangeText} />
    </View>);
};

const AddVerseChunkScreen = ({ navigation, currentBible, addVerseChunk}) => {
    const insets = useSafeAreaInsets();
    const [ selectedVerseChunk, setSelectedVerseChunk ] = useState(null);
    
    let verses = selectedVerseChunk ? loadVerseChunkData(selectedVerseChunk, currentBible) : [];

    function onChangeVerseChunk(verseChunk) {
        setSelectedVerseChunk(verseChunk);
    }

    function onPressAdd() {
        if(!selectedVerseChunk) {
            Alert.alert('Invalid Verse', 'Please enter a verse that exists');
            return;
        }
        
        addVerseChunk(selectedVerseChunk);
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
                        <VerseChunkSelector onChangeVerseChunk={onChangeVerseChunk}/>
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
