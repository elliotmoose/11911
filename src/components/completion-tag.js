import React from 'react';
import moment from "moment";
import { Image, Text, View } from "react-native";
import Colors from "../constants/colors";
import Fonts from "../constants/fonts";
import Images from "../constants/images";

const capsuleHeight = 18;
export const CompletionTag = ({completionDate}) => {
    let isComplete = (completionDate != null);

    return <View style={{height: capsuleHeight, borderRadius: capsuleHeight/2, borderWidth: 1.2, borderColor: isComplete ? Colors.darkgreen : Colors.gray, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexDirection: 'row'}}>
        <Text allowFontScaling={false} style={{ ...Fonts.alternate, ...Fonts.verysmall, color: isComplete ? Colors.darkgreen : Colors.gray}}>{isComplete ? moment(completionDate).format('DD/MM/YY') : 'Incomplete'}</Text>
        {isComplete && <Image source={Images.tick} style={{tintColor: Colors.darkgreen, resizeMode: 'contain', height: capsuleHeight/2, width: capsuleHeight/2, marginLeft: 4}}/>}
    </View>
};