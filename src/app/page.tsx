import AppWrapper from "./components/AppWrapper";
import Hero from "./components/Hero";
import Main from "./components/Main";

export default function Home() {
  return (
    <AppWrapper >
      <Main>
        <Hero />
      </Main>
    </AppWrapper>
  );
}
