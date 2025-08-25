'use client';
import Link from "next/link";
import { auth, provider } from "@/shared/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-zinc-800">
      <Link href="/" className="font-semibold tracking-wide">아이디어오아시스</Link>
      <div className="flex gap-4 text-sm">
        <Link href="/top">추천 아이디어</Link>
        <Link href="/admin">관리자</Link>
        {user ? (
          <button onClick={() => signOut(auth)}>로그아웃</button>
        ) : (
          <button onClick={() => signInWithPopup(auth, provider)}>로그인</button>
        )}
      </div>
    </nav>
  );
}
