import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { fuzzyMatch, loadVerseChunkData, memoryListEventEmitter, tokeniseVerse, verseChunkTitle } from '../helpers/verse-helper';
import { connect } from 'react-redux';
import { capitaliseFirst } from '../helpers/string-helper';

const MemoryScreen = ({ navigation, currentVerseChunk, completeCurrentVerseChunk, loadMemoryList }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets();
    
    useEffect(()=>{
        loadMemoryList();
    },[]);
    //TODO: move this into a selector
    let verseChunkData = currentVerseChunk !== undefined ? loadVerseChunkData(currentVerseChunk, Bible) : [];
    let [mode, setMode] = useState('practice'); // practice | test
    let [isPeeking, setIsPeeking] = useState(false);
    let [userText, setUserText] = useState('');
    let [correctVerses, setCorrectVerses] = useState([]);

    let currentVerseNum = (correctVerses.length < verseChunkData.length) ? verseChunkData[correctVerses.length].verseNum : -1;

    function togglePeek() {
        if (!isPeeking) {
            setIsPeeking(true);

            switch (mode) {
                case 'test':
                    setUserText('');
                    setCorrectVerses([]);
                    break;
                case 'practice':
                    setUserText('');
                    break;
            }
        }
        else {
            setIsPeeking(false);
        }
    }

    function toggleMode() {
        let newMode = mode == 'practice' ? 'test' : 'practice';
        setMode(newMode);
        setUserText('');

        if(newMode == 'test') {
            setCorrectVerses([]);
        }
    }

    function openMemoryList() {
        navigation.navigate('MemoryList');
    }

    function onChangeText(text) {
        if(text == " ") {
            setUserText("");
            return; //don't add a whitespace at start of line
        }

        setUserText(text);

        let currentVerseIndex = correctVerses.length;
        let currentVerse = verseChunkData[currentVerseIndex];
        if(!currentVerse || !userText) return;
        if(fuzzyMatch(currentVerse.text, text)) {
            let newCorrectVerses = [...correctVerses, { text, verseNum: currentVerse.verseNum}];
            setCorrectVerses(newCorrectVerses);
            setUserText("");
            
            let completedVerseChunk = (newCorrectVerses.length == verseChunkData.length && verseChunkData.length !== 0);
            if(completedVerseChunk) {
                setUserText('');
                setCorrectVerses([]);

                if(mode == 'test') {
                    completeCurrentVerseChunk();
                    Alert.alert('Test Complete!', `You've completed ${currentVerseChunk.toString()}`, [
                        {
                            text: 'Again!',
                        },
                        {
                            text: 'Next Verse',
                            onPress: ()=>openMemoryList()
                        },
                    ])
                }
                else if (mode == 'practice') {
                    Alert.alert('Practice Complete!', "Practice again, or try the test!", [
                        {
                            text: 'Practice',
                        },
                        {
                            text: 'Test',
                            onPress: ()=>setMode('test')
                        },
                    ]);                    
                }
            }
        }
    }

    return (
        <SafeAreaView forceInset={{top: 'always', bottom: 'always'}}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{ height: '100%' }}>
                {/* <Text style={{ ...Fonts.h1, textAlign: 'center', marginTop: 12, marginBottom: 8 }}>Word For Word</Text> */}
                <View style={{ flex: 1, marginTop: 30 }}>
                    <ScrollView>
                        <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
                            {/* for each verse, we render text */}
                            {verseChunkData.map((verse, i) => {
                                return <View style={{ flexDirection: 'row' }} key={`${i}`}>
                                    <Text style={{ ...Fonts.h3, marginRight: 6 }}>{verse.verseNum}</Text>
                                    <Text key={`${i}`} style={{ marginTop: 4, lineHeight: 20, ...Fonts.primary }}>
                                        {tokeniseVerse(verse.text, userText).map((token, j, arr) => {
                                            let tokenBackgroundColor = null;
                                            let tokenTextColor = Colors.text;
                                            let isSolved = (i < correctVerses.length);

                                            let isCurrent = (i == correctVerses.length);
                                            
                                            let practiceReveal = (mode == 'practice' && (isCurrent || correctVerses.length == 0));
                                            let testReveal = (mode == 'test');
                                            let shouldRevealForPeeking = (isPeeking && (practiceReveal || testReveal));
                                            let revealToken = (token.isDelimiter || shouldRevealForPeeking);

                                            if (!revealToken) {
                                                tokenTextColor = Colors.hint;
                                                tokenBackgroundColor = Colors.hint;
                                                
                                                if(isSolved) {
                                                    tokenTextColor = Colors.green;
                                                    tokenBackgroundColor = Colors.green;
                                                }
                                                
                                                
                                                if (token.userAttempted && isCurrent) {
                                                    tokenTextColor = (token.match) ? Colors.green : Colors.red;
                                                    tokenBackgroundColor = (token.match) ? Colors.green : Colors.red;
                                                }
                                            }


                                            return <Text key={`${j}`} style={{ backgroundColor: tokenBackgroundColor, color: tokenTextColor }}>{token.text}</Text>;
                                        })}
                                    </Text>
                                </View>;
                            })}
                        </View>
                    </ScrollView>

                </View>

                {/* <View style={{ flex: 1 }} /> */}
                <View
                    style={{ flex: 1, padding: 20, backgroundColor: 'white'}}
                >   
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowColor: Colors.black, shadowRadius: 10, borderTopStartRadius: 30, borderTopEndRadius: 30, height: 100, backgroundColor: 'white'}}/>
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, height: 100, backgroundColor: 'white'}}/>
                    <View style={{ flexDirection: 'row', height: 30 }}>
                        <Text style={{ ...Fonts.h2 }}>{verseChunkTitle(currentVerseChunk)}</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{ width: 22, height: 22 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={isPeeking ? Images.eye_off : Images.eye} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{minHeight: '100%'}}>
                            {correctVerses.map((verse, i)=><View key={`${i}`} style={{flexDirection: 'row'}}>
                                <Text style={{...Fonts.h3, marginRight: 6, color: Colors.gray}}>{verse.verseNum}</Text>
                                <Text style={{ marginTop: 4, lineHeight: 20, ...Fonts.primary, color: Colors.gray }}>{verse.text}</Text>
                            </View>)}
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Text style={{...Fonts.h3, marginRight: 6, color: Colors.gray}}>{currentVerseNum == -1 ? '' : currentVerseNum}</Text>
                                <TextInput editable={!isPeeking} multiline
                                    placeholder={isPeeking ? 'No typing while peeking :)' : 'Enter verse ...'}
                                    placeholderTextColor={Colors.gray}
                                    onChangeText={onChangeText}
                                    value={userText}
                                    style={{ lineHeight: 20, marginBottom: 10, ...Fonts.primary, flex: 1}}/>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', height: 22, alignItems: 'center'}}>
                        <TouchableOpacity style={{ width: 22, height: 22, marginRight: 12 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.settings} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 22, height: 22, marginRight: 12 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.read} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 22, height: 22, marginRight: 12 }} onPress={openMemoryList}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.list} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{ height: 18, borderRadius: 12, borderWidth: 1, paddingHorizontal: 20, justifyContent: 'center'}} onPress={toggleMode}>
                            <Text style={{...Fonts.primary, ...Fonts.small, lineHeight: 18}}>{capitaliseFirst(mode)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top}>
                    <View />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

import { completeCurrentVerseChunk, loadMemoryList } from '../redux/verse-chunk/verse-chunk-actions';

const mapStateToProps = (state) => ({
    currentVerseChunk: state.verseChunk.currentVerseChunk,
});
const mapDispatchToProps = {
    completeCurrentVerseChunk,
    loadMemoryList
}
export default connect(mapStateToProps, mapDispatchToProps)(MemoryScreen);