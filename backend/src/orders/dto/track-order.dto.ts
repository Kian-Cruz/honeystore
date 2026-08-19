import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";

export class TrackOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  orderNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;
}