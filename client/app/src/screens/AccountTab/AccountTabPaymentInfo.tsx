import React from 'react';
import { View, Alert, StyleSheet, FlatList, Dimensions, TextInput, ScrollView } from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { AppText, BottomButton } from 'screens/Shared';
import { strings, themes } from 'resources';
import { FactoryKeys, IAccountService, BalanceHistory, BalanceHistoryAction, BalanceHistoryStatus } from 'business/src';
import { getDependency, getToken, toVnDateFormat } from 'utilities';

type Props = {}

type State = {
    currentBalance: number;
    formattedCurrentBalance: string;
    balanceHistories: Array<BalanceHistory>;
    withdrawalAmount: number;
    formattedWithdrawalAmount: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    currentScreen: number;
    processingWithdrawal: BalanceHistory
}

enum Screen{
    ACCOUNT_BALANCE,
    PAYMENT_INFO
}

const styles = StyleSheet.create({
    bodyContainerStyle: {
        backgroundColor: 'white',
        flex: 1,
        display:'flex',
    },
    screenOneContainerStyle:{
      width: Dimensions.get('screen').width,
    },
    accountBalanceAmountStyle: {
        opacity: 0.6,
        marginBottom: 10,
    },
    accountBalanceContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    transationContainerStyle: {
        marginBottom:10
    },
    balanceHistoryEmptyState: {
        alignSelf: 'center',
        marginTop: 70
    },
    balanceHistoryComponentContainer: {
        marginBottom:10,
    },
    captionContainer: {
        flexDirection:'row'
    },
    balanceHistoryComponentDateContainer: {
        marginBottom: 2,
        marginRight: 5
    },
    balanceHistoryComponentStatusContainer:{
        color: themes.HotOrange,
    },
    balanceHistoryComponentBodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    balanceHistoryComponentTitleContainer: {
        width: 200,
        marginBottom: 2,
        letterSpacing: -0.0241176
    },
    balanceHistoryComponentStatsContainer: {
        marginBottom: 2
    },
    balanceHistoryComponentAmountContainer: {
        alignSelf:'flex-end',
        marginBottom: 2,
        letterSpacing: -0.00615385
    },
    balanceHistoryComponentPrevBalanceContainer: {
        opacity: 0.6,
        alignSelf:'flex-end',
        letterSpacing: -0.00615385
    },
    balanceHistoryContainerStyle: {
        paddingHorizontal: 20,
        flex:1
    },
    currentBalanceTextStyle: {
        letterSpacing: -0.02
    },
    //SCREEN 2
    screenTwoContainerStyle: {
        width: Dimensions.get('screen').width,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: themes.ListItemBackGroundColor,
        height: 56,
 
        paddingHorizontal: 20
    },
    inputTitleTextStyle: {
        display:'flex',
        alignSelf:'center',
    },
    inputStyle: {
        width: 200,
        justifyContent:'center'
    },
    inputStyleTest: {
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        alignSelf: 'flex-end'
    },
    bottomButtonStyle: {
        backgroundColor: themes.AppSecondaryColor,
        position: 'absolute',
        height: themes.RegularButtonHeight,
        borderRadius: themes.LargeBorderRadius,
        width: Dimensions.get('screen').width - 40,
        left: 20
      },
});

type PaymentInfoComponents = {
    render(): JSX.Element;
    canProceed(): boolean;
}

export class AccountTabPaymentInfo extends React.Component<Props, State>{
    private readonly _accountService = getDependency<IAccountService>(
        FactoryKeys.IAccountService,
      );
    private childComponents: PaymentInfoComponents[];
    private _childFlatList: FlatList<PaymentInfoComponents>;

    constructor(props){
        super(props);
        this.childComponents = [{
            render: (): JSX.Element => {
                return (
                    <View style={styles.screenOneContainerStyle}>
                        {this._renderAccountBalance()}
                        {this._renderBalanceHistory()}
                        {this._renderBottomButton(strings.Withdraw.toUpperCase())}
                    </View>
                );
            },
            canProceed:(): boolean => {
                return true;
            }
        },
        {
            render: (): JSX.Element => {
                return (
                    <View style={styles.screenTwoContainerStyle}>
                        {this._renderWithdrawalInformationForm()}
                        {this._renderBottomButton(strings.Confirm.toUpperCase())}
                    </View>
                );
            },
            canProceed:(): boolean => {
                const {withdrawalAmount, bankName, accountNumber, accountHolderName} = this.state; 
                return Boolean(withdrawalAmount && bankName && accountNumber && accountHolderName && this.state.withdrawalAmount <= this.state.currentBalance && this.state.currentBalance > 0);
            }
        }
    ];
        this.state = {
            currentBalance: 0,
            formattedCurrentBalance: undefined,
            balanceHistories: [],
            withdrawalAmount: undefined,
            bankName: undefined,
            accountNumber: undefined,
            accountHolderName: undefined,
            formattedWithdrawalAmount: undefined,
            currentScreen: 0,
            processingWithdrawal: undefined
        }
    }

