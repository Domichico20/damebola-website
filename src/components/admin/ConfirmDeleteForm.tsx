"use client";

export function ConfirmDeleteForm({
  action,
  id,
  label,
  confirm,
  plain = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
  confirm: string;
  plain?: boolean;
}) {
  return (
    <form
      action={action}
      className={plain ? undefined : "rounded-3xl bg-white px-5 py-4 ring-1 ring-line"}
      onSubmit={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className={plain ? "font-semibold text-danger" : "min-h-12 rounded-full px-5 font-semibold text-danger"} type="submit">
        {label}
      </button>
    </form>
  );
}
