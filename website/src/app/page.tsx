import Image from "next/image";
import Yak from "~/components/client/yak";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Yak />
    </main>
  );
}
