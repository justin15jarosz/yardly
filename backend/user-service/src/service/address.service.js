import UserRepository from "../repository/user.repository.js";
import AddressRepository from "../repository/address.repository.js";
import ExceptionFactory from "../exceptions/exception.factory.js";
import { NotFoundException } from "../exceptions/specialized.exception.js";

class AddressService {
    static async createAddress(addressRequest) {
        try {
            const user = await UserRepository.findByEmail(addressRequest.email);
            ExceptionFactory.throwIf(!user, NotFoundException, `Unable to find user with email: ${addressRequest.email}`)

            const addresses = await AddressRepository.getAddressesByUserId(user.user_id);
            console.log(`Addresses found: ${JSON.stringify(addresses)}`);
            const is_primary = addresses.length === 0 ? true : false;
            return await AddressRepository.create(user.user_id, addressRequest, is_primary);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Handle other errors
            console.error("Internal Service Error:", error);
            await ExceptionFactory.throw(BaseException, `${error}`);
        }
    }
}

export default AddressService;