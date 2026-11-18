import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
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
    res.json('loginUser');
  }

  validateEmail = (req: Request, res: Response) => {
    res.json('validateEmail');
  }
}