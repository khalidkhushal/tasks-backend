import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    dueDate: string

    @Column()
    details: string

    @Column()
    status: string

    @Column()
    priority: string

    @Column()
    createdAt: string

    @Column()
    isActive: boolean
}