    render():JSX.Element{
        return(
            <SafeAreaConsumer>
                {(insets): JSX.Element => (
                    <View style={styles.bodyContainerStyle}>
                        {this._renderAccountPaymentTabInfoComponents()}
                    </View>
                )}

            </SafeAreaConsumer>
        );
    }

    public async componentDidMount(){
        const balanceHistories = await this._accountService.getBalanceHistories(getToken(),undefined,BalanceHistoryStatus.SUCCEEDED);
        const processingWithdrawal = (await this._accountService.getBalanceHistories(getToken(),BalanceHistoryAction.WITHDRAW,BalanceHistoryStatus.PROCESSING))[0] as BalanceHistory;
        this.setState({processingWithdrawal});
        if(balanceHistories && balanceHistories.length > 0){
            this.setState({balanceHistories,currentBalance: balanceHistories[0].action === BalanceHistoryAction.DEPOSIT? balanceHistories[0].amount + balanceHistories[0].prevBalance : balanceHistories[0].prevBalance-balanceHistories[0].amount});
        }
        const currentBalance = this.state.currentBalance;
        const formattedCurrentBalance = this.state.currentBalance.toLocaleString('vi', {
        style: 'currency',
        currency: 'VND',
        });
        this.setState({withdrawalAmount:currentBalance, formattedCurrentBalance, formattedWithdrawalAmount: formattedCurrentBalance})
        
    }

    private _renderAccountPaymentTabInfoComponents(){
        return (
            <FlatList
              ref={(ref) => (this._childFlatList = ref)}
              bounces={false}
              style={{ height: '100%'}}
              horizontal={true}
              pagingEnabled={true}
              data={this.childComponents}
              renderItem={({item}) => item.render()}
              alwaysBounceHorizontal={false}
              scrollEnabled={false}
              keyExtractor={(_item, idx) => idx.toString()}
            />
          );
    }

    private _renderAccountBalance(): JSX.Element{
        const formattedCurrentBalance = this.state.formattedCurrentBalance;
        return (
            <View style={styles.accountBalanceContainer}>
                <AppText.Callout style={styles.accountBalanceAmountStyle}>{strings.AccountBalanceAmount}</AppText.Callout>
                <AppText.LargeCallout style={styles.currentBalanceTextStyle}>{formattedCurrentBalance}</AppText.LargeCallout>
            </View>
        );
    }

    private _renderBalanceHistory(): JSX.Element{
        const {balanceHistories, processingWithdrawal} = this.state;
        let balanceHistoryEmptyState: JSX.Element = !balanceHistories || balanceHistories.length ===0? <AppText.Callout style={styles.balanceHistoryEmptyState}> Chưa có giao dịch</AppText.Callout> : undefined ;
        

        return (
            <View style={styles.balanceHistoryContainerStyle}>
                <AppText.Headline style={styles.transationContainerStyle}>{strings.Transaction.toUpperCase()}</AppText.Headline>
            <ScrollView>
                {processingWithdrawal && this._renderBalanceHistoryComponent(toVnDateFormat(processingWithdrawal.updatedAt), processingWithdrawal.action, processingWithdrawal.bankingInfo?.bankName, processingWithdrawal.shoe?.name ,processingWithdrawal.bankingInfo?.lastFourDigits, processingWithdrawal.amount, processingWithdrawal.prevBalance, processingWithdrawal.status)}
            {
                balanceHistories.map((balanceHistoryComponent, index) => {
                    return(
                        <View key={index}>
                            {
                            this._renderBalanceHistoryComponent(toVnDateFormat(balanceHistoryComponent.updatedAt), balanceHistoryComponent.action, balanceHistoryComponent.bankingInfo?.bankName, balanceHistoryComponent.shoe?.name ,balanceHistoryComponent.bankingInfo?.lastFourDigits ,balanceHistoryComponent.amount,balanceHistoryComponent.prevBalance)
                            }
                        </View>
                    );
                })
            }
            {balanceHistoryEmptyState}
            </ScrollView>
            </View>
        );
    }

