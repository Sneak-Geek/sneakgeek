//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from "react";
import { Route } from "react-router-dom";

import "./product.scss";

export class ProductScreen extends React.Component<{}> {
  private allTabs = [
    { name: "Tất cả", route: "#products/all" },
    { name: "Sản phẩm hot", route: "#products/hot" },
    { name: "Xem nhiều", route: "#products/frequent" }
  ];

  public /** override */ render(): JSX.Element {
    return <></>;
  }
}
