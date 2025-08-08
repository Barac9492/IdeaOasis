'use client';
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-zinc-800">
      <Link href="/" className="font-semibold tracking-wide">IdeaOasis</Link>
      <div className="flex gap-4 text-sm">
        <Link href="/top">Top Picks</Link>
        <Link href="/admin">Admin</Link>
        {user ? (
          <button onClick={() => signOut(auth)}>Sign out</button>
        ) : (
                          <button onClick={() => signInWithPopup(auth, googleProvider)}>Sign in</button>
        )}
      </div>
    </nav>
  );
}
