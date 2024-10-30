import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { ListTaskDto } from './dto/list-task.dto';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  filters?: {
    [key: string]: any;
  };
}


@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const data = new Task()
      data.name = createTaskDto.name
      data.details = createTaskDto.details
      data.status = createTaskDto.status
      data.priority = createTaskDto.priority
      data.dueDate = new Date(createTaskDto.dueDate).toISOString()
      data.createdAt = new Date().toISOString()
      data.isActive = createTaskDto.isActive || true
      const task = await this.taskRepository.save(data)
      return task;
    } catch(e){
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(page: number, pageSize: number, filters: ListTaskDto):Promise<{
    data: Task[],
    total: number,
    page: number,
    pageSize: number,
    pageCount: number
  }> {

    const list = await this.findWithPagination({page, pageSize,filters })
    return list
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return task
  }

  async findWithPagination(options: PaginationOptions = {}): Promise<{
    data: Task[],
    total: number,
    page: number,
    pageSize: number,
    pageCount: number
}> {
    const { page = 1, pageSize = 10, filters = {} } = options;
    const where: FindOptionsWhere<Task>[] = [];
    for (const key in filters) {

      if(key == "from" || key == "to"){
        if (filters.from && filters.dueDate.to) {
          where.push({
            dueDate:  MoreThanOrEqual(filters.from) && LessThanOrEqual(filters.to)
          })
        } else if (filters.from) {
          where.push({
            dueDate:  MoreThanOrEqual(filters.from)
          })
        } else if (filters.to) {
          where.push({
              dueDate:  LessThanOrEqual(filters.to)
          })
        }
      } else if(key == "text"){
        where.push(
          { name: ILike(`%${filters.text}%`) },
          { details: ILike(`%${filters.text}%`) }
        );
      } else {
        console.log("key", key)
        where.push({[key]: ILike(`%${filters[key]}%`)});
      }
    }

    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: tasks,
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<{message: string}> {
    const existing = await this.findOne(id)
    if(!existing) throw new Error("Record not found")

    updateTaskDto.dueDate = updateTaskDto.dueDate? new Date(updateTaskDto.dueDate).toISOString(): existing.dueDate
    
    const updated = {...existing, ...updateTaskDto} 
    const task = await this.taskRepository.update(id, updated)
    if( !task.affected)
      return { message: "Task Could not Update!"}
    else 
      return { message: "Task Updated" }
  }

  async remove(id: number): Promise<{message: string}> {
    const existing = await this.findOne(id)
    if(!existing)
        throw new HttpException("Not found!", HttpStatus.NOT_FOUND)
    const task = await this.taskRepository.delete({  id  });
    if(!task.affected)
      return {message: "Could not delete task"}
    return { message: "Deleted"}
  }
}
