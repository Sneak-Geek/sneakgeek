//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React, {PropsWithChildren} from 'react';
import {Text, TextProps} from 'react-native';
import ThemeContext from '../../Context/ThemeContext';

type AppTextProps = PropsWithChildren<TextProps>;

const CustomText = (props: AppTextProps & {keySelector: string}) => (
  <ThemeContext.Consumer>
    {(theme) => (
      // @ts-ignore
      <Text {...props} style={[theme.text[props.keySelector], props.style]} />
    )}
  </ThemeContext.Consumer>
);

const LargeTitle = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'largeTitle'} />
);

const Title1 = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'title1'} />
);

const Title2 = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'title2'} />
);

const Title3 = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'title3'} />
);

const Headline = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'headline'} />
);

const SubHeadline = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'subheadline'} />
);

const Subhead = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'subhead'} />
);

const Callout = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'callout'} />
);

const SubCallout = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'subcallout'} />
);

const LargeCallout = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'largecallout'} />
);

const Body = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'body'} />
);

const Footnote = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'footnote'} />
);

const FootnoteRegular = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'footnoteRegular'} />
);

const Caption1 = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'caption1'} />
);

const Caption2 = (props: AppTextProps) => (
  <CustomText {...props} keySelector={'caption2'} />
);

export const AppText = {
  LargeTitle,
  Title1,
  Title2,
  Title3,
  Headline,
  SubHeadline,
  Body,
  Footnote,
  FootnoteRegular,
  Caption1,
  Caption2,
  Callout,
  SubCallout,
  LargeCallout,
  Subhead,
};
