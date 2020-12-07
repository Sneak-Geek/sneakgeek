import { createStackNavigator, createAppContainer } from "react-navigation";
import Main from "./screen/Main";
import Brand from "./screen/Brand";
import BrandByYear from "./screen/BrandByYear";

const Navigator = createStackNavigator({
  Main: { screen: Main },
  Brand: { screen: Brand },
  BrandByYear: { screen: BrandByYear }
});

export default createAppContainer(Navigator);
