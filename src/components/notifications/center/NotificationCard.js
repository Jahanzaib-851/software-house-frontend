"use client";
import React from "react";
import NotificationIcon from "./NotificationIcon";

const NotificationCard = ({ note }) => {
  if (!note) return null;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 border-b transition-all cursor-pointer">
      <NotificationIcon type={note.type || "info"} size="md" />
      <div className="flex-1">
        <p className="text-[12px] font-bold text-slate-900">{note.title || "Untitled"}</p>
        <p className="text-[10px] text-slate-500">{note.message || "No message"}</p>
      </div>
      {note.status === "unread" && <span className="w-2 h-2 bg-indigo-600 rounded-full" />}
    </div>
  );
};

export default NotificationCard;
