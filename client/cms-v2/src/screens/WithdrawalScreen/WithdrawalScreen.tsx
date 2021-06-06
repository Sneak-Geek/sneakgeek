import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Switch, Route } from 'react-router';
import { WithdrawalTable } from 'screens/WithdrawalScreen/Components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const WithdrawalScreen = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path={'/withdrawals'} component={WithdrawalTable} />
      </Switch>
    </div>
  );
};

export default WithdrawalScreen;
