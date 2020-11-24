//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from "react";
import {
  Sticky,
  Menu,
  Icon,
  Sidebar,
  Segment,
  Image,
  Popup,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { styles } from "./style";
import { connect } from "react-redux";
import { IAppState } from "../../store/IAppState";
import { IUserState, NetworkRequestState, getCurrentUser } from "business";
import { CatalogScreen } from "../CatalogScreen";
import { CatalogManagementScreen } from "../CatalogManagementScreen";
import { SneakersCheckingScreen } from "../../SneakersCheckingScreen";

type Props = {
  currentPath: string;
  userState: IUserState;
  getCurrentUser: () => void;
};

type State = {
  isMenuVisible: boolean;
};

export class UnconnectedHomeScreen extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isMenuVisible: false
    };
  }

  public componentDidMount() {
    this.props.getCurrentUser();
  }

  public render(): JSX.Element {
    if (
      this.props.userState.accountState.state === NetworkRequestState.REQUESTING ||
      this.props.userState.accountState.state === NetworkRequestState.NOT_STARTED
    ) {
      return (
        <Segment>
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
        </Segment>
      );
    }

    if (
      !this.props.userState.accountState.account &&
      this.props.userState.accountState.state === NetworkRequestState.FAILED
    ) {
      return <Redirect to={"/login"} />;
    }

    return (
      <div style={styles.rootContainer}>
        <Sticky>
          <Menu attached={"top"} tabular={true} inverted={true}>
            <Menu.Item
              onClick={() =>
                this.setState({
                  isMenuVisible: !this.state.isMenuVisible
                })
              }
              position={"left"}
            >
              <Icon name={this.state.isMenuVisible ? "sidebar" : "ellipsis vertical"} />
            </Menu.Item>
            <Menu.Item position={"right"}>
              <Popup
                position={"top right"}
                content={"User data"}
                header={"User name"}
                trigger={
                  <Image
                    src={
                      "https://react.semantic-ui.com/images/movies/totoro-horizontal.jpg"
                    }
                    avatar
                  />
                }
              />
            </Menu.Item>
          </Menu>
        </Sticky>
        <Sidebar.Pushable as={Segment}>
          {this._renderSideMenu()}
          {this._renderMainContent()}
        </Sidebar.Pushable>
      </div>
    );
  }

  private _renderSideMenu(): JSX.Element {
    const { currentPath } = this.props;
    return (
      <Sidebar
        as={Menu}
        animation={"overlay"}
        inverted={false}
        vertical={true}
        visible={this.state.isMenuVisible}
        width={"wide"}
      >
        <Menu.Item link active={currentPath === "/dashboard"}>
          <Link to={"/dashboard"}>Tổng quan</Link>
          <Icon name={"grid layout"} />
        </Menu.Item>
        <Menu.Item link active={currentPath === "/catalogs"}>
          <Link to={"/catalogs"}>Quản lý catalog</Link>
          <Icon name={"clipboard list"} />
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Quản lý sản phẩm</Menu.Header>
          <Menu.Menu>
            <Menu.Item link active={currentPath === "/products/snkg"}>
              <Icon name="shopping cart" />
              <Link to={"/products/snkg"}>Sản phẩm từ snkg</Link>
            </Menu.Item>
            <Menu.Item link active={currentPath === "/products/request"}>
              <Icon name="tasks" />
              <Link to={"/products/request"}>Yêu cầu từ khách hàng</Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item link active={currentPath === "/users"}>
          <Link to={"/users"}>Quản lý người dùng</Link>
          <Icon name={"user"} />
        </Menu.Item>
        <Menu.Item link active={currentPath === "/checking"}>
          <Link to={"/checking"}>Quản lý đơn hàng</Link>
          <Icon name={"bolt"} />
        </Menu.Item>
      </Sidebar>
    );
  }

  private _renderMainContent(): JSX.Element {
    return (
      <Sidebar.Pusher>
        <Segment basic>
          <Switch>
            <Route path={"/"} exact render={() => <Redirect to={"/dashboard"} />} />
            <Route path={"/dashboard"} render={() => <h3>Tổng quan</h3>} />
            <Route
              exact
              path={"/catalogs"}
              render={props => <CatalogScreen {...props} />}
            />
            <Route
              path={"/catalogs/:id"}
              render={props => <CatalogManagementScreen {...props} />}
            />
            <Route
              exact
              path={"/products"}
              render={() => <Redirect to={"/products/snkg"} />}
            />
            <Route path={"/products/snkg"} render={() => <h3>Hi</h3>} />
            <Route
              path={"/products/request"}
              render={() => <h3>Yêu cầu từ người dùng</h3>}
            />
            <Route path={"/users"} render={() => <h3>Quản lý người dùng</h3>} />
            <Route path={"/checking"} render={() => <SneakersCheckingScreen />} />
          </Switch>
        </Segment>
      </Sidebar.Pusher>
    );
  }
}

export const HomeScreen = connect(
  (state: IAppState) => ({
    currentPath: state.router.location.pathname,
    userState: state.UserState
  }),
  (dispatch: Function) => ({
    getCurrentUser: () => dispatch(getCurrentUser())
  })
)(UnconnectedHomeScreen);
