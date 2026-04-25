import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationService } from './registration.service';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new registration' })
  @ApiCreatedResponse({ description: 'Registration created successfully' })
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationService.create(createRegistrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all registrations' })
  @ApiOkResponse({ description: 'Registrations fetched successfully' })
  findAll() {
    return this.registrationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single registration by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Registration fetched successfully' })
  findOne(@Param('id') id: string) {
    return this.registrationService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete registration by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Registration deleted successfully' })
  remove(@Param('id') id: string) {
    return this.registrationService.remove(id);
  }
}
