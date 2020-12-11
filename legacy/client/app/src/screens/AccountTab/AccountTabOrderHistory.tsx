import React from 'react';
import {IAppState} from 'store/AppStore';
import {useSelector} from 'react-redux';

export const AccountTabOrderHistory: React.FC<{}> = () => {
  const account = useSelector(
    (state: IAppState) => state.UserState.accountState.account,
  );
  const profile = useSelector(
    (s: IAppState) => s.UserState.profileState.profile,
  );

  return <></>;
};
