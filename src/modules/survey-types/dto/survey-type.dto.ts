import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TemplateQuestionDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  options?: string[];
}

export class CreateSurveyTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateQuestionDto)
  @IsOptional()
  templateQuestions?: TemplateQuestionDto[];
}

export class UpdateSurveyTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateQuestionDto)
  @IsOptional()
  templateQuestions?: TemplateQuestionDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
