import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData, verseChunkStringData, verseChunkTitle } from '../helpers/verse-helper';
import { CompletionTag } from './completion-tag';

const MemoryListItem = ({ verseChunk, onPress }) => {
    return <TouchableHighlight onPress={onPress}>
        <View style={{paddingVertical: 12, paddingHorizontal: 20, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{verseChunkTitle(verseChunk)}</Text>
                <CompletionTag completionDate={verseChunk.completionDate}/>
            </View>
            <Text style={{ ...Fonts.primary, height: 50, overflow: 'hidden', marginTop: 4, ...Fonts.small}} numberOfLines={2}>
                {verseChunkStringData(verseChunk, Bible)}
            </Text>
        </View>
    </TouchableHighlight>
};

export default MemoryListItem;
