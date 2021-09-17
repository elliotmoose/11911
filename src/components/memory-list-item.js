import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData, verseChunkStringData, verseChunkTitle } from '../helpers/verse-helper';

const capsuleHeight = 18;
const MemoryListItem = ({ verseChunk, onPress }) => {
    let isComplete = (verseChunk.completionDate != null);

    return <TouchableHighlight onPress={onPress}>
        <View style={{paddingVertical: 12, paddingHorizontal: 20, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{verseChunkTitle(verseChunk)}</Text>
                <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
                    <Text style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(verseChunk.completionDate).format('DD/MM/YY') : 'Incomplete'}</Text>
                    {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
                </View>
            </View>
            <Text style={{ ...Fonts.primary, height: 50, overflow: 'hidden', marginTop: 4, ...Fonts.small}} numberOfLines={2}>
                {verseChunkStringData(verseChunk, Bible)}
            </Text>
        </View>
    </TouchableHighlight>
};

export default MemoryListItem;
