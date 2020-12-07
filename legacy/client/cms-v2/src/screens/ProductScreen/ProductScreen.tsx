import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { ProductTable, ProductEdit } from './Components';
import { Switch, Route } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export const ProductScreen = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path={'/products'} component={ProductTable} />
        <Route path={'/products/:shoeId/edit'} component={ProductEdit} />
      </Switch>
    </div>
  );
};
