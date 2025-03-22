import Button from "./components/Button";
import Alert from "./components/Alert";
import { ReactNode, useState } from "react";

function App() {
  const [alert, setAlert] = useState<ReactNode | null>(null);

  return (
    <div>
      {alert && <Alert onClose={() => setAlert(null)}>{alert}</Alert>}
      <div>
        <Button
          classes="btn-dark"
          onClick={() => setAlert("button A clicked")}
        >
          Button A
        </Button>
        <Button
          disabled
          onClick={() => setAlert("button B clicked")}
        >
          Button B
        </Button>
        <Button
          classes="btn-lg"
          disabled={false}
          onClick={() => setAlert("button C clicked")}
        >
          Button C
        </Button>
      </div>
    </div>
  );
}

export default App;
