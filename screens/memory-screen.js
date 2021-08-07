import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, KeyboardAvoidingView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Bible from '../src/bible-manager';
import Colors from '../src/colors';
import Fonts from '../src/fonts';
import Images from '../src/images';
import { loadSegmentData, tokeniseVerse, userSegments } from '../src/test-manager';

const MemoryScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets();

    let segment = userSegments[0];
    let segmentData = loadSegmentData(segment, Bible);

    let [displayMode, setDisplayMode] = useState('boxHint');
    let [isPeeking, setIsPeeking] = useState(false);
    let [userText, setUserText] = useState('');

    let config = {
        peekResetMode: 'segment', //sentence | segment | verse
    };

    let wordIndex = 0;
    let lastVerseLastWordIndex = 0;

    function togglePeek() {
        if (!isPeeking) {
            setIsPeeking(true);

            switch (config.peekResetMode) {
                case 'segment':
                    setUserText('');
                    break;
            }
        }
        else {
            setIsPeeking(false);
        }
    }

    return (
        <SafeAreaView>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{ height: '100%' }}>
                {/* <Text style={{ ...Fonts.h1, textAlign: 'center', marginTop: 12, marginBottom: 8 }}>Word For Word</Text> */}
                <View style={{ flex: 1, marginTop: 30 }}>
                    <ScrollView>
                        <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
                            {/* for each verse, we render text */}
                            {segmentData.map((verse, i) => {
                                return <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...Fonts.h3, marginRight: 6 }}>{verse.verseNum}</Text>
                                    <Text key={`${i}`} style={{ marginTop: 4, lineHeight: 20, ...Fonts.primary }}>
                                        {tokeniseVerse(verse.text, userText, lastVerseLastWordIndex).map((token, j, arr) => {
                                            let isLastWordInVerse = (j === arr.length - 1);
                                            if (isLastWordInVerse) lastVerseLastWordIndex = wordIndex;
                                            if (!token.isDelimiter) wordIndex++; //count the number of words to offset
                                            let tokenBackgroundColor = null;
                                            let tokenTextColor = Colors.text;
                                            let coverToken = (!token.isDelimiter && displayMode === 'boxHint' && !isPeeking);
                                            if (coverToken) {
                                                tokenTextColor = Colors.hint;
                                                tokenBackgroundColor = Colors.hint;
                                            }

                                            if (coverToken && token.userAttempted) {
                                                tokenTextColor = token.match ? Colors.green : Colors.red;
                                                tokenBackgroundColor = token.match ? Colors.green : Colors.red;
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
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowColor: Colors.black, shadowRadius: 10, borderTopStartRadius: 20, borderTopEndRadius: 20, height: 100, backgroundColor: 'white'}}/>
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, height: 100, backgroundColor: 'white'}}/>
                    <View style={{ flexDirection: 'row', height: 30 }}>
                        <Text style={{ ...Fonts.h2 }}>{segment.toString()}:</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{ width: 22, height: 22 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={isPeeking ? Images.eye_off : Images.eye} />
                        </TouchableOpacity>
                    </View>
                    <TextInput editable={!isPeeking} multiline
                        placeholder={isPeeking ? 'No typing while peeking :)' : 'Enter verse ...'}
                        placeholderTextColor={Colors.gray}
                        onChangeText={(text) => setUserText(text)}
                        style={{ lineHeight: 20, marginBottom: 10, ...Fonts.primary, flex: 1 }}>{userText}
                    </TextInput>
                    <View style={{ flexDirection: 'row', height: 22}}>
                        <TouchableOpacity style={{ width: 22, height: 22, marginRight: 12 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.read} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 22, height: 22 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.list} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{ width: 22, height: 22 }} onPress={togglePeek}>
                            <Image style={{ tintColor: Colors.black, height: '100%', width: '100%' }} resizeMode="contain" source={Images.settings} />
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

export default MemoryScreen;
