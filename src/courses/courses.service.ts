// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Raw } from 'typeorm';
import { Course } from './course.entity';
import axios from 'axios';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // Crear un nuevo curso
  async createCourse(createCourseDto: {
    name: string;
    description?: string;
    professorId: string;
  }): Promise<Course> {
    const newCourse = this.courseRepository.create({
      ...createCourseDto,
      studentIds: [],
    });
    return await this.courseRepository.save(newCourse);
  }

  // Agregar un estudiante a un curso
  async addStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    // Asegurar que no se repita el estudiante
    if (!course.studentIds.includes(studentId)) {
      course.studentIds.push(studentId);
      await this.courseRepository.save(course);
      try {
        console.log('Creando encuesta social para el estudiante', studentId);
        console.log('y el curso', courseId);
        const defaultResponses = {"q1":[],"q2":[],"q3":[],"q4":[]}; // Opcional: respuestas por defecto
        await axios.post('http://localhost:3000/api/surveys/social', {
          studentId,
          courseId,
          responses: defaultResponses,
        });
      } catch (error: any) {
        console.error(
          'Error al crear la encuesta social:',
          error.response?.data || error.message,
        );
      }
    }
    return course;
  }

  // Quitar un estudiante de un curso
  async removeStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    course.studentIds = course.studentIds.filter((id) => id !== studentId);
    await this.courseRepository.save(course);
    return course;
  }

  // Obtener todos los cursos (opcional)
  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  // Método para obtener un curso por su ID
  async findCourseById(courseId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    return course;
  }

  // Método para obtener todos los cursos de un profesor
  async findCoursesByProfessorId(professorId: string): Promise<Course[]> {
    return await this.courseRepository.find({ where: { professorId } });
  }

  // Método para obtener todos los cursos de un estudiante
  async findCoursesByStudentId(studentId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: {
        studentIds: Raw((alias) => 
          `',' || ${alias} || ',' LIKE :studentId`, 
          { studentId: '%,' + studentId + ',%' }
        ),
      },
    });
  }


  
}
