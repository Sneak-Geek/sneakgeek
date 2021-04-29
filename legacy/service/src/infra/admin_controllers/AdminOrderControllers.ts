import { Request, Response } from "express";
import httpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  request,
  requestParam,
  response,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify";
import { IOrderDao } from "../dao";
import {
  AdminPermissionMiddleware,
  AuthMiddleware,
  ValidationPassedMiddleware,
} from "../middlewares";

@controller("/api/v1/orders")
export class AdminOrderController {
  public constructor(@inject(Types.OrderDao) private orderDao: IOrderDao) {}

  // Get all pending orders
  @httpGet("/", AuthMiddleware, AdminPermissionMiddleware, ValidationPassedMiddleware)
  public async getOrders(@request() req: Request, @response() res: Response) {
    // required range
    let range = req.query.range;
    if (!range) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Range is required",
      });
    }
    const [start, end] = JSON.parse(range as string);
    let [orders, total] = await Promise.all([
      this.orderDao.getAllPendingOrders(parseInt(start, 10), parseInt(end, 10)),
      this.orderDao.getPendingOrdersCount(),
    ]);

    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("X-Total-Count", `${total}`);

    const returnOrders = orders.map((o) => Object.assign({ id: o._id }, o));

    return res.status(httpStatus.OK).json(returnOrders);
  }

  @httpGet(
    "/:orderId",
    AuthMiddleware,
    AdminPermissionMiddleware,
    ValidationPassedMiddleware
  )
  public async getOrderById(
    @requestParam("orderId") orderId: string,
    @response() res: Response
  ) {
    if (!orderId) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "orderId is required",
      });
    }

    const order = await this.orderDao.getOrderById(orderId);

    return res.status(httpStatus.OK).json({
      ...order,
      id: order._id,
    });
  }
}
