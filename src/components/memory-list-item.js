import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Bible from '../bible-manager';
import Colors from '../colors';
import Fonts from '../fonts';
import Images from '../images';
import { loadSegmentData } from '../test-manager';

const capsuleHeight = 18;
const MemoryListItem = ({
    segment,
    onPress,
}) => {
    let verses = loadSegmentData(segment, Bible);
    let isComplete = (segment.completionDate != null);

    return <TouchableOpacity onPress={onPress}>
        <View style={{paddingVertical: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{segment.toString()}</Text>
                <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
                    <Text style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(segment.completionDate).format('DD/MM/YY') : 'Incomplete'}</Text>
                    {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
                </View>
            </View>
            <Text style={{ ...Fonts.primary, height: 50, overflow: 'hidden', marginTop: 8, ...Fonts.small}} numberOfLines={2}>
                {verses.map((verse)=><Text>{verse.verseNum} {verse.text}</Text>)}
            </Text>
        </View>
    </TouchableOpacity>
};

export default MemoryListItem;
