import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import "./App.css";
import LoginPage from "./components/LoginPage";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme();

const useStyles = makeStyles((theme) => {
  root: {
  }
});

function App() {
  const classes = useStyles();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <header>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Dark mode"
            />
          </FormGroup>
        </header>
        <div className="router">
          <LoginPage></LoginPage>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