    private _renderBalanceHistoryComponent(date: string, action: string , bankName: string, shoeName: string,accountNumber: string, amount: number, prevBalance?: number, status?: string): JSX.Element{
        let amountStyle = {color: themes.LightGreenBlue};
        let title =`${strings.Sell} ${shoeName}`
        if(action && action === BalanceHistoryAction.WITHDRAW){
            if(status === BalanceHistoryStatus.PROCESSING){
                status = `- ${strings.Processing}`
            }
            amountStyle = {color: themes.AppPrimaryColor}
            amount *= -1
            title = `${strings.Deposit} ${bankName} (${accountNumber})`

        }

        const convertedAmount = amount ? amount.toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
          }) : undefined;
       
        const convertedPrevBalance = prevBalance? prevBalance.toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
        }): "";
      
        return (
            <View style={styles.balanceHistoryComponentContainer}>
                <View style={styles.captionContainer}>
                    <AppText.Caption1 style={styles.balanceHistoryComponentDateContainer}>{date}</AppText.Caption1>
                    <AppText.Caption1 style={styles.balanceHistoryComponentStatusContainer}>{status}</AppText.Caption1>
                </View>
                <View style={styles.balanceHistoryComponentBodyContainer}>
                    <AppText.Body style={styles.balanceHistoryComponentTitleContainer}>{title}</AppText.Body>
                    <View style = {styles.balanceHistoryComponentStatsContainer}>
                        <AppText.Body style={{...styles.balanceHistoryComponentAmountContainer, ...amountStyle}}>{convertedAmount}</AppText.Body>
                        <AppText.FootnoteRegular style={styles.balanceHistoryComponentPrevBalanceContainer}>{convertedPrevBalance}</AppText.FootnoteRegular>
                    </View>
                 </View>
            </View>
        );
    }

    private _renderWithdrawalInformationForm(){
        return(
            <View>
                <View>
                {this._renderWithdrawalInputComponent(strings.Amount,'', "withdrawalAmount","formattedWithdrawalAmount")}
                {this._renderWithdrawalInputComponent(strings.Bank,'Ví dụ: Techcombank', 'bankName')}
                {this._renderWithdrawalInputComponent(strings.AccountNumber,'6 đến 9 chữ số', "accountNumber" )}
                {this._renderWithdrawalInputComponent(strings.AccountHolderName,'Ví dụ: Chu Việt Dũng', "accountHolderName")}
                </View>
            </View>
        );
    }

    private _renderWithdrawalInputComponent(fieldName: string, placeHolder: string, stateProps: any, formatedStateProps?: any){
        return(
            <View style={styles.inputContainer}>
                <AppText.SubHeadline style={styles.inputTitleTextStyle}>{fieldName}</AppText.SubHeadline>
                <View style={styles.inputStyle}>
                    <TextInput placeholder={placeHolder}  style={styles.inputStyleTest} editable={formatedStateProps? false : true} value={ this.state[formatedStateProps] ? this.state[formatedStateProps] : this.state[stateProps]} onEndEditing={() => this._handleOnEndEditingInput(stateProps,formatedStateProps)} onChangeText={(text) => {this._handleOnChangeInput(text,stateProps,formatedStateProps)}}>
                    </TextInput>
                </View>
            </View>
        );
    }

    private _handleOnChangeInput( text: string, stateProps: any ,formatedStateProps?: any){
        let newState  =  {[stateProps]: text} as Pick<State, keyof State>;
        if(formatedStateProps){
            newState = {...newState,[formatedStateProps]:text} as Pick<State, keyof State>;
        }
        this.setState(newState);
    }

    private _handleOnEndEditingInput( stateProps: any,formatedStateProps?: any){
        if(formatedStateProps){
            const statePropsValue = parseInt(this.state[formatedStateProps]);
            this.setState({[stateProps]:statePropsValue} as Pick<State, keyof State>);
            const formattedString =  statePropsValue.toLocaleString('vi', {
                style: 'currency',
                currency: 'VND',
            });
            const newState = {[formatedStateProps]: formattedString} as Pick<State, keyof State>; 
            this.setState(newState);
        }
        
    }

    private _renderBottomButton(title: string){
        return(
            <BottomButton title={title} style={styles.bottomButtonStyle} onPress={() => {this._handleButtonOnPress()}}></BottomButton>
        );
    }

    private async _handleButtonOnPress(){
        const {currentScreen} = this.state;
        const shouldContinue = this.childComponents[currentScreen].canProceed();
        if(currentScreen === Screen.PAYMENT_INFO){
            if(shouldContinue){
                try{
                    await this._handleConfirmPaymentInfo();
                    Alert.alert(strings.MoneyIsProcessing);
                }catch(error){
                    Alert.alert(strings.MoneyIsProcessingContactingWithSneakGeek)
                }
                this.setState({currentScreen: this.state.currentScreen-1,}, () => {
                    this._childFlatList.scrollToIndex({
                        index: this.state.currentScreen,
                        animated: true,
                      });
                })
            }
            else{
                if(this.state.currentBalance === 0)
                    Alert.alert(strings.NoMoneyInSneakGeekWallet)
                if(this.state.withdrawalAmount > this.state.currentBalance)
                    Alert.alert(strings.CannotWithdrawalMoreThanCurrentBalance)
                else{
                    Alert.alert(strings.PleaseProvideAllInformation)
                }
                   
            }
        }
        const canGoNext = currentScreen < this.childComponents.length-1;
        if(canGoNext){
            const nextIndex = currentScreen + 1;
            this.setState({currentScreen:nextIndex}, () => {
                this._childFlatList.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                  });
            });
        }
    }

    private async _handleConfirmPaymentInfo(){
        const {withdrawalAmount, bankName, accountNumber, accountHolderName} = this.state;
        return await this._accountService.createProcessingWithdrawal(getToken(), withdrawalAmount, bankName,accountNumber,accountHolderName);
    }
}