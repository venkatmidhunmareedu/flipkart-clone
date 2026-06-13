"use client";

import { ProfileForm } from "@/components/account/profile-form";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-[var(--text-primary,#212121)]">
        Profile Information
      </h1>
      <ProfileForm />
    </div>
  );
}
