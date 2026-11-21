import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, LoginUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {

  // DI
  constructor(
    // DI - email service
    private readonly emailService: EmailService,
  ) { }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);

      // encriptar cotraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      // email de confirmación
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      return {
        user: userEntity,
        token: token,
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

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }
  }

  private sendEmailValidationLink = async (email: string) => {

    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Válida tu correo electrónico</h1>
      <p>Haz clic en el enlace para válidar tu correo</p>
      <a href="${link}">Válida tu correo: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Válida tu correo electrónico',
      htmlBody: html
    }

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  }
}