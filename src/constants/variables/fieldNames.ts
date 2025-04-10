export const LOGIN_FIELDS = {
  email: "email",
  password: "password",
} as const;

export type LoginField = keyof typeof LOGIN_FIELDS;
