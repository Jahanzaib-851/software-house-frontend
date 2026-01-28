"use client";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ onSubmit, loading }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 max-w-sm w-full"
    >
      <Input label="Email" type="email" required />
      <Input label="Password" type="password" required />

      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>
  );
}
