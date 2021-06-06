//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Assets from "../../Assets";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "./";

interface Props {
  data: {
    question?: string;
    answer?: string;
  }
}

interface State {
  showAnswer: boolean,
}
export class FaqItem extends React.Component<Props, State> {

  constructor(props: any) {
    super(props)
    this.state = {
      showAnswer: false,
    }
  }

  private _onFaqItemPress() {
    this.setState({ showAnswer: !this.state.showAnswer })
  }
  render() {
    let { data } = this.props;
    let { showAnswer } = this.state;
    return (
      <View>
        <TouchableOpacity style={[styles.row, { paddingBottom: showAnswer ? 9 : 30 }]} onPress={this._onFaqItemPress.bind(this)}>
          <View style={{ flex: 1, paddingRight: 14, paddingLeft: 20 }}>
            <Text.Title2>Q: {data.question}</Text.Title2>
          </View>
          {Boolean(showAnswer) ?
            <Image source={Assets.Icons.ChevronDown} />
            :
            <Image source={Assets.Icons.ChevronLeft} />
          }
        </TouchableOpacity>
        {Boolean(showAnswer) &&
          <View style={styles.answerContainer}>
            <Text.Body>
              {data.answer}
            </Text.Body>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {

    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14
  },
  answerContainer: {
    backgroundColor: '#E9E9E9',
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginBottom: 33,
    flex: 1,
  },
});
