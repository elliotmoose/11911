import React from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import Fonts from '../constants/fonts';

export default class LabeledTextInput extends React.Component {
    clear() {
        this.textInput.clear();
    }
    
    focus() {
        this.textInput.focus();
    }

    blur() {
        this.textInput.blur();
    }

    render()
    {
        let {style, placeholder, outlineColor, onChangeText, autoFocus, keyboardType, returnKeyType, textAlign='center', onSubmitEditing, autoCapitalize="none", ...otherProps} = this.props;
        return (<View style={{...style}} {...otherProps}>
            <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
            <TextInput autoCapitalize={autoCapitalize} ref={(ref)=>this.textInput=ref} keyboardType={keyboardType} returnKeyType={returnKeyType} onSubmitEditing={onSubmitEditing} style={{...styles.textInput, borderColor: outlineColor, textAlign}} autoFocus={autoFocus} onChangeText={onChangeText} />
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