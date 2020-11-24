import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {
  FormControl,
  makeStyles,
  createStyles,
  FormGroup,
  Card,
  Button,
  Icon,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { authenticateWithEmail, NetworkRequestState, Account } from 'business';
import { IAppState } from '../../store';
import { History } from 'history';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      height: '100vh',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      width: '30ch',
    },
    form: {
      flexDirection: 'column',
      marginTop: 10,
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 25,
      paddingRight: 25,
      minHeight: '25%',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      display: 'flex',
      alignSelf: 'flex-end',
      marginTop: 10,
      marginBottom: 20,
    },
  }),
);

type Props = {
  history: History;
  accountState: {
    state: NetworkRequestState;
    error?: any;
    account?: Account;
  };
  emailLogin: (email: string, password: string) => void;
};

export const UnconnectedLoginScreen = (props: Props): JSX.Element => {
  const classes = useStyles();
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const { state, account } = props.accountState;
    if (state === NetworkRequestState.SUCCESS && account) {
      props.history.replace('/');
    }
  });

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <FormGroup className={classes.form}>
          <FormControl className={classes.textField}>
            <InputLabel htmlFor={'email-address'}>Email address</InputLabel>
            <Input
              id={'email-address'}
              value={state.email}
              onChange={(event): void => setState({ ...state, email: event.target.value })}
              type={'email'}
            />
          </FormControl>
          <FormControl className={classes.textField}>
            <InputLabel htmlFor={'password'}>Password</InputLabel>
            <Input
              onChange={(event): void => setState({ ...state, password: event.target.value })}
              value={state.password}
              id={'password'}
              type={'password'}
            />
          </FormControl>
        </FormGroup>
        <Button
          variant={'contained'}
          color={'primary'}
          className={classes.button}
          endIcon={<Icon>send</Icon>}
          onClick={(): void => props.emailLogin(state.email, state.password)}
        >
          Đăng nhập
        </Button>
      </Card>
    </div>
  );
};

export const LoginScreen = connect(
  (state: IAppState) => ({
    accountState: state.UserState.accountState,
  }),
  (dispatch: Function) => ({
    emailLogin: (email: string, password: string): void => {
      dispatch(authenticateWithEmail(email, password));
    },
  }),
)(UnconnectedLoginScreen);
