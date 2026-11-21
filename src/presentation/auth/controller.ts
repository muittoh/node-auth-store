import { Request, Response } from "express";
import { LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services";
import { CustomError } from "../../domain";

export class AuthController {

  //DI
  constructor(
    public readonly authService: AuthService,
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ err });
    }

    // console.log(`${err}`);
    return res.status(500).json({ err: 'Internal server error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [err, registerDto] = RegisterUserDto.create(req.body);
    if (err) return res.status(400).json({ err });

    this.authService.registerUser(registerDto!)
      .then(user => res.json(user))
      .catch(err => this.handleError(err, res));
  }

  loginUser = (req: Request, res: Response) => {
    const [err, loginUserDto] = LoginUserDto.create(req.body);
    if (err) return res.status(400).json({ err });

    this.authService.loginUser(loginUserDto!)
      .then(user => res.json(user))
      .catch(err => this.handleError(err, res));
  }

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    res.json(token);
  }
}