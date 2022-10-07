class UserDTO {
  constructor(
    public _id: string,
    public email: string,
    public password: string,
    public isAdmin: boolean,
    public tokens: string[], //todo chance to Token type
    public isActive: boolean,
  ) {}
}

export default UserDTO;

export const convertItemToUserDTO = (item: any): UserDTO => {
  const {
    _id,
    email,
    password,
    isAdmin,
    tokens,
    isActive,
  }: {
    _id: string;
    email: string;
    password: string;
    isAdmin: boolean;
    tokens: string[];
    isActive: boolean;
  } = item;
  return new UserDTO(_id, email, password, isAdmin, tokens, isActive);
};
