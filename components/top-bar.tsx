"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("?");
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="hidden sm:flex h-14 justify-between items-center p-4  bg-neutral-800">
      <div className="text-2xl">🥕</div>
      <div className="relative" ref={menuRef}>
        <Bars3Icon
          className="w-7 h-7 hover:cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />
        {isOpen && (
          <div className="absolute -left-24  mt-2 w-32 bg-neutral-800 border border-gray-300 rounded-lg p-3">
            <ul>
              <li onClick={() => setIsOpen((prev) => !prev)}>
                <Link
                  href="/products"
                  className="hover:bg-neutral-600 block w-full py-2 px-4 rounded-lg text-white"
                >
                  홈
                </Link>
              </li>
              <li onClick={() => setIsOpen((prev) => !prev)}>
                <Link
                  href="/life"
                  className="hover:bg-neutral-600 block w-full py-2 px-4 rounded-lg text-white"
                >
                  동네생활
                </Link>
              </li>
              <li onClick={() => setIsOpen((prev) => !prev)}>
                <Link
                  href="/chat"
                  className="hover:bg-neutral-600 block w-full py-2 px-4 rounded-lg text-white"
                >
                  채팅
                </Link>
              </li>
              <li onClick={() => setIsOpen((prev) => !prev)}>
                <Link
                  href="/profile"
                  className="hover:bg-neutral-600 block w-full py-2 px-4 rounded-lg text-white"
                >
                  나의 당근
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
