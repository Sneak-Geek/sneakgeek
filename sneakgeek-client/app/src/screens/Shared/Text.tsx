//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from 'react';
import {Text, TextProps} from 'react-native';
import {themes} from 'resources';

class LargeTitle extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.largeTitle, this.props.style]}
      />
    );
  }
}

class Title1 extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.largeTitle, this.props.style]}
      />
    );
  }
}

class Title2 extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.title2, this.props.style]}
      />
    );
  }
}

class Title3 extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.title3, this.props.style]}
      />
    );
  }
}

class Headline extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.headline, this.props.style]}
      />
    );
  }
}

class SubHeadline extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.subheadline, this.props.style]}
      />
    );
  }
}

class Callout extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.callout, this.props.style]}
      />
    );
  }
}

class SubCallout extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.subcallout, this.props.style]}
      />
    );
  }
}

class LargeCallout extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.largecallout, this.props.style]}
      />
    );
  }
}

class Subhead extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.subhead, this.props.style]}
      />
    );
  }
}

class Body extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text {...this.props} style={[themes.TextStyle.body, this.props.style]} />
    );
  }
}

class Footnote extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.footnote, this.props.style]}
      />
    );
  }
}

class FootnoteRegular extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.footnoteRegular, this.props.style]}
      />
    );
  }
}

class Caption1 extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.caption1, this.props.style]}
      />
    );
  }
}

class Caption2 extends React.PureComponent<TextProps> {
  public render(): JSX.Element {
    return (
      <Text
        {...this.props}
        style={[themes.TextStyle.caption2, this.props.style]}
      />
    );
  }
}

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
