import * as React from "react";
import { View, StyleSheet, SafeAreaView, Image, Text, ScrollView } from "react-native";
import { StackActions, NavigationScreenProps } from "react-navigation";
import { Icon } from "react-native-elements";
import * as Assets from "../../Assets";
import Dash from "react-native-dash";

interface ITrackingSellScreenState {
  step: number;
}

export class TrackingSellScreen extends React.Component<{}, ITrackingSellScreenState> {
  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Bán sản phẩm",
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

  public constructor(props: any) {
    super(props);
    this.state = {
      step: 1
    };
  }

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView>
            {this.renderShoe()}
            {this.renderInfo()}
            {this.renderStep()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  private renderShoe() {
    return (
      <View style={styles.topContentContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.image}
            source={{
              uri:
                "https://images.timberland.com/is/image/timberland/A228P001-HERO?$PDP-FULL-IMAGE$"
            }}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            PHARELL X BILLIONAIRE BOYS CLUB X NMD HUMAN RACE TRAIL BLUEE PLAID
          </Text>
          <Text style={[styles.title, { fontSize: 16 }]}>SKU: EF3326</Text>
        </View>
      </View>
    );
  }

  private renderInfo() {
    return (
      <View style={styles.middleContainer}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Mã đơn hàng</Text>
          <Text style={styles.descrip}>4Z7L89KJ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Ngày hoàn tất giao dịch dự kiến:</Text>
          <Text style={styles.descrip}>24/07/2019</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Địa chỉ</Text>
          <Text style={styles.descrip}>275 Nguyễn Trãi, Thanh xuân, Hà Nội</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Người nhận</Text>
          <Text style={styles.descrip}>Nguyễn Danh Trung</Text>
        </View>
      </View>
    );
  }

  private renderStep() {
    const { step } = this.state;

    return (
      <View style={styles.stepContainer}>
        <View style={{ flexDirection: "row", paddingLeft: step === 1 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 1 ? 13 : 22 }}>
            {step === 1 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : (
              <View style={styles.circle} />
            )}
            {step > 1 ? (
              <View style={styles.line} />
            ) : (
              <View style={{ marginVertical: 10 }}>
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor={Assets.Styles.AppPrimaryColor}
                />
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor="#C4C4C4"
                />
              </View>
            )}
          </View>
          <View>
            <Text style={styles.step}>Xác nhận giá</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingLeft: step === 2 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 2 ? 13 : 22 }}>
            {step === 2 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : step > 2 ? (
              <View style={styles.circle} />
            ) : (
              <View style={styles.circleBorder} />
            )}
            {step < 2 && (
              <Dash
                dashGap={3}
                dashLength={8}
                dashThickness={2}
                style={[styles.dash, { marginVertical: 10 }]}
                dashColor="#C4C4C4"
              />
            )}
            {step === 2 && (
              <View style={{ marginVertical: 10 }}>
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor={Assets.Styles.AppPrimaryColor}
                />
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor="#C4C4C4"
                />
              </View>
            )}
            {step > 2 && <View style={styles.line} />}
          </View>
          <View>
            <Text style={styles.step}>Gửi đi xác thực</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingLeft: step === 3 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 3 ? 13 : 22 }}>
            {step === 3 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : step > 3 ? (
              <View style={styles.circle} />
            ) : (
              <View style={styles.circleBorder} />
            )}
            {step < 3 && (
              <Dash
                dashGap={3}
                dashLength={8}
                dashThickness={2}
                style={[styles.dash, { marginVertical: 10 }]}
                dashColor="#C4C4C4"
              />
            )}
            {step === 3 && (
              <View style={{ marginVertical: 10 }}>
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor={Assets.Styles.AppPrimaryColor}
                />
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor="#C4C4C4"
                />
              </View>
            )}
            {step > 3 && <View style={styles.line} />}
          </View>
          <View>
            <Text style={styles.step}>Đang xác thực</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingLeft: step === 4 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 4 ? 13 : 22 }}>
            {step === 4 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : step > 4 ? (
              <View style={styles.circle} />
            ) : (
              <View style={styles.circleBorder} />
            )}
            {step < 4 && (
              <Dash
                dashGap={3}
                dashLength={8}
                dashThickness={2}
                style={[styles.dash, { marginVertical: 10 }]}
                dashColor="#C4C4C4"
              />
            )}
            {step === 4 && (
              <View style={{ marginVertical: 10 }}>
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor={Assets.Styles.AppPrimaryColor}
                />
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor="#C4C4C4"
                />
              </View>
            )}
            {step > 4 && <View style={styles.line} />}
          </View>
          <View>
            <Text style={styles.step}>Đã xác thực</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingLeft: step === 5 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 5 ? 13 : 22 }}>
            {step === 5 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : step > 5 ? (
              <View style={styles.circle} />
            ) : (
              <View style={styles.circleBorder} />
            )}
            {step < 5 && (
              <Dash
                dashGap={3}
                dashLength={8}
                dashThickness={2}
                style={[styles.dash, { marginVertical: 10 }]}
                dashColor="#C4C4C4"
              />
            )}
            {step === 5 && (
              <View style={{ marginVertical: 10 }}>
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor={Assets.Styles.AppPrimaryColor}
                />
                <Dash
                  dashGap={3}
                  dashLength={8}
                  dashThickness={2}
                  style={[styles.dash, { height: 25 }]}
                  dashColor="#C4C4C4"
                />
              </View>
            )}
            {step > 5 && <View style={styles.line} />}
          </View>
          <View>
            <Text style={styles.step}>Đang gửi tới người mua</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingLeft: step === 6 ? 31 : 40 }}>
          <View style={{ alignItems: "center", marginRight: step === 6 ? 13 : 22 }}>
            {step === 6 ? (
              <View style={styles.selectedCircle}>
                <View style={styles.insideCircle} />
              </View>
            ) : step > 6 ? (
              <View style={styles.circle} />
            ) : (
              <View style={styles.circleBorder} />
            )}
          </View>
          <View>
            <Text style={styles.step}>Hoàn tất đơn hàng</Text>
            <Text style={styles.date}>13/07/2019</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  contentContainer: {
    flex: 1
  },
  topContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 14,
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  imgContainer: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 78,
    height: 78,
    resizeMode: "cover"
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 17,
    paddingBottom: 7
  },
  title: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 14,
    paddingTop: 20
  },
  middleContainer: {
    paddingLeft: 31,
    paddingRight: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20
  },
  subTitle: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 12,
    opacity: 0.6
  },
  descrip: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 14
  },
  stepContainer: {
    paddingTop: 20
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Assets.Styles.AppPrimaryColor
  },
  selectedCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Assets.Styles.AppPrimaryColor,
    alignItems: "center",
    justifyContent: "center"
  },
  insideCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Assets.Styles.AppPrimaryColor
  },
  line: {
    width: 2,
    height: 50,
    backgroundColor: Assets.Styles.AppPrimaryColor,
    marginVertical: 10
  },
  dash: {
    height: 50,
    width: 2,
    flexDirection: "column"
  },
  step: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 16
  },
  date: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 12,
    color: "#C4C4C4",
    paddingTop: 8
  },
  circleBorder: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#979797"
  }
});
