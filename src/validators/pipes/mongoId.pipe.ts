import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any) {
    try {
      new ObjectId(value);
    } catch (e) {
      throw new HttpException('Invalid id!', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
