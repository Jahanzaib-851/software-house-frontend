"use client";
import BaseModal from "./BaseModal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message = "Are you sure?",
}) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Confirm Action"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Confirm
          </button>
        </>
      }
    >
      <p>{message}</p>
    </BaseModal>
  );
}
