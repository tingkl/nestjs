import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      if (value.roles[0]['id']) {
        value.roles = value.roles.map(role => role.id);
      }
    }
    return value;
  }
}
