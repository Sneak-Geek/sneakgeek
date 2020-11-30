import React from 'react';

const ThemeContext = React.createContext({
  color: {
    backgroundColor: '#FFFFFF',
    brandColorPrimary: '#1E2330',
    brandColorSecondary: '#E2603F',
    textColorPrimary: '#000000',
    textColorSecondary: '#FFFFFF'
  },
  button: {
    regularHeight: 54,
    borderRadius: 40
  },
  text: {
    largeTitle: {
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 34,
    },

    title1: {
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 26,
    },

    title2: {
      fontSize: 22,
      fontFamily: 'RobotoCondensed-Bold',
    },

    title3: {
      fontSize: 20,
      fontFamily: 'RobotoCondensed-Bold',
    },

    headline: {
      fontSize: 17,
      fontFamily: 'RobotoCondensed-Bold',
    },

    subheadline: {
      fontSize: 14,
      fontFamily: 'RobotoCondensed-Bold',
      opacity: 0.6,
      textTransform: 'uppercase',
    },

    body: {
      fontSize: 17,
      fontFamily: 'RobotoCondensed-Regular',
    },

    largecallout: {
      fontSize: 28,
      fontFamily: 'RobotoCondensed-Regular',
    },

    callout: {
      fontSize: 16,
      fontFamily: 'RobotoCondensed-Regular',
    },

    subcallout: {
      fontSize: 14,
      fontFamily: 'RobotoCondensed-Regular',
    },

    subhead: {
      fontSize: 15,
      fontFamily: 'RobotoCondensed-Light',
    },

    footnote: {
      fontSize: 13,
      fontFamily: 'RobotoCondensed-Light',
    },

    footnoteRegular: {
      fontSize: 13,
      fontFamily: 'RobotoCondensed-Regular',
    },

    caption1: {
      fontSize: 12,
      fontFamily: 'RobotoCondensed-Light',
    },

    caption2: {
      fontSize: 11,
      fontFamily: 'RobotoCondensed-Light',
    },
  },
});

export default ThemeContext;
