import * as React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import * as Assets from "../../Assets";
import {
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";

export interface IRequireSuccessScreenProps {
  navigateToHome: () => void;
  navigation?: NavigationScreenProp<NavigationRoute>;

}

export interface IRequireSuccessScreenState {
  title: string;
}
export class RequireSuccessScreen extends React.Component<IRequireSuccessScreenProps, IRequireSuccessScreenState> {
  static navigationOptions = {
    header: null
  };

  public constructor(props: IRequireSuccessScreenProps) {
    super(props);
    this.state = {
      title: this.props.navigation ? this.props.navigation.getParam("shoeName") : "",
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
          <Text style={styles.label}>Yêu cầu sản phẩm</Text>
          <View style={styles.contentContainer}>
            <Image style={styles.logo} source={Assets.Icons.SuccessLogo} />
            <Text style={styles.title}>Yêu cầu thành công sản phẩm</Text>
            <Text style={styles.name}>{this.state.title}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.navigateToHome}
        >
          <Text style={styles.titleButton}>TIẾP TỤC MUA SẮM</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  label: {
    alignSelf: "center",
    fontSize: 24,
    fontFamily: "RobotoCondensed-Regular",
    color: "black",
    paddingTop: 16
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 154,
    height: 154,
    resizeMode: "contain",
    marginBottom: 82
  },
  title: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 17,
    paddingBottom: 6,
    textAlign: "center"
  },
  name: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center"
  },
  buttonContainer: {
    backgroundColor: "black",
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  titleButton: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold",
    color: "white"
  }
});
