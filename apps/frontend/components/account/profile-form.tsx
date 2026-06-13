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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-[var(--text-secondary,#878787)]">{label}</span>
      <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)] px-3 py-2.5 text-sm text-[var(--text-primary,#212121)]">
        {value}
      </div>
    </label>
  );
}

export function ProfileForm() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const updateProfile = useUpdateProfile();
  const updateEmail = useUpdateEmail();
  const changePassword = useChangePassword();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [newEmail, setNewEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function formatPhone(value: string) {
    return `+91 ${value.slice(0, 5)} ${value.slice(5)}`;
  }

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

  async function handleSavePhone() {
    await updateProfile.mutateAsync({ phone });
    setEditingPhone(false);
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
    <div className="rounded-sm bg-white p-6 shadow-sm">
      <section className="border-b border-[var(--border,#e0e0e0)] pb-6">
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
              <span className="mb-2 block text-sm text-[var(--text-secondary,#878787)]">Your Gender</span>
              <div className="flex gap-4">
                {["Male", "Female"].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                      className="accent-[var(--primary,#2874f0)]"
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
              <Button type="button" variant="outline" onClick={() => setEditingProfile(false)} className="rounded-sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="First Name" value={user.firstName} />
            <ReadOnlyField label="Last Name" value={user.lastName ?? "—"} />
            {user.gender && (
              <div className="sm:col-span-2">
                <span className="mb-2 block text-xs text-[var(--text-secondary,#878787)]">Your Gender</span>
                <div className="flex gap-4 text-sm">
                  {["Male", "Female"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={user.gender === option}
                        readOnly
                        className="accent-[var(--primary,#2874f0)]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="border-b border-[var(--border,#e0e0e0)] py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">Email Address</h2>
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
              <Button type="button" variant="outline" onClick={() => setEditingEmail(false)} className="rounded-sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <ReadOnlyField label="Email Address" value={user.email} />
        )}
        {!user.emailVerified && (
          <p className="mt-2 text-xs text-[var(--danger,#d32f2f)]">Email not verified</p>
        )}
      </section>

      <section className="border-b border-[var(--border,#e0e0e0)] py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">Mobile Number</h2>
          {!editingPhone && (
            <button
              type="button"
              onClick={() => {
                setPhone(user.phone ?? "");
                setEditingPhone(true);
              }}
              className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
            >
              {user.phone ? "Edit" : "Add"}
            </button>
          )}
        </div>

        {editingPhone ? (
          <div className="space-y-3">
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile number"
            />
            {updateProfile.isError && (
              <p className="text-sm text-[var(--danger,#d32f2f)]">{updateProfile.error.message}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => void handleSavePhone()}
                disabled={updateProfile.isPending || phone.length !== 10}
                className="rounded-sm bg-[var(--primary,#2874f0)] text-white"
              >
                Save
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingPhone(false)} className="rounded-sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <ReadOnlyField
            label="Mobile Number"
            value={user.phone ? formatPhone(user.phone) : "Not added yet"}
          />
        )}
      </section>

      <section className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">FAQs</h2>
        </div>
        <p className="text-sm font-medium text-[var(--text-primary,#212121)]">
          What happens when I update my email address (or mobile number)?
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
          Your login credentials remain unchanged. You will receive all account-related communication
          on your updated email address or mobile number.
        </p>

        {editingPassword ? (
          <div className="mt-4 space-y-3 border-t border-[var(--border,#e0e0e0)] pt-4">
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
              <Button type="button" variant="outline" onClick={() => setEditingPassword(false)} className="rounded-sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingPassword(true)}
            className="mt-4 text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
          >
            Change Password
          </button>
        )}
      </section>
    </div>
  );
}
