class UserDTO {
  constructor(
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
    email,
    password,
    isAdmin,
    tokens,
    isActive,
  }: {
    email: string;
    password: string;
    isAdmin: boolean;
    tokens: string[];
    isActive: boolean;
  } = item;
  return new UserDTO(email, password, isAdmin, tokens, isActive);
};
