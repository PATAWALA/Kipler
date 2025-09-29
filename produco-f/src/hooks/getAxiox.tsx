// src/hooks/getAxiox.ts
import { AxiosError } from "axios";

export function getAxiosErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inconnue est survenue";
}
