import moment from 'moment';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Bible from '../managers/bible-manager';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';
import { loadVerseChunkData, verseChunkStringData, verseChunkTitle } from '../helpers/verse-helper';

const capsuleHeight = 18;
const MemoryPackItem = ({
    memoryPack,
    onPress,
}) => {
    let { verseChunks, nameWithCompletion } = memoryPack;
    let verseChunksList = Object.values(verseChunks);
    let isComplete = (memoryPack.completionDate != null);

    return <TouchableOpacity onPress={onPress}>
        <View style={{paddingVertical: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{ ...Fonts.alternate, ...Fonts.small }}>{nameWithCompletion}</Text>
                <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
                    <Text style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(memoryPack.completionDate).format('DD/MM/YY') : 'Incomplete'}</Text>
                    {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
                </View>
            </View>
            <View style={{marginTop: 4}}>
                {verseChunksList.map((verseChunk, i)=><View key={`${i}`} style={{marginTop: 8, paddingLeft: 14}}>
                    <Text style={{...Fonts.alternate, ...Fonts.small, color: Colors.gray}}>{i+1}. {verseChunk.toString()}</Text>
                    <Text style={{...Fonts.primary, ...Fonts.small}} numberOfLines={2}>{verseChunkStringData(verseChunk, Bible)}</Text>
                </View>)}
            </View>
        </View>
    </TouchableOpacity>
};

export default MemoryPackItem;


let object = {
    func() {
        console.log(this);
    },
    arrowfunc: ()=>{
        console.log(this);
    },
}

let { func } = object;
func(); //undefined
object.func(); //returns object
object.arrowfunc(); //undefined



