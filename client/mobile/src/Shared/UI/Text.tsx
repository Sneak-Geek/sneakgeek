//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

export class LargeTitle extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.largeTitle, this.props.style]} />;
  }
}

export class Title1 extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.largeTitle, this.props.style]} />;
  }
}

export class Title2 extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.title2, this.props.style]} />;
  }
}

export class Title3 extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.title3, this.props.style]} />;
  }
}

export class Headline extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.headline, this.props.style]} />;
  }
}

export class Callout extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.callout, this.props.style]} />;
  }
}

export class Subhead extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.subhead, this.props.style]} />;
  }
}

export class Body extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.body, this.props.style]} />;
  }
}

export class Footnote extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.footnote, this.props.style]} />;
  }
}

export class Caption1 extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.caption1, this.props.style]} />;
  }
}

export class Caption2 extends React.PureComponent<TextProps> {
  public /** override */ render(): JSX.Element {
    return <Text {...this.props} style={[TextStyle.caption2, this.props.style]} />;
  }
}

export const TextStyle = StyleSheet.create({
  largeTitle: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 34
  },

  title1: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 28
  },

  title2: {
    fontSize: 22,
    fontFamily: "RobotoCondensed-Bold"
  },

  title3: {
    fontSize: 20,
    fontFamily: "RobotoCondensed-Bold"
  },

  headline: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold"
  },

  body: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular"
  },

  callout: {
    fontSize: 16,
    fontFamily: "RobotoCondensed-Regular"
  },

  subhead: {
    fontSize: 15,
    fontFamily: "RobotoCondensed-Light"
  },

  footnote: {
    fontSize: 13,
    fontFamily: "RobotoCondensed-Light"
  },

  caption1: {
    fontSize: 12,
    fontFamily: "RobotoCondensed-Light"
  },

  caption2: {
    fontSize: 11,
    fontFamily: "RobotoCondensed-Light"
  }
});
