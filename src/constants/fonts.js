const Fonts = {
    primary : {
        fontFamily: 'Sahitya', 
        fontSize: 16,
    },
    h1 : {
        fontFamily: 'Sahitya', 
        fontSize: 25,
    },
    h2 : {
        fontFamily: 'Sahitya', 
        fontSize: 21,
    },
    h3 : {
        fontFamily: 'Sahitya', 
        fontSize: 15,
    },
    alternate: {
        fontFamily: 'montserrat',
        fontSize: 16,
    },
    verysmall : {
        fontSize: 10,
    },
    small : {
        fontSize: 13,
    },
    medium : {
        fontSize: 16,
    },
    large : {
        fontSize: 19,
    },
    scaled(scale, style) {
        return {...style, fontSize: style.fontSize * scale};
    }
}
export default Fonts;