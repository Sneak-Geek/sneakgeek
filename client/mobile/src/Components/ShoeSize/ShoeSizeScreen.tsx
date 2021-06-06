import * as React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  FlexAlignType
} from "react-native";
import { Icon } from "react-native-elements";
import { StackActions, NavigationScreenProps } from "react-navigation";
import * as Assets from "../../Assets";

interface IShoeSizeScreenState {
  gender: "string";
}
export class ShoeSizeScreen extends React.Component<IShoeSizeScreenState> {
  state = {
    gender: "male"
  };

  data = [
    {
      country: "US",
      size: [
        "6",
        "6.5",
        "7",
        "7.5",
        "8",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12",
        "13",
        "14",
        "15",
        "16"
      ]
    },
    {
      country: "EU",
      size: [
        "39",
        "39 - 40",
        "40",
        "40 - 41",
        "41",
        "41 - 42",
        "42",
        "42 - 43",
        "43",
        "43 - 44",
        "44",
        "44 - 45",
        "45",
        "46",
        "47",
        "48",
        "49"
      ]
    },
    {
      country: "UK",
      size: [
        "5.5",
        "6",
        "6.5",
        "7",
        "7.5",
        "8",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12.5",
        "13.5",
        "14.5",
        "15.5"
      ]
    }
  ];

  dataFemale = [
    {
      country: "US",
      size: [
        "4",
        "4.5",
        "5",
        "5.5",
        "6",
        "6.5",
        "7",
        "7.5",
        "8",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12"
      ]
    },
    {
      country: "EU",
      size: [
        "34 - 35",
        "35",
        "35 - 36",
        "36",
        "36 - 37",
        "37",
        "37 - 38",
        "38",
        "38 - 39",
        "39",
        "39 - 40",
        "40",
        "40 - 41",
        "41",
        "41 - 42",
        "42",
        "42 - 43"
      ]
    },
    {
      country: "UK",
      size: [
        "2",
        "2.5",
        "3",
        "3.5",
        "4",
        "4.5",
        "5",
        "5.5",
        "6",
        "6.5",
        "7",
        "7.5",
        "8",
        "8.5",
        "9",
        "9.5",
        "10"
      ]
    }
  ];
  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    headerStyle: {
      borderBottomWidth: 0
    },
    title: "TIÊU CHUẨN SIZE",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    ),
    headerRight: (
      <Icon
        type={"ionicon"}
        name={"ios-share"}
        size={28}
        containerStyle={{ marginRight: 10 }}
      />
    )
  });

  public render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "white"
        }}
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={{ flex: 1, marginBottom: 20 }}>
              {this.renderStandard()}
              {this.renderGender()}
              {this.renderSize()}
            </View>
          </ScrollView>
          {this.renderButton()}
        </View>
      </SafeAreaView>
    );
  }

  private renderStandard() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.title}>TIÊU CHUẨN</Text>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={styles.country}>US</Text>
        </View>
      </View>
    );
  }

  private renderGender() {
    let { gender } = this.state;
    return (
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderTouch,
            { marginRight: 37, borderBottomColor: gender === "male" ? "black" : "white" }
          ]}
          onPress={() => this.setState({ gender: "male" })}
        >
          <Text style={[styles.gender, { opacity: gender === "male" ? 1 : 0.3 }]}>NAM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderTouch,
            { borderBottomColor: gender === "female" ? "black" : "white" }
          ]}
          onPress={() => this.setState({ gender: "female" })}
        >
          <Text style={[styles.gender, { opacity: gender === "female" ? 1 : 0.3 }]}>
            NỮ
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  private renderSize() {
    return (
      <View style={styles.sizeContainer}>
        {this.state.gender === "male"
          ? this.data.map((itemC, indexC) => {
              let alignItems: FlexAlignType;
              switch (indexC) {
                case 0:
                  alignItems = "flex-start";
                  break;
                case this.data.length - 1:
                  alignItems = "flex-end";
                  break;
                default:
                  alignItems = "center";
                  break;
              }

              return (
                <View style={{ flex: 1, alignItems: alignItems }} key={indexC}>
                  <View>
                    <Text style={styles.sizeTitle}>SIZE {itemC.country}</Text>
                    <View>
                      {itemC.size.map((itemR, indexR) => {
                        return (
                          <Text key={indexR} style={styles.size}>
                            {itemR}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })
          : this.dataFemale.map((itemC, indexC) => {
              let alignItems: FlexAlignType;
              switch (indexC) {
                case 0:
                  alignItems = "flex-start";
                  break;
                case this.data.length - 1:
                  alignItems = "flex-end";
                  break;
                default:
                  alignItems = "center";
                  break;
              }

              return (
                <View style={{ flex: 1, alignItems }} key={indexC}>
                  <View>
                    <Text style={styles.sizeTitle}>SIZE {itemC.country}</Text>
                    <View>
                      {itemC.size.map((itemR, indexR) => {
                        return (
                          <Text key={indexR} style={styles.size}>
                            {itemR}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}
      </View>
    );
  }
  private renderButton() {
    return (
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.titleButton}>Xác nhận</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 34
  },
  topContainer: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: Assets.Styles.ListItemBackgroundColor
  },
  title: {
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold",
    opacity: 0.6,
    paddingRight: 42
  },
  country: {
    color: Assets.Styles.AppPrimaryColor,
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular"
  },
  genderContainer: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 20
  },
  genderTouch: {
    borderBottomWidth: 2
  },
  gender: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold",
    lineHeight: 22
  },
  sizeContainer: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 20
  },
  sizeTitle: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: "RobotoCondensed-Bold"
  },
  size: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    lineHeight: 24,
    paddingTop: 10,
    textAlign: "right"
  },
  buttonContainer: {
    backgroundColor: "black",
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  titleButton: {
    fontSize: 20,
    fontFamily: "RobotoCondensed-Regular",
    color: "white"
  }
});
