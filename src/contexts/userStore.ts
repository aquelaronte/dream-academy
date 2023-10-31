import axios from "axios";
import { defineStore } from "pinia";
import UserModel from "~/models/userModel";
import jsonwebtoken from "jsonwebtoken";

const useUserStore = defineStore("user", () => {
  /**
   * Contain user's data
   */
  let userData: UserModel = {
    id: "",
    id_auth: "",
    name: "",
    role: "",
    email: "",
  };

  let isUserloged: boolean = false;

  return {
    userData,
    isUserloged,
  };
});

export default useUserStore;
