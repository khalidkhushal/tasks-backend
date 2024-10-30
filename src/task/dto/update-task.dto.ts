import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Status } from "../enums/status.enum"
import { Priority } from "../enums/priority.enum"

export class UpdateTaskDto {

    @IsString()
    @IsOptional()
    dueDate: string

    @IsString()
    @IsOptional()
    details: string

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
