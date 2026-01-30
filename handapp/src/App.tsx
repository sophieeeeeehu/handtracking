import { Routes, Route } from "react-router-dom";
import Dogcat from "./dogcat";
import Home from "./Home";
import Wand from "./wand";
import Hand from "./hand";

function App() {
  return (
    <Routes>
      {/* <Route element={<TopBar/>}> */}
      <Route path="/" element={<Home />} />
      <Route path="/Dogcat" element={<Dogcat />} />
      <Route path="/Wand" element={<Wand />} />
      <Route path="/Hand" element={<Hand />} />
      {/* </Route> */}
    </Routes>
  );
}

export default App;