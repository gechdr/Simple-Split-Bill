import { AppProvider } from "./context";
import SplitBill from "./SplitBill";

function App() {
  return (
    <AppProvider>
      <SplitBill />
    </AppProvider>
  );
}

export default App;
