import React from 'react';
import { View } from 'react-native';
import { connect } from 'utilities/ReduxUtilities';
import { IAppState } from 'store/AppStore';
import { Profile, Account } from 'business';

type Props = {
    account: Account;
    profile: Profile;
};

@connect(
    (state: IAppState) => ({
        account: state.UserState.accountState.account,
        profile: state.UserState.profileState.profile,
    }),
    () => ({}),
)
export class AccountTabOrderHistory extends React.Component<Props> {
    render(): JSX.Element {
        const { account, profile } = this.props;
        const isAccountExist = Boolean(account && profile);
        if (!isAccountExist) {
            return <View />;
        }

        const isSeller = profile.isSeller;

        return <View />;
    }
}
