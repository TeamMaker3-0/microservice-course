// src/courses/courses.controller.ts
import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Endpoint para crear un curso
  @Post()
  async createCourse(
    @Body() body: { name: string; description?: string; professorId: string },
  ): Promise<Course> {
    return this.coursesService.createCourse(body);
  }

  // Endpoint para agregar un estudiante a un curso
  @Post(':courseId/add-student')
  async addStudent(
    @Param('courseId') courseId: string,
    @Body() body: { studentId: string },
  ): Promise<Course> {
    return this.coursesService.addStudent(courseId, body.studentId);
  }

  // Endpoint para quitar un estudiante de un curso
  @Post(':courseId/remove-student')
  async removeStudent(
    @Param('courseId') courseId: string,
    @Body() body: { studentId: string },
  ): Promise<Course> {
    return this.coursesService.removeStudent(courseId, body.studentId);
  }

  // (Opcional) Endpoint para listar todos los cursos
  @Get()
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  // Endpoint para obtener un curso por su ID
  @Get('find-course/:courseId')
  async findCourseById(@Param('courseId') courseId: string): Promise<Course> {
    return this.coursesService.findCourseById(courseId);
  }

  // Endpoint para obtener los estudiantes inscritos en un curso dado su ID
  @Get(':courseId/students')
  async getStudents(@Param('courseId') courseId: string): Promise<string[]> {
    const course = await this.coursesService.findCourseById(courseId);
    // Se retorna la lista de IDs de estudiantes o un arreglo vacío si no hay ninguno
    return course.studentIds || [];
  }

  // Endpoint para obtener todos los cursos de un profesor
  @Get('getcourseprofessor/:professorId')
  async getCoursesByProfessorId(
    @Param('professorId') professorId: string,
  ): Promise<Course[]> {
    return this.coursesService.findCoursesByProfessorId(professorId);
  }

  // Endpoint para obtener todos los cursos de un estudiante
  @Get('getcoursestudent/:studentId')
  async getCoursesByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<Course[]> {
    return this.coursesService.findCoursesByStudentId(studentId);
  }
}
