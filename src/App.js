import React from "react";
import "./App.css";
import Main from "./containers/Main";
import { ThemeProvider } from "styled-components";
import { chosenTheme } from "./theme";
import { GlobalStyles } from "./global";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";

const MainWithTheme = () => <Main theme={chosenTheme} />;

function App() {
  return (
    <ThemeProvider theme={chosenTheme}>
      <PortfolioDataProvider>
        <Router>
          <GlobalStyles />
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/" component={MainWithTheme} />
          </Switch>
        </Router>
      </PortfolioDataProvider>
    </ThemeProvider>
  );
}

export default App;
