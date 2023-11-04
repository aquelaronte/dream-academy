export default interface UserModel {
  id?: string;
  id_auth: string;
  name: string;
  role: "Estudiante" | "Profesor" | "admin" | "";
  email: string;
  profile_photo: string;
}
