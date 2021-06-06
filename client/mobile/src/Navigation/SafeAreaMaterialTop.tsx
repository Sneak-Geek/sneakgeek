//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { SafeAreaView, MaterialTopTabBar } from "react-navigation";

export const SafeAreaMaterialTopTabBar = (props: any) => {
  return (
    <SafeAreaView>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  );
};
