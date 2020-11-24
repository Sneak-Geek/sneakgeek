import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  makeStyles,
  Card,
  CardContent,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@material-ui/core';
import {
  ObjectFactory,
  IAccountService,
  BalanceHistory,
  FactoryKeys,
  BalanceHistoryStatus,
} from 'business';
import { getToken } from 'utilities';
import theme from 'theme';

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
  margin: {
    margin: theme.spacing(1),
  },
}));

const WithdrawalTableContent = (props: { withdrawals: BalanceHistory[] }): JSX.Element => {
  const setWithdrawalStatus = async (
    status: BalanceHistoryStatus,
    balanceHistoryId: string,
  ) => {
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService,
    );
    const token = getToken();
    await accountService.updateWithdrawalStatusForAdmin(token, status, balanceHistoryId);
  };

  const classes = useStyles();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Tên chủ tài khoản</TableCell>
          <TableCell align="center">Số tài khoản</TableCell>
          <TableCell align="center">Ngân hàng</TableCell>
          <TableCell align="center">Ngày tạo lệnh</TableCell>
          <TableCell align="center">Trạng thái</TableCell>
          <TableCell align="center">Xét duyệt</TableCell>
        </TableRow>
        {props.withdrawals.map((withdrawal: BalanceHistory) => {
          return (
            <TableRow>
              <TableCell align="center">{withdrawal.bankingInfo?.accountHolderName}</TableCell>
              <TableCell align="center">{withdrawal.bankingInfo?.accountNumber}</TableCell>
              <TableCell align="center">{withdrawal.bankingInfo?.bankName}</TableCell>
              <TableCell align="center">{withdrawal.createdAt}</TableCell>
              <TableCell align="center">{withdrawal.status}</TableCell>
              <TableCell align="center">
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setWithdrawalStatus(BalanceHistoryStatus.SUCCEEDED, withdrawal._id);
                  }}
                >
                  Đã chuyển
                </Button>
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setWithdrawalStatus(BalanceHistoryStatus.FAILED, withdrawal._id);
                  }}
                >
                  Từ chối
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableHead>
    </Table>
  );
};

const WithdrawalTable = (): JSX.Element => {
  const classes = useStyles();
  const [withdrawals, setWithdrawals] = useState(new Array<BalanceHistory>());

  const fetchProcessingWithdrawals = async () => {
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService,
    );
    const token = getToken();
    const withdrawals = await accountService.getBalanceHisotiresForAdmin(token);
    if (withdrawals) {
      setWithdrawals(withdrawals);
    }
  };

  useEffect(() => {
    fetchProcessingWithdrawals();
  }, []);

  return (
    <div>
      <Typography variant={'h2'} className={classes.title}>
        Tất cả lệnh rút tiền
      </Typography>
      <Card>
        <CardContent className={classes.content}>
          <WithdrawalTableContent withdrawals={withdrawals} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalTable;
