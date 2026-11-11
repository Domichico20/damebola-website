export type PublicState = {
  ok: boolean;
  message: string;
  fieldErrors: Record<string, string>;
  reference?: string;
  unsubscribeUrl?: string;
};

export const emptyPublicState: PublicState = { ok: false, message: "", fieldErrors: {} };
