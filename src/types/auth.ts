export interface LoginRequest {
  email: string;
  password: string; 
}

export interface LoginResponse {
    token : string;
    userId : string;
    name : string;
    role :string;
}

export interface RegisterRequest {
    name : string;
    email : string;
    password : string;
    roleId : number;    // 1 = Admin, 2 = Coach, 3 = Student
    sport? : string;   // Only needed if RoleId is 2
}

