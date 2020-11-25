import { Field, ObjectType } from "type-graphql";
import { User } from "../entity/User";

@ObjectType() //can return
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType() //can return
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
