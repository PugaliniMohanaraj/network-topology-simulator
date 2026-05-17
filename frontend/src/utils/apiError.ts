import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot reach server. Start the backend: cd network-simulator && mvn spring-boot:run";
    }
    const data = error.response.data as { message?: string } | string;
    if (typeof data === "object" && data?.message) {
      return data.message;
    }
    if (typeof data === "string" && data.length > 0) {
      return data;
    }
    if (error.response.status === 401) {
      return "Invalid email or password.";
    }
    if (error.response.status === 409) {
      return "This email is already registered.";
    }
  }
  return fallback;
}
