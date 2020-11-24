// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import * as Assets from "../../Assets";
import { TextInput } from "react-native-gesture-handler";
// import ImagePicker, { ImagePickerResponse } from "react-native-image-picker";

interface IContactInfoScreenProps {
  navigateToSendRequireSuccess: () => void;
}

interface IContactInfoScreenState {
  pictures: string[];
}

export class ContactInfoScreen extends React.Component<IContactInfoScreenProps, IContactInfoScreenState> {
  public static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    headerStyle: {
      borderBottomWidth: 0
    },
    title: "THÔNG TIN LIÊN HỆ",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  public constructor(props: IContactInfoScreenProps) {
    super(props);
    this.state = {
      pictures: []
    };
  }

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
            <Text style={styles.title}>Chúng tôi có thể giúp gì bạn</Text>
            {this._renderSelect()}
            {this._renderInput()}
            {this._renderUpImage()}
            {this._renderInfo()}
          </ScrollView>
          {this._renderButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderSelect() {
    return (
      <TouchableOpacity style={styles.selectContainer}>
        <Text style={styles.problem}>Vấn đề của tôi là</Text>
        <Image style={styles.icon} source={Assets.Icons.ArrowDropDown} />
      </TouchableOpacity>
    );
  }

  private _renderInput() {
    return (
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Giới hạn 200 ký tự" multiline />
      </View>
    );
  }

  private _renderUpImage() {
    return (
      <View style={styles.upImageContainer}>
        <Text style={styles.titleUpImage}>Ảnh đính kèm</Text>
        <ScrollView style={{ flex: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {this._renderImagePicker()}
            {this.state.pictures.map((item, index) => {
              if (!item) {
                return this._renderThumbImage(index);
              }

              return this._renderPicture(item, index);
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  private _renderImagePicker(): JSX.Element {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={{ paddingRight: 20 }}
          // onPress={this._launchSystemImagePicker.bind(this)}
        >
          <Image source={Assets.Icons.ContainerCamera} style={styles.containerCamera} />
        </TouchableOpacity>
      </View>
    );
  }

  private _renderThumbImage(index: number): JSX.Element {
    return (
      <View key={index} style={styles.row}>
        <View
          style={{ paddingRight: 20 }}
          // onPress={this._launchSystemImagePicker.bind(this)}
        >
          <Image source={Assets.Icons.DashContainer} style={styles.containerCamera} />
        </View>
      </View>
    );
  }

  private _renderPicture(pictureUri: string | null, index: number) {
    pictureUri = pictureUri as string;

    return <Image key={index} source={{ uri: pictureUri }} style={styles.imageContainer} resizeMode={"cover"} />;
  }

  private _renderInfo() {
    return (
      <Text style={styles.info}>
        {`Công ty TNHH Sneal Geek Việt Nam\nSneak Geek Vietnam Company Ltd.\nEmail: help@sneakgeek.vn`}
      </Text>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={this.props.navigateToSendRequireSuccess}>
        <Text style={styles.titleButton}>Xác nhận</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    fontSize: 22,
    lineHeight: 26,
    fontFamily: "RobotoCondensed-Bold",
    paddingHorizontal: 20
  },
  selectContainer: {
    marginHorizontal: 20,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  problem: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    fontStyle: "italic"
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    right: 10,
    position: "absolute"
  },
  inputContainer: {
    height: 132,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
    fontSize: 17,
    lineHeight: 24,
    fontFamily: "RobotoCondensed-Regular"
  },
  info: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    paddingTop: 60
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
  },
  titleUpImage: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 13,
    paddingBottom: 10
  },
  upImageContainer: {
    paddingHorizontal: 20,
    paddingTop: 38
  },
  imageContainer: {
    width: 93,
    aspectRatio: 1,
    marginRight: 12
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  containerCamera: {
    width: 93,
    height: 93,
    resizeMode: "contain"
  }
});
