import * as React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-navigation";
import { Input, Icon } from "react-native-elements";
import { container, Types } from "../../../Config/Inversify";
import { IAppSettingsService } from "../../../Service/AppSettingsService";
import { FaqItem } from "../../../Shared/UI";

interface ITabUserSearchProps {
  back: () => void;
}

interface ITabUserSearchState {
  modeRender: string;
  searchFocus: boolean;
  listCategory: any;
  listFAQ: any;
}
export class TabUserSearchScreen extends React.Component<
  ITabUserSearchProps,
  ITabUserSearchState
  > {
  static navigationOptions = {
    header: null
  };

  private appSettings: IAppSettingsService = container.get<IAppSettingsService>(
    Types.IAppSettingsService
  );
  private remoteSetting = this.appSettings.getSettings().RemoteSettings;


  constructor(props: ITabUserSearchProps) {
    super(props);

    this.state = {
      modeRender: "listHelper",
      searchFocus: false,
      listCategory: this.remoteSetting ? this.remoteSetting.faq : [],
      listFAQ: [],
    };
  }

  goBack = () => {
    switch (this.state.modeRender) {
      case "listHelper":
        this.props.back();
        break;
      case "listFAQ":
        this.setState({ modeRender: "listHelper" });
        break;
      default:
        break;
    }
  };

  toCategory = (item: any) => {
    this.setState({ modeRender: "listFAQ", listFAQ: item });
  }

  public render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.container}>
          {this.renderSearchBar()}
          {this.state.modeRender === "listHelper" && this.renderListHelp()}
          {this.state.modeRender === "listFAQ" && this.renderListFAQ()}
        </View>
      </SafeAreaView>
    );
  }

  private renderSearchBar() {
    return (
      <View style={styles.containerSearch}>
        <Icon
          type={"ionicon"}
          name={"ios-arrow-back"}
          size={28}
          containerStyle={{ marginLeft: 10 }}
          onPress={this.goBack}
        />
        <Input
          // ref={refInput => (this._searchInputComponent = refInput)}
          onFocus={_event => this.setState({ searchFocus: true })}
          placeholder={"Bạn muốn giúp gì"}
          leftIcon={
            <Icon
              type={"ionicon"}
              name={"md-search"}
              size={25}
              color="rgba(0, 0, 0, 0.54)"
            />
          }
          leftIconContainerStyle={{ marginRight: 20 }}
          // rightIcon={
          //     this.state.searchFocus && (
          //         <Icon
          //             type={"ionicon"}
          //             name={"md-close"}
          //             size={25}
          //             onPress={this._toggleSearchFocus.bind(this)}
          //         />
          //     )
          // }
          inputStyle={{ fontSize: 17, fontFamily: "RobotoCondensed-Regular" }}
        // onChangeText={this._search.bind(this)}
        // onSubmitEditing={this._onEndEditing.bind(this)}
        />
      </View>
    );
  }

  private renderListHelp() {
    return (
      <View>
        {this.state.listCategory.length > 0 && this.state.listCategory.map((item: any, index: number) => {
          return (
            <TouchableOpacity key={index} style={styles.item} onPress={() => this.toCategory(item)}>
              <Text style={styles.titleItem}>{item.category}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  }

  private renderListFAQ() {
    return (
      <View>
        <View style={[styles.item, { paddingBottom: 30 }]}>
          <Text style={styles.titleItem}>{this.state.listFAQ.category}</Text>
        </View>
        <ScrollView>
          <View style={{ paddingBottom: 200 }}>
            {this.state.listFAQ.info.map((item: any, index: number) => {
              return (
                // <TouchableOpacity key={index} style={styles.row} onPress={item.onPress}>
                //   <View style={{ flex: 1 }}>
                //     <Text style={styles.question}>Q: {item.question}</Text>
                //   </View>
                //   <Image source={Assets.Icons.ChevronLeft} />
                // </TouchableOpacity>
                <FaqItem
                  key={index}
                  data={item}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  containerSearch: {
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    paddingTop: 40,
    paddingHorizontal: 20
  },
  titleItem: {
    fontSize: 34,
    fontFamily: "RobotoCondensed-Bold",
    opacity: 0.3
  },
  question: {
    fontFamily: "RobotoCondensed-Bold",
    fontSize: 22
  },
  row: {
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14
  }
});
