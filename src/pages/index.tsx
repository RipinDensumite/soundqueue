import { useState } from "react";
import { useRouter } from "next/router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState<string>("PLBVGsLomF3V2Inm9oj01WYrG8xqhUBy7a");

  const handleSubmit = () => {
    router.push(`/play/${input}`);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[100dvh]">
        <h1 className="text-4xl font-bold text-center">SoundQueue</h1>
        <p className="text-lg text-center">Please insert your link</p>
        <div className="mt-5 flex gap-3">
          <Input type="text" placeholder="Youtube playlist link" className="max-w-xl" value={input} onChange={(e) => setInput(e.target.value)} />
          <Button className="w-fit" onClick={handleSubmit}>Insert</Button>
        </div>
      </div>
    </>
  );
}
