"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useChangePassword,
  useUpdateEmail,
  useUpdateProfile,
  useUser,
} from "@/hooks/use-user";

export function ProfileForm() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const updateProfile = useUpdateProfile();
  const updateEmail = useUpdateEmail();
  const changePassword = useChangePassword();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function startProfileEdit() {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName ?? "");
    setGender(user.gender ?? "");
    setEditingProfile(true);
  }

  async function handleSaveProfile() {
    await updateProfile.mutateAsync({
      firstName,
      lastName: lastName || undefined,
      gender: gender || undefined,
    });
    setEditingProfile(false);
  }

  async function handleSaveEmail() {
    const updated = await updateEmail.mutateAsync(newEmail);
    setEditingEmail(false);
    setNewEmail("");
    router.push(`/verify-email?email=${encodeURIComponent(updated.email)}`);
  }

  async function handleChangePassword() {
    await changePassword.mutateAsync({ currentPassword, newPassword });
    setEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  }

  if (isLoading || !user) {
    return (
      <div className="rounded-sm bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--surface,#f1f3f6)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-sm bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">
            Personal Information
          </h2>
          {!editingProfile && (
            <button
              type="button"
              onClick={startProfileEdit}
              className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-[var(--text-secondary,#878787)]">First Name</span>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-[var(--text-secondary,#878787)]">Last Name</span>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
            </div>

            <div>
              <span className="mb-2 block text-sm text-[var(--text-secondary,#878787)]">Gender</span>
              <div className="flex gap-4">
                {["Male", "Female"].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {updateProfile.isError && (
              <p className="text-sm text-[var(--danger,#d32f2f)]">{updateProfile.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => void handleSaveProfile()}
                disabled={updateProfile.isPending}
                className="rounded-sm bg-[var(--primary,#2874f0)] text-white"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProfile(false)}
                className="rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-[var(--text-secondary,#878787)]">Name</dt>
              <dd className="font-medium">
                {user.firstName} {user.lastName ?? ""}
              </dd>
            </div>
            {user.gender && (
              <div>
                <dt className="text-[var(--text-secondary,#878787)]">Gender</dt>
                <dd className="font-medium">{user.gender}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      <section className="rounded-sm bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">
            Email Address
          </h2>
          {!editingEmail && (
            <button
              type="button"
              onClick={() => {
                setNewEmail(user.email);
                setEditingEmail(true);
              }}
              className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editingEmail ? (
          <div className="space-y-3">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email address"
            />
            {updateEmail.isError && (
              <p className="text-sm text-[var(--danger,#d32f2f)]">{updateEmail.error.message}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => void handleSaveEmail()}
                disabled={updateEmail.isPending}
                className="rounded-sm bg-[var(--primary,#2874f0)] text-white"
              >
                Save & Verify
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingEmail(false)}
                className="rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium">{user.email}</p>
        )}
        {!user.emailVerified && (
          <p className="mt-2 text-xs text-[var(--danger,#d32f2f)]">Email not verified</p>
        )}
      </section>

      <section className="rounded-sm bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">
            Mobile Number
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary,#878787)]">
          {user.phone ?? "Not added yet"}
        </p>
      </section>

      <section className="rounded-sm bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">Password</h2>
          {!editingPassword && (
            <button
              type="button"
              onClick={() => setEditingPassword(true)}
              className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
            >
              Change
            </button>
          )}
        </div>

        {editingPassword ? (
          <div className="space-y-3">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
            />
            {changePassword.isError && (
              <p className="text-sm text-[var(--danger,#d32f2f)]">{changePassword.error.message}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => void handleChangePassword()}
                disabled={changePassword.isPending}
                className="rounded-sm bg-[var(--primary,#2874f0)] text-white"
              >
                Update Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPassword(false)}
                className="rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary,#878787)]">••••••••</p>
        )}
      </section>
    </div>
  );
}
