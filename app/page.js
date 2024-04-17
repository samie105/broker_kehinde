import Script from "next/script";
import Home from "../components/main/Home";
export default function HomePage() {
  return (
    <>
      <Script
        src="//code.tidio.co/xubczakgshsmqh6mmhj8pmr1ptdqikbf.js"
        strategy="afterInteractive"
        async
      ></Script>
      <Home />
    </>
  );
}
