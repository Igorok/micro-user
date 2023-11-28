import { userAnalysisDto } from 'micro-dto';

export type saveAnalysisDto = {
  id: string;
  analysis: userAnalysisDto;
  active?: boolean;
};

export type findActiveUserDto = {
  id?: string;
  login?: string;
};

export type generatedPasswordDto = {
  password: string;
  salt: string;
};

export type isMatchPasswordDto = {
  passwordTyped: string;
  salt: string;
  password: string;
};
