import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter() 
  return (
    <div>
      <div className="w-screen">
        <main className="main">
          <div className="flex flex-col">
            <div className="text-center text-3xl text-slate-600">
              <p className="text-7xl text-blue-500 font-serif font-semibold">SuperCharger</p>
              <p className="mt-7">SP Explorer to supercharge the data onboarding based on reputation</p>
              <p>and green score , and incentivise RAAS workers to create an </p>
              <p className=" ">Immutable , Permanent & Unbreakable Storage .</p>
            </div>
            <div className="mt-10 flex justify-center mx-auto">
              <button onClick={() => router.push("/explore")}  className="text-xl px-10 py-2 border-2 border-black rounded-xl hover:scale-110 duration-300">
                Explore
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
