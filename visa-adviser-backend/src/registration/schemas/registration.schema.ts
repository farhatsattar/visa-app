import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaritalStatus } from '../dto/create-registration.dto';

export type RegistrationDocument = HydratedDocument<Registration>;

@Schema({ timestamps: true })
export class Registration {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  fatherOrHusbandName: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  whatsappNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, enum: MaritalStatus })
  maritalStatus: MaritalStatus;

  @Prop({ required: true, min: 0, default: 0 })
  children: number;

  @Prop({ type: [String], required: true, default: [] })
  countriesVisited: string[];

  @Prop({ type: [String], default: [] })
  rejectedVisaCountries: string[];

  @Prop({ type: [String], default: [] })
  visaApprovedButNotVisitedCountries: string[];
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
