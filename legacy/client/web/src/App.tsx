import React, { RefObject } from "react";
import "./App.css";
import { Menu, Image, Header, Sticky, Segment } from "semantic-ui-react";

export default class App extends React.Component<{}> {
  private contextRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return (
      <div ref={this.contextRef}>
        <Sticky context={this.contextRef}>
          <Menu size={"massive"} attached={"top"} style={{ margin: 0 }}>
            <Menu.Menu position={"left"}>
              <Menu.Item>
                <img src="/images/icon.png" />
              </Menu.Item>
              <Menu.Item link>
                <Header as={"h3"}>News</Header>
              </Menu.Item>
              <Menu.Item link>
                <Header as={"h3"}>App</Header>
              </Menu.Item>
              <Menu.Item link>
                <Header as={"h3"}>Help</Header>
              </Menu.Item>
            </Menu.Menu>

            <Menu.Menu position={"right"}>
              <Menu.Item link>
                <Header as={"h3"}>Search</Header>
              </Menu.Item>
              <Menu.Item link>
                <Header as={"h3"}>Login</Header>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Sticky>
        <div>
          <Image src={"/images/background.png"} />
        </div>
        <div>
          <Menu inverted secondary>
            <Menu.Item href={"/files/privacypolicy.pdf"}>
              <Header as={"h5"}>Privacy policies</Header>
            </Menu.Item>
            <Menu.Item href={"robots.txt"}>
              <Header as={"h5"}>Terms of use</Header>
            </Menu.Item>
            <Menu.Item href={"robots.txt"}>
              <Header as={"h5"}>Support</Header>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}
