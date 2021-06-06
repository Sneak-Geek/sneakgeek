import React from 'react';
import { Switch, Route } from 'react-router';
import { CatalogTable, CatalogEdit } from './Components';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const CatalogScreen = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path={'/catalogs'} component={CatalogTable} />
        <Route
          path={'/catalogs/:catalogId/edit'}
          render={(props: any) => <CatalogEdit {...props} isEditMode={true} />}
        />
        <Route
          path={'/catalogs/new'}
          render={(props: any) => <CatalogEdit {...props} isEditMode={false} />}
        />
      </Switch>
    </div>
  );
};

export default CatalogScreen;
