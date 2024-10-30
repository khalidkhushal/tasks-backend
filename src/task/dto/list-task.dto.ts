import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"
import { Status } from "../enums/status.enum"
import { Priority } from "../enums/priority.enum"

export class ListTaskDto {

    @IsString()
    @IsOptional()
    from: string

    @IsString()
    @IsOptional()
    to: string

    @IsString()
    @IsOptional()
    text: string

    @IsEnum(Status)
    @IsOptional()
    status: Status

    @IsEnum(Priority)
    @IsOptional()
    priority: Priority

    @IsBoolean()
    @IsOptional()
    isActive: boolean

}
