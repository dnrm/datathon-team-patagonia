"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChatWidget } from "@/components/ChatWidget";

export default function ChatbotPage() {
  return (
    <DashboardLayout>
      <ChatWidget fullscreen={true} />
    </DashboardLayout>
  );
}
