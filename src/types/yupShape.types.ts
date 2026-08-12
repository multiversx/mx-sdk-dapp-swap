import { Schema } from 'yup';

export type Shape<Fields extends object> = {
  [Key in keyof Fields]: Schema<Fields[Key]>;
};
