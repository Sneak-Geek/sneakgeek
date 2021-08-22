import Server from "../../../Server";
import { Repository, UserProfile } from "../../database";
import { IProfileDao } from "./IProfileDao";
import { Types } from "../../../configuration/inversify";

describe("ProfileDao e2e test", () => {
  let profileDao: IProfileDao;
  let profileRepo: Repository<UserProfile>;

  beforeEach(async () => {
    await Server.initAppAsync();
    profileDao = Server.container.get<IProfileDao>(Types.ProfileDao);
    profileRepo = Server.container
      .get<Repository<UserProfile>>(Types.ProfileRepository);
  });

  // Clean up DB after each test
  afterEach(async () => {
    await profileRepo.deleteMany({})
  });

  it("createWithFirebaseAccountId", async () => {
    const firebaseAccountId = "abcd123";
    const userProvidedEmail = "test@gmail.com";

    await profileDao.createUserWithFirebaseAccountId({ firebaseAccountId, userProvidedEmail });
    const wantAccount = await profileRepo.findOne({ firebaseAccountId }).exec();

    expect(wantAccount).not.toBeUndefined();
    expect(wantAccount.userProvidedEmail).toBe(userProvidedEmail);
    expect(wantAccount.firebaseAccountId).toBe(firebaseAccountId);
  });
});