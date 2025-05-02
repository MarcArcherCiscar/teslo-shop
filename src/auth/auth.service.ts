import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/handle-db-exceptions';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
      
    } catch (error) {
      console.log(error);
      handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    //try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true }
      });

      if (!user) throw new UnauthorizedException(`Credenciales no validas`);

      if (!bcrypt.compareSync( password, user.password )) throw new UnauthorizedException(`Credenciales no validas`);

      console.log('user', user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    //} catch (error) {
    //  handleDBExceptions(error);
   // }
  }

  private getJwtToken( payload: JwtPayload ) {
    console.log('JWT TOKEN', payload);
    const token = this.jwtService.sign(payload);
    return token;
  }

}
