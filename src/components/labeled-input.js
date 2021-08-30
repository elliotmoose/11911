import React from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import Fonts from '../constants/fonts';

export default class LabeledTextInput extends React.Component {
    clear() {
        this.textInput.clear();
    }
    
    render()
    {
        let {style, placeholder, outlineColor, onChangeText, autoFocus, textAlign='center', ...otherProps} = this.props;
        return (<View style={{...style}} {...otherProps}>
            <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
            <TextInput ref={(ref)=>this.textInput=ref} style={{...styles.textInput, borderColor: outlineColor, textAlign}} autoFocus={autoFocus} onChangeText={onChangeText} />
        </View>);
    }
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        ...Fonts.primary,
        ...Fonts.small,
    },
});