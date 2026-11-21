import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;
// type TokenDuration = number | `${number}${'s' | 'm' | 'h' | 'd'}`; // alternativa a SignOptions

export class JwtAdapter {

  // DI?

  static async generateToken(payload: any, duration: SignOptions['expiresIn'] = '2h') {

    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      });
    })
  }

  static async validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    })
  }
}