export class HttpEndPoints {
  private static BaseApi = {
    AuthApi: "http://localhost:3000/",
  };
  public static AuthApi = {
    Login: this.BaseApi.AuthApi + "auth/login",
    Signup: this.BaseApi.AuthApi + "auth/signup",
    Logout: this.BaseApi.AuthApi + "auth/logout",
    RefreshToken: this.BaseApi.AuthApi + "auth/refresh",
    GetRandomQuote: this.BaseApi.AuthApi + "quote/random",
  };
}
