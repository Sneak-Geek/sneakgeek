import React from "react";
import { Table, Header, Grid, Search, Segment } from "semantic-ui-react";
import { ShoeAuthentication } from "business";

type Props = {};

type State = {
  shoeAuthentications?: ShoeAuthentication[];
  isLoading: boolean;
  value: string;
  searchResults: object[];
  searchTextInput: string;
};

export class SneakersCheckingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchTextInput: "",
      searchResults: [],
      isLoading: false,
      value: "",
      shoeAuthentications: [
        {
          title: "Balenciaga",
          imageUrl:
            "https://stockx.imgix.net/Nike-Air-Max-1-Bordeaux-Desert-Sand.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1557802469",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "1e8kdd12jKl",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Gucci",
          imageUrl:
            "https://stockx.imgix.net/Nike-Zoom-Fly-3-White-Black.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1561165977",
          brand: "string",
          size: 102,
          isNew: true,
          images: ["string", "string"],
          condition: {},
          trackingID: "1kd0239dj0",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "2od09023dd",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "oopp0011nn",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "39jxnd12s",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "oloaf9320jdsd020",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "Omd03mla021",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        },
        {
          title: "Yeezy",
          imageUrl:
            "https://stockx.imgix.net/Nike-SB-Nike-Air-Force-2-Low-Team-Red-Obsidian.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1560959207",
          brand: "string",
          size: 102,
          isNew: false,
          images: ["string", "string"],
          condition: {},
          trackingID: "AA2ncdj918Fl0",
          status: "Pending",
          uploadDate: "17-01-2020 8PM UTC"
        }
      ]
    };
  }

  render() {
    {
      console.log(this.state.shoeAuthentications);
    }
    return (
      <div>
        <Header as="h2">Check giày</Header>
        {this._renderSearchReviewProducts()}
        <Table celled selectable>
          {this._renderTableHeader()}
          {this._renderTableBody(this.state.shoeAuthentications)}
        </Table>
      </div>
    );
  }

  private _handleSearchChange(event: any, data: any) {
    const { value } = data;
    this.setState({ isLoading: true, searchTextInput: value });
    //TO DO: Need to Implement a Searching Algorithm
    const results = this.state.shoeAuthentications!.map((shoeAu: ShoeAuthentication) => {
      return {
        image: shoeAu.imageUrl,
        ...shoeAu,
        title: shoeAu.trackingID
      };
    });
    this.setState({ isLoading: false, searchResults: results });
  }

  private _renderAdminAuthenticationModal(data: string) {
    //TO DO: Create a modal that allow admins to shoe authentication
    console.log(data);
  }

  private _onSearchSelect(event: any, data: any) {
    const { result } = data;
    this._renderAdminAuthenticationModal(data);
  }

  private _renderSearchReviewProducts() {
    return (
      <Grid>
        <Grid.Column width={5}>
          <Search
            fluid
            placeholder="Tìm giày"
            loading={this.state.isLoading}
            onSearchChange={this._handleSearchChange.bind(this)}
            onResultSelect={this._onSearchSelect.bind(this)}
            results={this.state.searchResults}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    );
  }

  private _renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Mã đơn hàng</Table.HeaderCell>
          <Table.HeaderCell>Ảnh giày</Table.HeaderCell>
          <Table.HeaderCell>Tên giày</Table.HeaderCell>
          <Table.HeaderCell>Hãng giày</Table.HeaderCell>
          <Table.HeaderCell>Mới/Cũ</Table.HeaderCell>
          <Table.HeaderCell>Ngày tạo đơn hàng</Table.HeaderCell>
          <Table.HeaderCell>Trạng thái</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private _renderTableBody(shoeAuthentications?: ShoeAuthentication[]) {
    if (shoeAuthentications)
      return (
        <Table.Body>
          {shoeAuthentications.map((shoeAuthentication: ShoeAuthentication) => {
            return (
              <Table.Row
                onClick={() => {
                  this._renderAdminAuthenticationModal(shoeAuthentication.trackingID);
                }}
              >
                <Table.Cell>{shoeAuthentication.trackingID}</Table.Cell>
                <Table.Cell>
                  {" "}
                  <img className="image" src={shoeAuthentication.imageUrl} />
                </Table.Cell>
                <Table.Cell>{shoeAuthentication.title}</Table.Cell>
                <Table.Cell>{shoeAuthentication.brand}</Table.Cell>
                <Table.Cell>{shoeAuthentication.isNew ? "Mới" : "Cũ"}</Table.Cell>
                <Table.Cell>{shoeAuthentication.uploadDate}</Table.Cell>
                <Table.Cell>{shoeAuthentication.status}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      );
    else return <></>;
  }
}
