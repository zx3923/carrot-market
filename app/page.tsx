import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-3 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-3xl ">당신 근처의 당근</h1>
        <h2 className="text-sm">동네라서 가능한 모든 것</h2>
        <h2 className="text-sm">지금 내 동네를 선택하고 시작해보세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href="/create-account"
          className="primary-btn text-lg py-2.5 w-full"
        >
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
