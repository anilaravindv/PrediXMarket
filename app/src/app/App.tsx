import './App.css'
import {StoreProvider} from "context/StoreComponent";
import {useState} from "react";
import RootStore from "context/store/RootStore";
import {Route, Routes} from "react-router-dom";
import MarketsPage from "pages/MarketsPage";
import CreateMarketPage from "pages/CreateMarketPage";
import Navigation from "components/navigation";
import LandingPage from "pages/LandingPage";
import PortfolioPage from 'pages/PortfolioPage';
import ShowMarketPage from 'pages/ShowMarketPage';
import LeaderboardPage from "pages/LeaderboardPage";
import RewardsPage from "pages/RewardsPage";
import Wallet from "components/Wallet";
import WorkspaceUpdater from "components/WorkspaceUpdater";
import MarketEventHandler from "components/MarketEventHandler";
import RequireAuth from "components/auth/RequireAuth";

function App() {
    const [rootStore] = useState(new RootStore());
    return <StoreProvider store={rootStore}>
        <Wallet>
            <WorkspaceUpdater/>
            <MarketEventHandler/>
            <Navigation/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route
                    path="/markets"
                    element={
                        <RequireAuth>
                            <MarketsPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/markets/:id"
                    element={
                        <RequireAuth>
                            <ShowMarketPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/markets/create"
                    element={
                        <RequireAuth>
                            <CreateMarketPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        <RequireAuth>
                            <PortfolioPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        <RequireAuth>
                            <LeaderboardPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/rewards"
                    element={
                        <RequireAuth>
                            <RewardsPage/>
                        </RequireAuth>
                    }
                />
            </Routes>
        </Wallet>
    </StoreProvider>
}

export default App
