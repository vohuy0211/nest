export class UserDTO {
  email: string;
  username: string;
  password: string;
  phoneNumber: any;
  address: string;
  role: number;
  status: number;
}

export class Login {
  email: string;
  password: string;
}