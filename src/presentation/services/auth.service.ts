import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, UserEntity } from "../../domain";
import { RegisterUserDto } from "../../domain";

export class AuthService {

  // DI
  constructor() { }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);

      // encriptar cotraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

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

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('Password is not valid');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    return {
      user: userEntity,
      token: '123',
    }
  }
}