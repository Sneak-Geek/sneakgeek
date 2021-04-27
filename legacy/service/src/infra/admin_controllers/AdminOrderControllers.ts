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
    const [start, pageSize] = JSON.parse(range as string);
    const orders = await this.orderDao.getAllPendingOrders(
      parseInt(start, 10),
      parseInt(pageSize)
    );

    return res.status(httpStatus.OK).json({
      data: orders,
    });
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
      data: order,
    });
  }
}
