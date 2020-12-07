import React, { useState } from 'react';
import { Typography, makeStyles, Theme, Icon, Fab, Grid, Snackbar } from '@material-ui/core';
import { History } from 'history';
import {
  Catalog,
  CatalogType,
  Shoe,
  ObjectFactory,
  IShoeService,
  FactoryKeys,
  ICatalogService,
} from 'business';
import { getToken } from 'utilities';
import CatalogEditContent from './CatalogEditContent';
import CatalogEditProductList from './CatalogEditProductList';
import { Alert, Color } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  searchResultText: {
    marginLeft: theme.spacing(3),
  },
  cardTitle: {
    marginBottom: theme.spacing(5),
  },
  fab: {
    position: 'fixed',
    bottom: 50,
    right: 50,
  },
}));

const CatalogEdit = (props: {
  history: History<{ catalog?: Partial<Catalog> }>;
  isEditMode: boolean;
}): JSX.Element => {
  const catalog = props.history.location.state?.catalog || {};

  // Styles
  const classes = useStyles();

  // Service declaration
  const shoeService = ObjectFactory.getObjectInstance<IShoeService>(FactoryKeys.IShoeService);
  const catalogService = ObjectFactory.getObjectInstance<ICatalogService>(
    FactoryKeys.ICatalogService,
  );

  // State declaration
  const [editedCatalog, setEditedCatalog] = useState<Partial<Catalog>>(catalog);
  const [searchProductResults, setSearchProductResults] = useState<Shoe[]>([]);

  type SnackbarType = '' | 'success' | 'error';
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('');

  const onRemoveProduct = (s: Shoe) => {
    setEditedCatalog({
      ...editedCatalog,
      productIds: editedCatalog.productIds?.filter((id) => id !== s._id),
      products: editedCatalog.products?.filter((shoe) => shoe._id !== s._id),
    });
  };

  const onAddProduct = (s: Shoe) => {
    if (!editedCatalog.productIds?.some((id) => id === s._id)) {
      setEditedCatalog({
        ...editedCatalog,
        productIds: [...(editedCatalog.productIds || []), s._id],
        products: [...(editedCatalog.products || []), s],
      });
    }
  };

  const onTitleChange = (title: string) => {
    setEditedCatalog({ ...editedCatalog, title });
  };

  const onDescriptionChange = (description: string) => {
    setEditedCatalog({ ...editedCatalog, description });
  };

  const onCatalogTypeChange = (catalogType: CatalogType) => {
    setEditedCatalog({ ...editedCatalog, catalogType });
  };

  const onProductSearch = async (query: string) => {
    const { shoes } = await shoeService.searchShoes(query, 0);
    setSearchProductResults(shoes);
  };

  const updateCatalog = async () => {
    if (editedCatalog._id) {
      try {
        await catalogService.saveCatalog(
          getToken(),
          {
            title: editedCatalog.title,
            description: editedCatalog.description,
            productIds: editedCatalog.productIds,
            coverImage: editedCatalog.coverImage,
            catalogType: editedCatalog.catalogType,
            showOnHomepagePriority: editedCatalog.showOnHomepagePriority,
          },
          editedCatalog._id,
        );
        setSnackbarType('success');
      } catch (error) {
        setSnackbarType('error');
      }
    }
  };

  const addCatalog = async () => {
    try {
      await catalogService.createNewCatalog(getToken(), editedCatalog);
      setSnackbarType('success');
    } catch (error) {
      setSnackbarType('error');
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant={'h2'} className={classes.cardTitle}>
        {props.isEditMode ? 'Thay đổi thông tin catalog' : 'Thêm catalog'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <CatalogEditContent
            catalog={editedCatalog}
            onCatalogTypeChange={onCatalogTypeChange}
            onDescriptionChange={onDescriptionChange}
            onTitleChange={onTitleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <CatalogEditProductList
            products={editedCatalog.products || []}
            productSearchList={searchProductResults}
            onAddProduct={onAddProduct}
            onRemoveProduct={onRemoveProduct}
            onSearch={onProductSearch}
          />
        </Grid>
      </Grid>
      <Fab
        color={'primary'}
        aria-label={'add'}
        className={classes.fab}
        onClick={props.isEditMode ? updateCatalog : addCatalog}
      >
        <Icon>backup</Icon>
      </Fab>
      <Snackbar
        open={snackbarType !== ''}
        autoHideDuration={5000}
        onClose={() => setSnackbarType('')}
      >
        <Alert onClose={() => setSnackbarType('')} severity={snackbarType as Color}>
          Đã thay đổi thông tin catalog thành công
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CatalogEdit;
