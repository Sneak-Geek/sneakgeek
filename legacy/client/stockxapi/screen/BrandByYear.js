import React from "react";
import { SafeAreaView, Dimensions, View, Alert, Text } from "react-native";
import ShoePage from "./ShoePage";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import { ButtonGroup } from "react-native-elements";
import BrandByYearGender from "./BrandByYearGender";

export default class BrandByYear extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const brand = navigation.getParam("brand");
    const year = navigation.getParam("year");

    return {
      headerTitle: `${brand} - ${year}`
    };
  };

  constructor(props) {
    super(props);

    this.brand = this.props.navigation.getParam("brand");
    this.year = this.props.navigation.getParam("year");
    this.total = this.props.navigation.getParam("total");
    this.genders = ["men", "women", "unisex"];

    let itemPerPage = 40;
    let shoes = {};

    this.numPage = Math.ceil(this.total / itemPerPage);

    for (var i = 1; i <= this.numPage; i++) {
      shoes[i.toString()] = [];
    }

    this.state = {
      shoes,
      isPostingShoes: false,
      totalShoesPosted: 0,
      buttonSelectedIndex: 0,
      isGettingShoesByGender: false
    };
  }

  render() {
    const pages = [];
    for (let i = 1; i <= this.numPage; i++) {
      pages.push(i.toString());
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.total <= 1000 ? (
          <IndicatorViewPager style={{ flex: 1 }} indicator={this.renderIndicator()}>
            {pages.map((itm, idx) => (
              <View key={idx} style={{ flex: 1, maxWidth: Dimensions.get("window").width }}>
                <ShoePage brand={this.brand} year={this.year} page={itm} />
              </View>
            ))}
          </IndicatorViewPager>
        ) : (
          this.renderMoreThan1000Shoes()
        )}
      </SafeAreaView>
    );
  }

  renderIndicator() {
    return (
      <PagerDotIndicator
        pageCount={this.numPage}
        dotStyle={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "grey",
          width: 10,
          height: 10,
          backgroundColor: "white"
        }}
        selectedDotStyle={{ backgroundColor: "grey", width: 10, height: 10, borderRadius: 5 }}
      />
    );
  }

  renderMoreThan1000Shoes() {
    return (
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={this.genders}
          selectedIndex={this.state.buttonSelectedIndex}
          onPress={idx => this.setState({ buttonSelectedIndex: idx })}
        />
        <BrandByYearGender
          brand={this.brand}
          year={this.year}
          gender={this.genders[this.state.buttonSelectedIndex]}
        />
      </View>
    );
  }
}
