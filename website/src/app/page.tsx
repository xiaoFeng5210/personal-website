import Image from "next/image";
import YakLogo from "~/components/client/yak";
import YakMap from "~/components/client/YakMap";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <YakLogo />
      <YakMap />
    </main>
  );
}
