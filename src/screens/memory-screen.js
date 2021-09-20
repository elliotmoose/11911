import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
// import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { SafeAreaView } from 'react-navigation';

import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { fuzzyMatch, loadVerseChunkData, memoryListEventEmitter, tokeniseVerse, verseChunkTitle } from '../helpers/verse-helper';
import { connect } from 'react-redux';
import { capitaliseFirst } from '../helpers/string-helper';

let itemLayoutPositionMap = {}
const MemoryScreen = ({ navigation, currentVerseChunk, completeCurrentVerseChunk, loadStorageToState, neighbourVerseChunks, currentPack, setCurrent, fontScale }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets();
    
    useEffect(()=>{
        loadStorageToState();
    },[]);
    let verseRefScrollView = useRef();
    let userInputScrollView = useRef();
    //TODO: move this into a selector
    let textInputRef = useRef();
    let verseChunkData = (currentVerseChunk !== undefined && currentVerseChunk !== null) ? loadVerseChunkData(currentVerseChunk, Bible) : [];
    let [mode, setMode] = useState('practice'); // practice | test
    let [isPeeking, setIsPeeking] = useState(true);
    let [userText, setUserText] = useState('');
    let [correctVerses, setCorrectVerses] = useState([]);

    let currentVerseNum = (correctVerses.length < verseChunkData.length) ? verseChunkData[correctVerses.length].verseNum : -1;

    useEffect(()=>{
        if(isPeeking) {
            textInputRef.current.blur();
        }
    }, [isPeeking]);

    useEffect(()=>{
        setTimeout(() => {
            userInputScrollView.current.scrollToEnd();
        }, 10);
    }, [correctVerses]);

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
    
    function openMemoryPacks() {
        navigation.navigate('MemoryPacks');
    }
    
    function openSettings() {
        navigation.navigate('Settings');
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

            let scrollToY = itemLayoutPositionMap[newCorrectVerses.length];
            if(scrollToY !== undefined) {
                verseRefScrollView.current.scrollTo({x: 0, y: scrollToY});
            }
            else {
                verseRefScrollView.current.scrollToEnd();
            }
            
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
                            onPress: ()=>{
                                let isMemoryList = (currentPack.id == null);
                                if(isMemoryList) {
                                    openMemoryList();
                                }
                                else if(neighbourVerseChunks?.next?.id){
                                    setCurrent(neighbourVerseChunks?.next?.id, currentPack.id);
                                }
                            }
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
                <View style={{ flex: 1, marginTop: 30 }}>
                    <ScrollView ref={verseRefScrollView}>
                        <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
                            {/* for each verse, we render text */}
                            {verseChunkData.map((verse, i) => {
                                return <View style={{ flexDirection: 'row' }} key={`${i}`} onLayout={(e)=>{
                                        itemLayoutPositionMap[i] = e.nativeEvent.layout.y;
                                    }}>
                                    <Text style={{ ...Fonts.scaled(fontScale, Fonts.h3), marginRight: 6 }}>{verse.verseNum}</Text>
                                    <Text key={`${i}`} style={{ marginTop: 4, lineHeight: 20*fontScale, ...Fonts.scaled(fontScale, Fonts.primary) }}>
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

                <View style={{flexDirection: 'row', height: 24, marginBottom: 2, marginHorizontal: 8}}>
                    <IconButton style={{flex: 1, alignItems: 'flex-start'}} icon={neighbourVerseChunks?.prev && Images.prev} tintColor={Colors.darkgray} size={6} hitslop={hitslop()} onPress={()=>setCurrent(neighbourVerseChunks?.prev?.id, currentPack.id)}>
                        <Text allowFontScaling={false} style={{...Fonts.primary, ...Fonts.small, color: Colors.darkgray, marginLeft: 7, marginBottom: 2}}>{neighbourVerseChunks?.prev?.toString()}</Text>
                    </IconButton>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        <Text  allowFontScaling={false} style={{...Fonts.primary, ...Fonts.small, color: Colors.gray}}>{currentPack?.getNameWithCompletion()}</Text>
                    </View>
                    <IconButton style={{flex: 1, alignItems: 'flex-end'}} icon={neighbourVerseChunks?.next && Images.next} iconPosition='end' tintColor={Colors.darkgray} size={6}  hitslop={hitslop()} onPress={()=>setCurrent(neighbourVerseChunks?.next?.id, currentPack.id)}>
                        <Text  allowFontScaling={false} style={{...Fonts.primary, ...Fonts.small, color: Colors.darkgray, marginRight: 7, marginBottom: 2}}>{neighbourVerseChunks?.next?.toString()}</Text>
                    </IconButton>
                </View>
                <View
                    style={{ flex: 1, padding: 20, backgroundColor: 'white'}}
                >   
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowColor: Colors.black, shadowRadius: 10, borderTopStartRadius: 30, borderTopEndRadius: 30, height: 100, backgroundColor: 'white'}}/>
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, height: 100, backgroundColor: 'white'}}/>
                    <View style={{ flexDirection: 'row', height: 30 }}>
                        <Text allowFontScaling={false} style={{ ...Fonts.h2 }}>{verseChunkTitle(currentVerseChunk)} <Text style={{color: Colors.gray, ...Fonts.small}}>{currentVerseChunk?.version}</Text></Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity hitSlop={hitslop()} style={{ width: 22, height: 22 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={isPeeking ? Images.eye_off : Images.eye} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView ref={userInputScrollView}>
                        <View style={{minHeight: '100%'}}>
                            {correctVerses.map((verse, i)=><View key={`${i}`} style={{flexDirection: 'row'}}>
                                <Text style={{...Fonts.scaled(fontScale, Fonts.h3), marginRight: 6, color: Colors.gray}}>{verse.verseNum}</Text>
                                <Text style={{ marginTop: 4, lineHeight: 20*fontScale, ...Fonts.scaled(fontScale, Fonts.primary), color: Colors.gray }}>{verse.text}</Text>
                            </View>)}
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Text style={{...Fonts.scaled(fontScale, Fonts.h3), marginRight: 6, color: Colors.gray}}>{currentVerseNum == -1 ? '' : currentVerseNum}</Text>
                                <TextInput multiline
                                    ref={textInputRef}
                                    editable={true}
                                    placeholder={isPeeking ? 'No typing while peeking :)' : 'Enter verse ...'}
                                    placeholderTextColor={Colors.gray}
                                    onFocus={()=>setIsPeeking(false)}
                                    onChangeText={onChangeText}
                                    value={userText}
                                    style={{ lineHeight: 20*fontScale, marginBottom: 10, ...Fonts.scaled(fontScale, Fonts.primary), flex: 1}}/>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', height: 22, alignItems: 'center'}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
                        <TouchableOpacity hitSlop={hitslop()} style={{ width: 22, height: 22, marginRight: 12 }} onPress={openSettings}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.settings} />
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={hitslop()} style={{ width: 22, height: 22, marginRight: 12 }} onPress={openMemoryPacks}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.read} />
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={hitslop()} style={{ width: 22, height: 22, marginRight: 12 }} onPress={openMemoryList}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.list} />
                        </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center'}}>
                            <CompletionTag completionDate={currentVerseChunk?.completionDate}/>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <TouchableOpacity hitSlop={hitslop()} style={{ height: 18, borderRadius: 12, borderWidth: 1.2, paddingHorizontal: 16, justifyContent: 'center', width: 86}} onPress={toggleMode}>
                                <Text  allowFontScaling={false} style={{...Fonts.primary, ...Fonts.small, lineHeight: 18, textAlign: 'center'}}>{capitaliseFirst(mode)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top}>
                    <View />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

import { completeCurrentVerseChunk, loadStorageToState, setCurrent } from '../redux/verse-chunk/verse-chunk-actions';
import { hitslop } from '../helpers/ui-helper';
import { currentPack, currentVerseChunk, getNeighbourVerseChunks, } from '../redux/verse-chunk/verse-chunk-selectors';
import IconButton from '../components/icon-button';
import { CompletionTag } from '../components/completion-tag';

const mapStateToProps = (state) => ({
    currentVerseChunk: currentVerseChunk(state),
    neighbourVerseChunks: getNeighbourVerseChunks(state),
    currentPack: currentPack(state),
    fontScale: state.prefs.fontScale,
});
const mapDispatchToProps = {
    completeCurrentVerseChunk,
    loadStorageToState,
    setCurrent
}
export default connect(mapStateToProps, mapDispatchToProps)(MemoryScreen);