import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Status } from "../enums/status.enum"
import { Priority } from "../enums/priority.enum"

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    dueDate: string

    @IsString()
    @IsNotEmpty()
    details: string

    @IsEnum(Status)
    status: Status

    @IsEnum(Priority)
    priority: Priority

    @IsBoolean()
    @IsOptional()
    isActive: boolean

    @IsString()
    @IsOptional()
    createdAt: string

}
