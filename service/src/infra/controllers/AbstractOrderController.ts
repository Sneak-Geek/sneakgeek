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
    var buyerSubject = "";
    var adminSubject = "";
    var adminText = `Order number ${orderId} status has been changed to ${status}`;
    let sellerText = `Order number ${orderId} status has been changed to ${status}`;
    var sellerSubject = "";

    if (status === TrackingStatus.WAITING_FOR_BANK_TRANSFER) {
      buyerSubject = "[SneakGeek] Đơn hàng khởi tạo thành công";
      buyerText = `Đơn hàng của bạn đã được khởi tạo thành công:
                    Mã đơn hàng: ${orderId}
                    Sản phẩm: ${inventory.shoeInfo.name}
                    Size: ${inventory.shoeSize}
                    Đơn giá: ${inventory.sellPrice}
                    Quý khách vui lòng chuyển khoản theo thông tin trên ứng dụng trong vòng 12h để hoàn tất đơn hàng.
                    
                    SneakGeek Team`;
      adminSubject = `Đơn hàng ${orderId} được khởi tạo`;
      adminText = `Đơn hàng mới ${orderId} đc khởi tạo, check xem đã nhận được tiền trong tài khoản ngân hàng chưa?
                   Tên người mua: ${buyer.userProvidedName}
                   Thông tin sản phẩm: 
                      Tên giày: ${inventory.shoeInfo.name}
                      Size: ${inventory.shoeSize}
                   Số tiền: ${inventory.sellPrice}`;
    }
    if (status === TrackingStatus.RECEIVED_BANK_TRANSFER) {
      buyerSubject = "[SneakGeek] Đơn hàng được hoàn tất";
      buyerText = `Đơn hàng ${orderId} của bạn đã được hoàn tất. 
                   Sản phẩm sẽ được SneakGeek chuyển đến cho bạn trong thời gian sớm nhất.
                   Cảm ơn bạn đã mua hàng trên SneakGeek.
                   
                   SneakGeek Team`;
      sellerSubject = "[SneakGeek] Thông báo đơn hàng mới";
      sellerText = `Mã đơn hàng: ${orderId}
                    Sản phẩm: ${inventory.shoeInfo.name}
                    Size: ${inventory.shoeSize}
                    Đơn giá: ${inventory.sellPrice}
                    Cửa hàng vui lòng xác nhận và chuyển đơn hàng đến địa chỉ: ${buyer.userProvidedAddress}
                    Trân trọng cảm ơn!
                    
                    SneakGeek team`;
    } else if (status === TrackingStatus.NOT_RECEIVED_BANK_TRANSFER) {
      buyerSubject = "[SneakGeek] Đơn hàng chưa được hoàn tất";
      buyerText = `Đơn hàng ${orderId} của bạn đã chưa được hoàn tất do thanh toán chưa được xác nhận thành công trong 12h. 
                   Đơn hàng sẽ được hủy.
                   Quý khách vui lòng liên hệ qua email: support@sneakgeek.io để nhận hỗ trợ. 
                   Xin cảm ơn!
                    
                   SneakGeek Team`;
    } else if (status === TrackingStatus.SELLER_APPROVED_ORDER) {
      var deadline = new Date();
      deadline.setHours(deadline.getHours() + 48);
      adminSubject = `Seller đã approve đơn hàng ${orderId}`;
      adminText = `Seller đã approved đơn hàng. Seller sẽ chuyển hàng cho SneakGeek trong vòng 48h. 
                   Đơn hàng: ${orderId}
                   Thông tin sản phẩm: 
                    Tên giày: ${inventory.shoeInfo.name}
                    Size: ${inventory.shoeSize}
                   Hạn nhận hàng: ${deadline.getDay()}/${deadline.getMonth()}/${deadline.getFullYear()}`;
    } else if (
      status === TrackingStatus.SELLER_REJECTED_ORDER ||
      status === TrackingStatus.SHOE_UNQUALIFIED
    ) {
      buyerSubject = "[SneakGeek] Đơn hàng bị từ chối";
      buyerText = `Thông báo đơn hàng bị từ chối.
                   Người bán đã từ chối đơn hàng ${orderId}
                   Đơn hàng đã bị hủy. 
                   Quý khách lưu ý cập nhật thông tin đơn hàng liên tục trên nền tảng để tránh trường hợp hủy đơn hàng xảy ra trong tương lai. 
                   Việc hủy đơn hàng nếu diễn ra nhiều có thể ảnh hưởng đến mức phí bán hàng quý khách hàng phải chi trả.

                   SneakGeek Team`;
    } else if (status === TrackingStatus.DELIVERING_TO_BUYER) {
      //TODO: Mình có tracking number ko?
      //buyerText = `Your order has been shipped!`;
      //sellerText = `Order #${orderId} is being sent to buyer. The order status is ${status}.`!;
    } else if (status === TrackingStatus.BUYER_RECEIVED) {
      sellerSubject = "[SneakGeek] Hàng đã chuyển đến người mua";
      sellerText = `Mọi thông tin cần hỗ trợ quý khách vui lòng liên hệ qua email: support@sneakgeek.io.
                   Xin cảm ơn!

                   SneakGeek Team`;
      buyerSubject = "[SneakGeek] Cảm ơn quý khách đã mua hàng";
      buyerText = `Cảm ơn quý khách đã mua hàng trên nền tảng SneakGeek. 
                   Mọi thông tin cần hỗ trợ quý khách vui lòng liên hệ qua email: support@sneakgeek.io.
                   Xin cảm ơn!

                   SneakGeek Team`;
    }
    if (status === TrackingStatus.SHOE_UNQUALIFIED) {
      sellerSubject = "[SneakGeek] Giày không đạt chất lượng";
      sellerText = `Hàng đang được gửi trả cho quý khách.
                    Đơn hàng: ${orderId}
                    Thông tin sản phẩm: 
                      Tên giày: ${inventory.shoeInfo.name}
                      Size: ${inventory.shoeSize}
                    Mọi thông tin cần hỗ trợ quý khách vui lòng liên hệ qua email: support@sneakgeek.io.
                    Xin cảm ơn!

                    SneakGeek Team`;
    }
    const notiEmail = [];
    if (adminSubject !== "") {
      notiEmail.push(
        this.emailService.notifyUser("ntduc97@gmail.com", adminSubject, adminText)
      );
    }
    if (buyerSubject !== "") {
      notiEmail.push(this.emailService.notifyUser(buyerEmail, buyerSubject, buyerText));
    }
    if (sellerSubject !== "") {
      notiEmail.push(this.emailService.notifyUser(sellerEmail, sellerSubject, sellerText));
    }
    await Promise.all(notiEmail);
  }
}
