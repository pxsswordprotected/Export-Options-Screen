import ExportOptions from "./components/ExportOptions/ExportOptions";
import "./App.css";
import { Agentation } from "agentation";

function App() {
  return (
    <div className="app">
      <ExportOptions />
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}

export default App;
