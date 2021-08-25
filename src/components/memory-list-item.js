import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData, verseChunkTitle } from '../managers/test-manager';

const capsuleHeight = 18;
const MemoryListItem = ({
    verseChunk,
    onPress,
}) => {
    let verses = loadVerseChunkData(verseChunk, Bible);
    let isComplete = (verseChunk.completionDate != null);

    return <TouchableOpacity onPress={onPress}>
        <View style={{paddingVertical: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{verseChunkTitle(verseChunk)}</Text>
                <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
                    <Text style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(verseChunk.completionDate).format('DD/MM/YY') : 'Incomplete'}</Text>
                    {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
                </View>
            </View>
            <Text style={{ ...Fonts.primary, height: 50, overflow: 'hidden', marginTop: 8, ...Fonts.small}} numberOfLines={2}>
                {verses.map((verse, i)=><Text key={`${i}`}>
                    <Text style={{...Fonts.h3}}>{verse.verseNum} </Text>
                    <Text>{verse.text}</Text>
                </Text>)}
            </Text>
        </View>
    </TouchableOpacity>
};

export default MemoryListItem;
