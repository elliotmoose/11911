import React, { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { bookExists, chapterExists, verseExists } from '../managers/bible-manager';
import { createMemoryPack, createVerseChunk, listToIdObject, loadVerseChunkData, verseChunkStringData } from '../helpers/verse-helper';
import VerseChunkSelector from '../components/verse-chunk-selector';

const headerHeight = 35;

const AddMemoryPackScreen = ({ navigation, currentBible, addMemoryPack}) => {
    const insets = useSafeAreaInsets();
    const verseSelectorRef = React.createRef();
    
    const [ selectedVerseChunk, setSelectedVerseChunk ] = useState(null);
    const [ verseChunks, setVerseChunks ] = useState([]);
    const [ packName, setPackName ] = useState("");
    
    let verses = selectedVerseChunk ? loadVerseChunkData(selectedVerseChunk, currentBible) : [];

    function onChangeVerseChunk(verseChunk) {
        setSelectedVerseChunk(verseChunk);
    }

    function onPressAdd() {
        let memoryPack = createMemoryPack({name: packName, verseChunks: listToIdObject(verseChunks)});
        addMemoryPack(memoryPack);
        navigation.goBack();
    }

    function clearTextInputs() {
        verseSelectorRef.current.clearTextInputs();        
    }

    function onPressAddVerseChunk() {
        if(!selectedVerseChunk) {
            Alert.alert('Invalid Verse', 'Please enter a verse that exists');
            return;
        }

        setVerseChunks([...verseChunks, selectedVerseChunk]);
        clearTextInputs();
    }

    function onPressRemoveVerseChunk(index) {
        let copy = [...verseChunks];
        copy.splice(index, 1);
        setVerseChunks(copy);
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1}}>
                <View style={{flex: 1, padding: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: headerHeight}}>
                        <Text style={{...Fonts.h1, lineHeight: headerHeight, color: Colors.black}}>Create Memory Pack</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={{height: headerHeight, justifyContent: 'center', marginTop: 4}} onPress={onPressAdd}>
                            <Text style={{...Fonts.large, ...Fonts.primary, color: '#538862', lineHeight: headerHeight}}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View>
                            <LabeledTextInput autoFocus outlineColor={'black'} placeholder="Memory Pack Name" style={{width: 150, marginRight: 20, marginBottom: 8}} textAlign='left' onChangeText={(text)=>setPackName(text)}/>
                            {verseChunks.map((verseChunk, i)=>{
                                return <View style={{marginTop: 8, marginLeft: 6}} key={`${i}`}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{...Fonts.alternate, color: Colors.darkgray, ...Fonts.small}}>{i+1}. {verseChunk.toString()}</Text>
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity style={{height: 18, width: 18}} hitSlop={hitslop()} onPress={()=>onPressRemoveVerseChunk(i)}>
                                            <Image source={Images.remove} style={{flex: 1, tintColor: 'black', width: '100%'}} resizeMode='contain'/>
                                        </TouchableOpacity>
                                    </View>
                                    <Text numberOfLines={2} style={{...Fonts.primary, ...Fonts.small, marginVertical: 3}}>{verseChunkStringData(verseChunk, currentBible)}</Text>
                                </View>
                            })}
                        </View>
                    </ScrollView>     
                </View>
                <View style={{ height: 250}} >   
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowColor: Colors.black, shadowRadius: 10, borderTopStartRadius: 30, borderTopEndRadius: 30, height: 100, backgroundColor: 'white'}}/>
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, height: 240, backgroundColor: 'white'}}/>
                    <View style={{ flexDirection: 'row', padding: 20, paddingBottom: 0, alignItems: 'center'}}>
                        <Text style={{ ...Fonts.h2 }}>add verse to pack</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{height: 24, width: 24}} hitSlop={hitslop()} onPress={onPressAddVerseChunk}>
                            <Image source={Images.add} style={{flex: 1, tintColor: 'black', width: '100%'}} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex: 1, marginTop: 8}}>
                        <View style={{flex: 1, paddingHorizontal: 20}}>
                            {verses.map((verse, i)=><Text style={{...Fonts.primary, ...Fonts.small}} key={`${i}`}><Text style={{fontWeight: 'bold'}}>{verse.verseNum}</Text> {verse.text}</Text>)}
                        </View>
                    </ScrollView>
                    <VerseChunkSelector ref={verseSelectorRef} onChangeVerseChunk={onChangeVerseChunk} />
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top}>
                    <View />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

import LabeledTextInput from '../components/labeled-input';
import { hitslop } from '../helpers/ui-helper';
import { addMemoryPack } from '../redux/verse-chunk/verse-chunk-actions';

const mapStateToProps = (state) => ({
    currentBible: state.bible.currentBible
});

const mapDispatchToProps = {
    addMemoryPack
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMemoryPackScreen);
