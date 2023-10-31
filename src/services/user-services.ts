import axios from "axios";
import UserModel from "~/models/userModel";

export default class UserServices {
  /**
   * sign in a user in database
   * @param email user's email
   * @param password user's password
   * @param persistSession save jwt
   * @returns api response
   */
  public async signin(
    email: string,
    password: string,
    persistSession: boolean
  ): Promise<string | { jwt: string; user: UserModel }> {
    const { data } = await axios.post("/api/auth/signin", {
      email,
      password,
      persistSession,
    });

    return data;
  }

  /**
   * sign up a user in database
   * @param name user's name
   * @param email user's email
   * @param password user's password
   * @param role user's role
   * @returns api data
   */
  public async signup(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | boolean> {
    const { data } = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
      role,
    });

    return data;
  }

  /**
   * reset user's password with given new password
   * @param password user's new password
   * @param access_token token with expiration
   * @param refresh_token single use token
   * @returns api response
   */
  public async resetPassword(
    password: string,
    access_token: string,
    refresh_token: string
  ): Promise<string | any> {
    const { data } = await axios.post("/api/users/reset-password", {
      password,
      access_token,
      refresh_token,
    });

    return data;
  }

  /**
   * send a reset password email to given email
   * @param email user's emil
   * @returns api response
   */
  public async forgotPassword(email: string): Promise<string | any> {
    const { data } = await axios.post("/api/users/forgot-account", { email });

    return data;
  }

  /**
   * update a user's profile data
   * @param id user's id
   * @param name user's name
   * @param role user's role
   * @returns api response
   */
  public async updateProfile(id: number, name: string, role: string) {
    const { data } = await axios.put("/api/users/profile", { name, role, id });

    return data;
  }

  /**
   * get courses created by user
   * @param id user's id
   * @returns api response
   */
  public async getCreatedCourses(id: number | string) {
    const { data } = await axios.get(`/api/users/get-own-courses/?id=${id}`);

    return data;
  }

  /**
   * subscribe user to a specific course
   * @param userId user's id
   * @param courseId course's id
   * @returns api response
   */
  public async subscribeToCourse(
    userId: number | string,
    courseId: number | string
  ) {
    const { data } = await axios.post("/api/users/subscribe-course", {
      userId,
      courseId,
    });

    return data;
  }

  public async unsubscribeToCourse(
    userId: number | string,
    courseId: number | string
  ) {
    const { data } = await axios.post("/api/users/unsubscribe-course", {
      userId,
      courseId,
    });

    return data
  }
}
