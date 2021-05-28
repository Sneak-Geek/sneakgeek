import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import {AppText, BottomButton, Header} from 'screens/Shared';
import {toCurrencyString} from 'utilities';
import {useNavigation} from '@react-navigation/native';
import {images} from 'resources';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingBottom: 35,
  },
  orderIdContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    alignItems: 'center',
  },
  textBoxContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  sectionHeader: {
    paddingTop: 14.5,
    paddingBottom: 14.5,
    backgroundColor: 'rgba(30,35,48,0.1)',
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingTop: 12,
  },
  bankInfoHeaderContainer: {
    paddingLeft: 20,
    marginBottom: 8,
  },
  textAndCopyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtonContainer: {
    height: 52,
    backgroundColor: '#1E2330',
    borderRadius: 40,
    zIndex: 1,
    marginBottom: 35,
  },
  copyButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  copyIconContainer: {
    width: 19,
    height: 22,
    marginRight: 8,
  },
});

enum BankInfoComponentType {
  TEXT_ONLY = 1,
  TEXT_AND_COPY_BUTTON = 2,
}

export const Payment: React.FC<any> = ({route}) => {
  const {navigate} = useNavigation();
  const {sellPrice, orderId} = route.params;
  return (
    <SafeAreaView style={styles.root}>
      <Header topInset={1} title={'Thông tin chuyển khoản'} leftIcon={false} />
      <ScrollView>
        <View style={styles.orderIdContainer}>
          <AppText.SubHeadline>Mã giao dịch</AppText.SubHeadline>
          <AppText.Headline>{orderId}</AppText.Headline>
        </View>
        <BankInfo orderId={orderId} sellPrice={sellPrice} />
        <TransferInstruction sellPrice={sellPrice} />
      </ScrollView>
      <BottomButton
        title={'Xác nhận chuyển khoản'.toUpperCase()}
        style={styles.bottomButtonContainer}
        onPress={() => {
          navigate('OrderConfirmation');
        }}
      />
    </SafeAreaView>
  );
};

type BankInfoProp = {
  orderId: string;
  sellPrice: number;
};

const BankInfo: React.FC<BankInfoProp> = (props: BankInfoProp) => {
  const {orderId, sellPrice} = props;
  const components: Array<BankInfoComponentProp> = [
    {
      type: BankInfoComponentType.TEXT_ONLY,
      header: 'Chi nhánh ngân hàng',
      content: 'Ngân hàng TMCP Việt Nam thịnh vương (VPBank)',
    },
    {
      type: BankInfoComponentType.TEXT_AND_COPY_BUTTON,
      header: 'Số tài khoản',
      content: '19024705183012',
    },
    {
      type: BankInfoComponentType.TEXT_ONLY,
      header: 'Tên tài khoản',
      content: 'Trần Quang Đại',
    },
    {
      type: BankInfoComponentType.TEXT_ONLY,
      header: 'Giá trị chuyển',
      content: toCurrencyString(sellPrice),
    },
    {
      type: BankInfoComponentType.TEXT_AND_COPY_BUTTON,
      header: 'Nội dung chuyển tiền',
      content: `Thanh toán SneakGeek + ${orderId}`,
    },
  ];

  return (
    <View>
      <View style={[styles.textBoxContainer, styles.sectionHeader]}>
        <AppText.SubHeadline> THÔNG TIN NGÂN HÀNG</AppText.SubHeadline>
      </View>
      <View style={styles.sectionContainer}>
        {components.map((c) => {
          return (
            <BankInfoComponent
              key={c.header}
              type={c.type}
              content={c.content}
              header={c.header}
              orderId={c.orderId}
            />
          );
        })}
      </View>
    </View>
  );
};

type BankInfoComponentProp = {
  orderId?: string;
  type: BankInfoComponentType;
  header: string;
  content: string;
};

const BankInfoComponent: React.FC<BankInfoComponentProp> = (
  props: BankInfoComponentProp,
) => {
  const {orderId, type, header, content} = props;
  let component = <View />;

  switch (type) {
    case BankInfoComponentType.TEXT_ONLY:
      component = (
        <View style={[styles.textBoxContainer]}>
          <AppText.Body>{content}</AppText.Body>
        </View>
      );
      break;
    case BankInfoComponentType.TEXT_AND_COPY_BUTTON:
      component = (
        <View
          style={[styles.textBoxContainer, styles.textAndCopyButtonContainer]}>
          <AppText.Body style={{maxWidth: 355}}>{content}</AppText.Body>
          <CopyButton text={content} />
        </View>
      );
      break;
    default:
      break;
  }

  return (
    <View>
      <View style={[styles.bankInfoHeaderContainer]}>
        <AppText.Footnote>{header.toUpperCase()}</AppText.Footnote>
      </View>
      {component}
    </View>
  );
};

type CopyButtonProp = {
  text: string;
};

const CopyButton: React.FC<CopyButtonProp> = (props: CopyButtonProp) => {
  const {text} = props;

  const copyToClipboard = () => {
    Clipboard.setString(text);
  };

  return (
    <TouchableOpacity
      onPress={copyToClipboard}
      style={styles.copyButtonContainer}>
      <Image source={images.CopyIcon} style={styles.copyIconContainer} />
      <AppText.Headline style={{color: '#E2603F'}}>COPY</AppText.Headline>
    </TouchableOpacity>
  );
};

type TransferInstructionProp = {
  sellPrice: number;
};

const TransferInstruction: React.FC<TransferInstructionProp> = (
  props: TransferInstructionProp,
) => {
  const {sellPrice} = props;
  const instructions = [
    {
      key: 1,
      content: 'Bấm nút xác nhận chuyển khoản',
    },
    {
      key: 2,
      content: `Trong vòng 30 phút kể từ khi bấm nút xác nhận, bạn hãy chuyển ${toCurrencyString(
        sellPrice,
      )} vào TKNH bên trên kèm theo nội dung chuyển tiền như hướng dẫn.`,
    },
    {
      key: 3,
      content:
        'SneakGeek Team sẽ check giao dịch và thông báo nếu như đặt hàng thành công/thất bại',
    },
  ];
  return (
    <View style={{marginBottom: 70}}>
      <View style={[styles.textBoxContainer, styles.sectionHeader]}>
        <AppText.SubHeadline>Hướng dẫn chuyển khoản</AppText.SubHeadline>
      </View>
      <View style={styles.sectionContainer}>
        {instructions.map((i) => (
          <View style={[styles.textBoxContainer]}>
            <AppText.Body>{i.key}.</AppText.Body>
            <AppText.Body> {i.content}</AppText.Body>
          </View>
        ))}
      </View>
    </View>
  );
};
