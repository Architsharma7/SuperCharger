import { getCid, setCID } from "../components/dataStore";

export default function Home() {
  return (
    <div>
      <button>call</button>
      <button onClick={() => getCid()}>get</button>
    </div>
  );
}
