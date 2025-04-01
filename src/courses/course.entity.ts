// src/courses/course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // ID del profesor que imparte el curso
  @Column()
  professorId: string;

  // Lista de IDs de estudiantes inscritos
  @Column("simple-array", { nullable: true })
  studentIds: string[];
}
