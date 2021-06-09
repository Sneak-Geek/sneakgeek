import React from "react";
import { SafeAreaView, Dimensions, View, ActivityIndicator } from "react-native";
import ShoePage from "./ShoePage";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";

export default class BrandByYearGender extends React.Component {
  state = {
    ready: false,
    total: 0
  };

  componentDidMount() {
    this.fetchShoes();
  }

  render() {
    if (!this.state.ready) {
      return <ActivityIndicator />;
    }

    const numPage = Math.ceil(this.state.total / 40);
    const pages = [];
    for (let i = 1; i <= numPage; i++) {
      pages.push(i);
    }

    return (
      <IndicatorViewPager style={{ flex: 1 }} indicator={this.renderIndicator()}>
        {pages.map((itm, idx) => (
          <View key={idx} style={{ flex: 1, maxWidth: Dimensions.get("window").width }}>
            <ShoePage
              page={itm}
              brand={this.props.brand}
              year={this.props.year}
              gender={this.props.gender}
            />
          </View>
        ))}
      </IndicatorViewPager>
    );
  }

  fetchShoes() {
    const { brand, year, gender } = this.props;
    fetch(
      `https://stockx.com/api/browse?productCategory=sneakers&brand=${brand}&year=${year}&gender=${gender}`
    )
      .then(res => res.json())
      .then(data => {
        this.setState({
          ready: true,
          total: data.Pagination.total
        });
      });
  }

  renderIndicator() {
    const numPage = Math.ceil(this.state.total / 40);
    return (
      <PagerDotIndicator
        pageCount={numPage}
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
}
