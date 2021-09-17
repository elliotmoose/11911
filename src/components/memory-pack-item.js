import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData, verseChunkStringData, verseChunkTitle } from '../helpers/verse-helper';
import { sortedVerseChunkListByCreateDate } from '../redux/verse-chunk/verse-chunk-selectors';

const capsuleHeight = 18;
const MemoryPackItem = ({
    memoryPack,
    onPress,
}) => {
    let { verseChunks } = memoryPack;
    let verseChunksList = sortedVerseChunkListByCreateDate(Object.values(verseChunks));
    let isComplete = (memoryPack.getCompletionDate() != null);

    return <TouchableHighlight onPress={onPress}>
        <View style={{paddingVertical: 12, paddingHorizontal: 20, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{memoryPack.getNameWithCompletion()}</Text>
                <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
                    <Text style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(memoryPack.getCompletionDate()).format('DD/MM/YY') : 'Incomplete'}</Text>
                    {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
                </View>
            </View>
            <View style={{marginTop: 4}}>
                {verseChunksList.map((verseChunk, i)=><View key={`${i}`} style={{marginTop: 8, paddingLeft: 14}}>
                    <Text style={{...Fonts.alternate, ...Fonts.small, color: verseChunk.completionDate ? Colors.darkgreen : Colors.gray}}>{i+1}. {verseChunk.toString()}</Text>
                    <Text style={{...Fonts.primary, ...Fonts.small}} numberOfLines={2}>{verseChunkStringData(verseChunk, Bible)}</Text>
                </View>)}
            </View>
        </View>
    </TouchableHighlight>
};

export default MemoryPackItem;




