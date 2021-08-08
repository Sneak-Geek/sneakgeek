// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import * as HttpStatus from "http-status";
import { controller, httpPost, httpGet, request, response } from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import { inject } from "inversify";
import { FirebaseAuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import { body } from "express-validator";
import { Repository, SupportTicket, SupportTicketCategory } from "../database";
import { ObjectId } from "mongodb";

@controller("/api/v1/support")
export class SupportTicketController {
  @inject(Types.SupportTicketRepository)
  private readonly supportTicketRepo!: Repository<SupportTicket>;

  @httpGet("/")
  public async getAllSupportTickets(@response() res: Response) {
    try {
      const tickets = await this.supportTicketRepo.find().exec();

      return res.status(HttpStatus.OK).send({
        tickets: tickets,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpPost(
    "/",
    FirebaseAuthMiddleware,
    body("category").isIn(Object.keys(SupportTicketCategory)),
    body("description").isString(),
    body("imageUrls").optional().isArray,
    body("imageUrls[*]").optional().isURL(),
    ValidationPassedMiddleware
  )
  public async createSupportTicketAsync(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const { category, description, imageUrls } = req.body;
      const userId = req.user._id;
      let newTicket: SupportTicket = await this.supportTicketRepo.create({
        category: category,
        description: description,
        imageUrls: imageUrls || [],
        requestedBy: new ObjectId(userId),
      });

      return res.status(HttpStatus.OK).send({
        message: "Create support ticket successfully!",
        ticket: newTicket,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }
}
