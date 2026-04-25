import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import {
  Registration,
  RegistrationDocument,
} from './schemas/registration.schema';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Registration.name)
    private readonly registrationModel: Model<RegistrationDocument>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    const createdRegistration = await this.registrationModel.create({
      ...createRegistrationDto,
      dateOfBirth: new Date(createRegistrationDto.dateOfBirth),
    });

    return createdRegistration;
  }

  async findAll() {
    return this.registrationModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Registration record not found');
    }

    const registration = await this.registrationModel.findById(id).lean();

    if (!registration) {
      throw new NotFoundException('Registration record not found');
    }

    return registration;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Registration record not found');
    }

    const deletedRegistration = await this.registrationModel.findByIdAndDelete(id);

    if (!deletedRegistration) {
      throw new NotFoundException('Registration record not found');
    }

    return { message: 'Registration deleted successfully' };
  }
}
