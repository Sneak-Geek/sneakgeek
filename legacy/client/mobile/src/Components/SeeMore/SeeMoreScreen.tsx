import * as React from "react";
import { Shoe } from "../../Shared/Model";
import { NavigationRoute, NavigationScreenProp, NavigationScreenProps, StackActions } from "react-navigation";
import { Icon } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { ShoeCard } from "../../Shared/UI";
import { TextStyle } from "../../Shared/UI/Text";
import { StatusBar, View } from "react-native";
import { RouteNames } from "../../Navigation";

interface ISeeMoreScreenProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  //   navigateToShoeDetail: (shoe: Shoe) => void;
}

export class SeeMoreScreen extends React.Component<ISeeMoreScreenProps> {
  public static navigationOptions = (navigationConfig: NavigationScreenProps) => ({
    title: navigationConfig.navigation.getParam("title") + " nổi bật",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => navigationConfig.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    ),
    headerTitleStyle: TextStyle.title3
  });

  private shoes: Shoe[];

  public constructor(props: any) {
    super(props);
    this.shoes = this.props.navigation.getParam("shoes");
  }

  public render(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={"dark-content"} />
        <FlatList
          data={this.shoes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ShoeCard
              shoe={item}
              onPress={() =>
                this.props.navigation.navigate({
                  routeName: RouteNames.ShoeDetail,
                  params: { shoe: item }
                })
              }
            />
          )}
          numColumns={2}
          style={{ marginTop: 10, marginBottom: 15 }}
        />
      </View>
    );
  }
}
