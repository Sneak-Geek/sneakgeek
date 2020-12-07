//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from "react";
import {
  Table,
  Button,
  Icon,
  Segment,
  Dimmer,
  Loader,
  Header,
  Popup,
  Modal,
  Grid,
  Form,
  Input
} from "semantic-ui-react";
import "./style.css";
import { History } from "history";
import {
  getAllCatalogs,
  Catalog,
  NetworkRequestState,
  ObjectFactory,
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
  ICatalogService
} from "business";
import { connect } from "react-redux";
import { IAppState } from "../../store/IAppState";
import { Link } from "react-router-dom";

type Props = {
  history: History;
  getAllCatalogs: () => void;
  catalogState: {
    state: NetworkRequestState;
    error?: any;
    catalogs?: Catalog[];
  };
};

type State = {
  error: any;
  isLoaded: boolean;
  items: object[];
  catalogTitle: string;
  catalogDescription: string;
  showModal: boolean;
};

export class UnconnectedCatalogScreen extends React.Component<Props, State> {
  readonly CREATE_NEW_CATALOG = "http://localhost:8080/api/v1/catalogue";

  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      catalogTitle: "",
      catalogDescription: "",
      showModal: false
    };
  }

  public componentDidMount() {
    this.props.getAllCatalogs();
  }

  render() {
    const { catalogState } = this.props;
    if (
      catalogState.state === NetworkRequestState.REQUESTING ||
      catalogState.state === NetworkRequestState.NOT_STARTED
    ) {
      return (
        <Segment>
          <Dimmer active>
            <Loader>Getting catalog...</Loader>
          </Dimmer>
        </Segment>
      );
    }

    if (catalogState.catalogs && catalogState.state === NetworkRequestState.FAILED) {
      return <Header>Đã có lỗi xảy ra</Header>;
    }

    const { catalogs } = catalogState;

    return (
      <div className="view">
        <Header as="h2">Quản lý catalog</Header>
        <Table celled stripped>
          {this._renderTableHeader()}
          {this._renderTableBody(catalogs)}
          {this._renderTableFooter()}
        </Table>
      </div>
    );
  }

  private _renderTableHeader(): JSX.Element {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private _renderTableBody(catalogs?: Catalog[]): JSX.Element {
    return (
      <Table.Body>
        {catalogs!.map(element => {
          return (
            <Table.Row>
              <Table.Cell collapsing>{element.title}</Table.Cell>
              <Table.Cell>{element.description}</Table.Cell>
              <Table.Cell collapsing>
                <Link
                  to={{
                    pathname: `/catalogs/${element._id}`,
                    state: { catalog: element }
                  }}
                >
                  <Popup
                    content="Chỉnh sửa catalog"
                    position="right center"
                    trigger={
                      <Button
                        onClick={() => {}}
                        floated={"right"}
                        size={"small"}
                        compact
                        icon={"small pencil alternate icon"}
                      />
                    }
                  />
                </Link>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }

  private _renderAddCatalogModal = () => {
    return (
      <Modal
        open={this.state.showModal}
        onClose={() => {
          this.setState({ showModal: false });
        }}
        trigger={
          <Button
            onClick={() => {
              this.setState({ showModal: true });
            }}
            floated="right"
            icon
            labelPosition="left"
            primary
            size="small"
          >
            <Icon name="plus" /> Tạo catalog
          </Button>
        }
      >
        <Modal.Header>Tạo catalog</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Column width={15}>
              <Form>
                <Form.Field>
                  <label>Tên catalog</label>
                  <Input
                    onChange={this._updateCatalogTitle.bind(this)}
                    placeholder="Tên catalog"
                  />
                </Form.Field>
                <Form.TextArea
                  onChange={this._updateCatalogDescription.bind(this)}
                  label="Mô tả catalog"
                  placeholder="Mô tả catalog"
                />
                <Button
                  onClick={() => {
                    this._createNewCatalog();
                    this.setState({ showModal: false });
                  }}
                  type="submit"
                  color="blue"
                  floated="right"
                  labelPosition="left"
                  icon
                >
                  <Icon name="save outline" />
                  Lưu
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ showModal: false });
                  }}
                  type="submit"
                  floated="right"
                  labelPosition="left"
                  icon
                >
                  <Icon name="cancel" />
                  Huỷ
                </Button>
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  };

  private _updateCatalogDescription(e: any, data: any) {
    const { value } = data;
    this.setState({
      catalogDescription: value
    });
  }

  private _updateCatalogTitle(e: any, data: any) {
    const { value } = data;
    this.setState({
      catalogTitle: value
    });
  }

  private async _createNewCatalog() {
    const token = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    ).getValue(SettingsKey.CurrentAccessToken);

    const catalogService = ObjectFactory.getObjectInstance<ICatalogService>(
      FactoryKeys.ICatalogService
    );

    const catalogTitle = this.state.catalogTitle;
    const catalogDescription = this.state.catalogDescription;
    const products = ["5e1fcf7c211ec4001b26cf82"];

    catalogService.createNewCatalog(token, catalogTitle, catalogDescription, products);
  }

  private _renderTableFooter(): JSX.Element {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="3">{this._renderAddCatalogModal()}</Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
}

export const CatalogScreen = connect(
  (state: IAppState) => ({
    catalogState: state.CatalogState.catalogState
  }),
  (dispatch: Function) => ({
    getAllCatalogs: () => dispatch(getAllCatalogs())
  })
)(UnconnectedCatalogScreen);
