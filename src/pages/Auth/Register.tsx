import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

const uploadToImgbb = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error("Avatar upload failed");
  const data = await res.json();
  return data.data.url as string;
};

const Register = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
    else setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadToImgbb(avatarFile);
      }
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      // TODO: call register API
      console.log("Register:", { fullName, email, avatar: avatarUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* First & Last Name */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="register-firstname" className="text-zinc-300">
            First Name
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="register-lastname" className="text-zinc-300">
            Last Name
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-avatar" className="text-zinc-300">
          Avatar
        </Label>
        <div className="flex items-center gap-3">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="size-10 rounded-full object-cover border border-[#2A3550] shrink-0"
            />
          )}
          <Input
            id="register-avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="bg-[#1A2235] border-[#2A3550] text-zinc-300 file:text-zinc-300 file:bg-[#2A3550] file:border-0 file:rounded file:px-2 file:py-0.5 file:text-xs focus-visible:ring-brand-blue/40"
          />
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end -mt-2">
        <a
          href="#"
          className="text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("forgot-password");
          }}
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-brand-orange"
      >
        {loading ? <Spinner className="size-4" /> : "Create Account"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2A3550]" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 h-px bg-[#2A3550]" />
      </div>

      {/* Google Auth */}
      <Button
        type="button"
        variant="outline"
        className="w-full bg-[#1A2235] border-[#2A3550] text-zinc-200 hover:bg-[#111827] hover:text-white flex items-center gap-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
};

export default Register;
