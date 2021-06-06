import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Theme,
  TablePagination,
  Fab,
  withStyles,
} from '@material-ui/core';
import { Shoe, IShoeService, ObjectFactory, FactoryKeys } from 'business';
import { SearchInput } from '../../../../shared';
import AddIcon from '@material-ui/icons/Add';
import { History } from 'history';
import ProductTableContent from './ProductTableContent';
import ProductDetailDialog from './ProductDetailDialog';

type Props = {
  history: History;
  classes: any;
};

type State = {
  currentPage: number;
  shoes: Shoe[];
  total: number;
  keyword: string;
  shoeViewDialogOpen: boolean;
  selectedShoe?: Shoe;
};

class ProductList extends React.Component<Props, State> {
  private shoeService: IShoeService = ObjectFactory.getObjectInstance(FactoryKeys.IShoeService);

  state = {
    shoes: [],
    currentPage: 0,
    total: 0,
    keyword: '',
    shoeViewDialogOpen: false,
    selectedShoe: undefined,
  };

  public componentDidMount() {
    this.fetchShoes();
  }

  public render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant={'h2'} className={classes.title}>
          Tất cả sản phẩm
        </Typography>
        <Card>
          <CardContent className={classes.content}>
            <SearchInput onChange={this.onKeywordChange.bind(this)} />
            <Typography variant={'body1'} className={classes.total}>
              {this.state.total} kết quả
            </Typography>
            <ProductTableContent
              shoes={this.state.shoes}
              classes={classes}
              onShoeView={this.onShoeView.bind(this)}
            />
          </CardContent>
        </Card>
        <TablePagination
          component={'div'}
          count={this.state.total}
          page={this.state.currentPage}
          onChangePage={this.onChangePage.bind(this)}
          rowsPerPageOptions={[20]}
          rowsPerPage={20}
          onChangeRowsPerPage={() => {}}
        />
        <ProductDetailDialog
          shoe={this.state.selectedShoe}
          onCloseProductDetail={this.onDialogClose.bind(this)}
          isDialogOpen={this.state.shoeViewDialogOpen}
        />
        <Fab color={'primary'} aria-label={'add'} className={classes.fab}>
          <AddIcon />
        </Fab>
      </div>
    );
  }

  private async fetchShoes(keyword: string = this.state.keyword) {
    const { shoes, count } = await this.shoeService.searchShoes(
      keyword,
      this.state.currentPage,
    );
    this.setState({ shoes, total: count });
  }

  private onKeywordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    this.setState({ keyword: text, currentPage: 0 });
    this.fetchShoes(text);
  }

  private onChangePage(_: any, page: number) {
    this.setState({ shoes: [], currentPage: page });
    this.fetchShoes();
  }

  private onShoeView(shoe: Shoe, isEditMode: boolean) {
    if (isEditMode) {
      this.props.history.push(`/products/${shoe._id}/edit`, { shoe });
    } else {
      this.setState({ shoeViewDialogOpen: true, selectedShoe: shoe });
    }
  }

  private onDialogClose() {
    this.setState({ shoeViewDialogOpen: false });
  }
}

export default withStyles((theme: Theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  chip: {
    marginLeft: 5,
    marginTop: 2,
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginBottom: 15,
  },
  total: {
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  fab: {
    display: 'flex',
    position: 'fixed',
    bottom: 50,
    right: 50,
  },
}))(ProductList);
