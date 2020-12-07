import React, { useState, useEffect } from 'react';
import { Catalog, ObjectFactory, FactoryKeys, ICatalogService } from 'business';
import { getToken } from '../../../utilities';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Avatar,
  Typography,
  Card,
  CardContent,
  makeStyles,
  IconButton,
  Icon,
  Fab,
} from '@material-ui/core';
import CatalogDetailDialog from './CatalogDetailDialog';
import { History } from 'history';

const useStyles = makeStyles(() => ({
  content: {
    padding: 0,
  },
  title: {
    marginBottom: 15,
  },
  fab: {
    position: 'fixed',
    bottom: 50,
    right: 50,
  },
}));

const CatalogTableContent = (props: {
  catalogs: Catalog[];
  onCatalogEdit: (c: Catalog) => void;
  onCatalogSelected: (c: Catalog) => void;
}): JSX.Element => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Ảnh cover</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Miêu tả</TableCell>
        <TableCell>Số sản phẩm</TableCell>
        <TableCell>Phân loại</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
    {props.catalogs.map((c) => (
      <TableRow hover key={c._id}>
        <TableCell>
          <Avatar src={c.coverImage} variant={'square'} sizes={'large'} />
        </TableCell>
        <TableCell>
          <Typography variant={'body1'}>{c.title}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant={'body1'}>{c.description}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant={'body1'}>{c.products.length}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant={'body1'}>{c.catalogType}</Typography>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => props.onCatalogEdit(c)}>
            <Icon>edit</Icon>
          </IconButton>
          <IconButton onClick={() => props.onCatalogSelected(c)}>
            <Icon>preview</Icon>
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </Table>
);

const CatalogTable = (props: { history: History }): JSX.Element => {
  const [catalogs, setCatalogs] = useState(new Array<Catalog>());
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog>();
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetchCatalogs = async () => {
    const catalogService = ObjectFactory.getObjectInstance<ICatalogService>(
      FactoryKeys.ICatalogService,
    );
    const token = getToken();
    const catalogs = await catalogService.getAllCatalogs(token);
    if (catalogs) {
      setCatalogs(catalogs);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const classes = useStyles();

  return (
    <div>
      <Typography variant={'h2'} className={classes.title}>
        Tất cả catalog
      </Typography>
      <Card>
        <CardContent className={classes.content}>
          <CatalogTableContent
            catalogs={catalogs}
            onCatalogEdit={(c: Catalog) => {
              props.history.push(`/catalogs/${c._id}/edit`, { catalog: c });
            }}
            onCatalogSelected={(c: Catalog) => {
              setSelectedCatalog(c);
              setDialogVisible(true);
            }}
          />
        </CardContent>
      </Card>
      <CatalogDetailDialog
        catalog={selectedCatalog}
        isVisible={dialogVisible}
        onClose={() => setDialogVisible(false)}
      />
      <Fab
        color={'primary'}
        aria-label={'add'}
        className={classes.fab}
        onClick={() => props.history.push(`/catalogs/new`)}
      >
        <Icon>add</Icon>
      </Fab>
    </div>
  );
};

export default CatalogTable;
