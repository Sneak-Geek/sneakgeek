import { inject, injectable } from "inversify";
import { TrackingStatus } from "../../assets/constants";
import { Types } from "../../configuration/inversify";
import { IInventoryDao, IProfileDao } from "../dao";
import { Order } from "../database";
import { IEmailService } from "../services";

@injectable()
export abstract class AsbtractOrderController {
  @inject(Types.ProfileDao)
  protected readonly profileDao!: IProfileDao;

  @inject(Types.EmailService)
  protected readonly emailService!: IEmailService;

  @inject(Types.InventoryDao)
  protected readonly inventoryDao!: IInventoryDao;

  public async notifyByEmail(order: Order, status: TrackingStatus): Promise<void> {
    const { buyerId, inventoryId } = order;

    const inventory = await this.inventoryDao.findById((inventoryId as unknown) as string);
    const [buyer, seller] = await Promise.all([
      this.profileDao.findById(buyerId),
      this.profileDao.findById(inventory.sellerId),
    ]);
    const buyerEmail = buyer.userProvidedEmail,
      sellerEmail = seller.userProvidedEmail;

    const orderId = order._id;

    // TO DO: Ask anh Dai to come up with the messages sending to buyers/sellers/admin
    let buyerText = "";
    const subject = `Your SneakGeek Order Status Update`;
    const adminText = `Order number ${orderId} status has been changed to ${status}`;
    let sellerText = `Order number ${orderId} status has been changed to ${status}`;

    if (status === TrackingStatus.RECEIVED_BANK_TRANSFER) {
      buyerText = `Your order has been placed. The confirmation code is ${orderId}`;
    } else if (
      status === TrackingStatus.NOT_RECEIVED_BANK_TRANSFER ||
      status === TrackingStatus.SELLER_REJECTED_ORDER ||
      status === TrackingStatus.SHOE_UNQUALIFIED
    ) {
      buyerText = `Your order has been cancelled due to ....`;
    } else if (status === TrackingStatus.DELIVERING_TO_BUYER) {
      buyerText = `Your order has been shipped!`;
      sellerText = `Order #${orderId} is being sent to buyer. The order status is ${status}.`!;
    } else if (status === TrackingStatus.BUYER_RECEIVED) {
      buyerText = `Your order has been delivered!`;
      sellerText = `Buyer has received order #${orderId}`!;
    }

    if (status === TrackingStatus.SHOE_UNQUALIFIED)
      sellerText = `Order ${orderId} does not meet our condition guidelines. It will be sent back to the sender.`;

    await Promise.all([
      this.emailService.notifyUser("ntduc97@gmail.com", subject, adminText),
      this.emailService.notifyUser(buyerEmail, subject, buyerText),
      this.emailService.notifyUser(sellerEmail, subject, sellerText),
    ]);
  }
}
