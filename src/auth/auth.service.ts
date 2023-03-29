import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'sequelize-typescript';
import { CheckUserDto } from './dto/check-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async checkAuthUser(checkUser: CheckUserDto) {
    const { email, password } = checkUser;

    const user = await this.checkUserEmail(email);

    if (!user) {
      throw new ForbiddenException('Wrong login/password combination!');
    }

    const isMatch = await this.checkHashPassword(password, user);

    if (!isMatch) {
      throw new ForbiddenException('Wrong login/password combination!');
    }

    const token = await this.generateToken(user);

    return token;
  }

  async checkUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return user;
  }

  async getOneUser(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      include: { all: true },
    });

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: { all: true },
    });

    return users;
  }

  async createUser(email: string, password: string) {
    const hashPassword = await this.hashPassword(password);

    const user = await this.userRepository.create({
      email,
      password: hashPassword,
    });

    return user;
  }

  async updateUser(email: string, password: string, id: number) {
    await this.userRepository.update(
      { email, password },
      { where: { user_id: id } },
    );
  }

  async removeUser(id: number) {
    await this.userRepository.destroy({
      where: {
        user_id: id,
      },
      force: true,
    });

    return true;
  }

  private async generateToken(user: User) {
    const { user_id, email, roles } = user;

    const payload = { user_id, email, roles };

    const token = this.jwtService.sign(payload);

    return token;
  }

  private async hashPassword(password: string) {
    const saltRounds = process.env.SALT_ROUNDS;

    const salt = await bcrypt.genSalt(parseInt(saltRounds));

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  private async checkHashPassword(password: string, user: User) {
    return await bcrypt.compare(password, user.password);
  }
}
