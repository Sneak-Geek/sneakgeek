import { Request, Response } from "express";
import { param, query } from "express-validator";
import httpStatus from "http-status";
import { body } from "express-validator";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  request,
  requestParam,
  response,
  httpPut,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify";
import { IOrderDao } from "../dao";
import {
  AdminPermissionMiddleware,
  AuthMiddleware,
  ValidationPassedMiddleware,
} from "../middlewares";
import { TrackingStatus } from "../../assets/constants";
import { Order } from "../database/Order";

@controller("/api/v1/orders")
export class AdminOrderController {
  public constructor(@inject(Types.OrderDao) private orderDao: IOrderDao) {}

  // Get all pending orders
  @httpGet(
    "/",
    query("range").exists(),
    AuthMiddleware,
    AdminPermissionMiddleware,
    ValidationPassedMiddleware
  )
  public async getOrders(@request() req: Request, @response() res: Response) {
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

    const returnOrders = orders.map((order) => this._getOrderWithAdminFormat(order));

    return res.status(httpStatus.OK).json(returnOrders);
  }

  @httpGet(
    "/:orderId",
    param("orderId").isMongoId(),
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

    return res.status(httpStatus.OK).json(this._getOrderWithAdminFormat(order));
  }

  @httpPut(
    "/:orderId",
    body("lastTrackingStatus").isIn(Object.keys(TrackingStatus)),
    AuthMiddleware,
    AdminPermissionMiddleware,
    ValidationPassedMiddleware
  )
  public async updateOrderByAdmin(
    @request() req: Request,
    @requestParam("orderId") orderId: string,
    @response() res: Response
  ) {
    if (!orderId) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "orderId is required",
      });
    }
    const { lastTrackingStatus } = req.body;
    try {
      let order = await this.orderDao.updateTrackingAndOrderStatus(
        orderId,
        lastTrackingStatus
      );
      if (!order) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Bad request!" });
      }

      // TODO: Email notification
      // Populating order data
      order = await this.orderDao.getOrderById(orderId);
      return res.status(httpStatus.OK).json(this._getOrderWithAdminFormat(order));
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  private _getOrderWithAdminFormat(order: Order) {
    return {
      ...order,
      id: order._id,
      lastTrackingStatus: this._getLastTrackingStatus(order),
    };
  }

  private _getLastTrackingStatus(order: Order) {
    if (order.trackingStatus.length === 0) {
      return undefined;
    }

    return order.trackingStatus[order.trackingStatus.length - 1].status;
  }
}
