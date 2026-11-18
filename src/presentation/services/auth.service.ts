import { UserModel } from "../../data";
import { CustomError, UserEntity } from "../../domain";
import { RegisterUserDto } from "../../domain";

export class AuthService {

  // DI
  constructor() { }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      // encriptar cotraseña

      // JWT - para mantener la autenticación del usuario

      // email de confirmación

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token: '123',
      };
    } catch (err) {
      throw CustomError.internalServer(`${err}`);
    }
  }
}