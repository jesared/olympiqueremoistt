export type CreateEventActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

export type UpdateEventActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

export type DuplicateEventResult = {
  status: "success" | "error";
  message: string;
  redirectTo?: string;
};
