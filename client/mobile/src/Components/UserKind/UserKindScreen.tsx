import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// @ts-ignore
import SmoothPicker from "react-native-smooth-picker";
import * as Assets from "../../Assets";
import { Icon } from "react-native-elements";
import { ScreenProps, StackActions } from "react-navigation";
import { Text } from "../../Shared/UI";
import { TextStyle } from "../../Shared/UI/Text";

interface IUserKindScreenProps {
  navigateToHome: () => void;
}

// TODO: Fix all ts-ignore

interface IUserKindScreenState {
  selectedGender: { id: number; title: string };
  selectedBrand: { id: number; title: string };
  selectedCountry: { id: number; title: string };
  selectedSize: { id: number; title: string };
}
export class UserKindScreen extends React.Component<IUserKindScreenProps, IUserKindScreenState> {
  public static navigationOptions = (navigationConfig: ScreenProps) => ({
    title: "Tuỳ chỉnh",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => navigationConfig.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    ),
    headerTitleStyle: TextStyle.title2
  });

  private gender = ["NAM", "NỮ", "TRẺ EM"];
  private brand = ["nike", "adidas", "puma", "onisugatiger"];
  private country = ["US", "UK", "EU"];
  private size = [
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    `9.5`,
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "13",
    "14",
    "15",
    "16"
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      selectedGender: { id: 0, title: "" },
      selectedBrand: { id: 0, title: "" },
      selectedCountry: { id: 0, title: "" },
      selectedSize: { id: 0, title: "" }
    };
  }

  public render() {
    const { selectedGender, selectedBrand, selectedCountry, selectedSize } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, marginBottom: 15 }}>
          <ScrollView>
            {this._renderPicker(this.gender, "GIỚI TÍNH", selectedGender)}
            {this._renderPicker(this.brand, "THƯƠNG HIỆU", selectedBrand)}
            {this._renderPicker(this.country, "TIÊU CHUẨN SIZE", selectedCountry)}
            {this._renderPicker(this.size, "CỠ GIÀY", selectedSize)}
          </ScrollView>
        </View>
        {this._renderButton()}
      </SafeAreaView>
    );
  }

  private handleChange(index: any, item: any, title: any) {
    const newObj = { id: index, title: item };
    switch (title) {
      case "GIỚI TÍNH":
        this.setState({ selectedGender: newObj });
        break;
      case "THƯƠNG HIỆU":
        this.setState({ selectedBrand: newObj });
        break;
      case "TIÊU CHUẨN SIZE":
        this.setState({ selectedCountry: newObj });
        break;
      case "CỠ GIÀY":
        this.setState({ selectedSize: newObj });
        break;
      default:
        break;
    }
  }

  private _renderPicker(data: any, title: string, selectedType: { id: number; title: string }) {
    return (
      <View style={{ paddingTop: 14 }}>
        <Text.Subhead style={{ margin: 15 }}>{title}</Text.Subhead>
        <View style={{ height: 80, backgroundColor: "#EEEEEE" }}>
          <SmoothPicker
            showsHorizontalScrollIndicator={false}
            style={{ height: 50 }}
            horizontal={true}
            magnet={true}
            offsetSelection={0}
            scrollAnimation={true}
            data={data}
            startMargin={Assets.Device.WIDTH / 2}
            // @ts-ignore
            onSelected={({ item, index }) => {
              return this.handleChange(index, item, title);
            }}
            // @ts-ignore
            renderItem={({ item, index }) => (
              <View style={styles.containerItem}>
                <Text.Body style={[{ opacity: selectedType.id === index ? 1 : 0.3 }]}>{item}</Text.Body>
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, { backgroundColor: "black" }]}
        onPress={this.props.navigateToHome}
      >
        <Text.Body style={[styles.titleButton, { color: "white" }]}>Xác nhận</Text.Body>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontFamily: "RobotoCondensed-Bold",
    paddingLeft: 20,
    paddingBottom: 30
  },
  subTitle: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 14,
    paddingBottom: 9,
    paddingLeft: 20,
    opacity: 0.6
  },
  containerItem: {
    height: 80,
    width: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainer: {
    height: 56,
    paddingHorizontal: 57,
    justifyContent: "center",
    alignItems: "center"
  },
  titleButton: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 18
  }
});
