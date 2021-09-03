import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function IconButton({ icon, size, textStyle, iconStyle, textValue, tintColor, iconPosition='start', children, ...props}) {
    return (<TouchableOpacity {...props}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {iconPosition == 'end' && children}
            {icon && <Image source={icon} style={{ height: size, width: size, tintColor, ...iconStyle }} resizeMode='contain' />}
            {iconPosition == 'start' && children}
        </View>
    </TouchableOpacity>);
}