## Getting Started

### 0. Prerequisites

-   [Install Node.js](https://nodejs.org/en/download/) if you don't already have it (to run the app)
-   [Install Git](https://git-scm.com/downloads) if you don't already have it (to clone the repo)
-   [Install VSCode](https://code.visualstudio.com/download) if you don't already have it (to edit the code)

### 1. Environment Setup

-   Clone the repo:
    ```bash
    git clone https://github.com/PerpCrypto/PrediXmarket.git
    ```
-   Navigate to the app directory:
    ```bash
      cd PrediXmarket/app
    ```

### 2. Install Dependencies

-   Install dependencies:
    ```bash
    npm install
    ```

### 3. Run the App

-   Run the app:
    ```bash
    npm run dev
    ```
-   App will start running on port 3000
-   Open the app in your browser:
    ```bash
    http://localhost:3000
    ```
-   To stop the app, press `Ctrl + C` in the terminal

### 4. Build the App

-   Build the app:
    ```bash
    npm run build
    ```
-   App will be built in the `dist` directory

### 5. Deploy the App

-   App is deployed on AWS

---

## Project Structure

-   Project Uses [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
-   Project uses [TailwindCSS](https://tailwindcss.com/) for styling
-   Project uses [Vite](https://vitejs.dev/) for bundling

📦app
┣ 📂src
┃ ┣ 📂api
┃ ┃ ┣ 📜addLiquidity.ts
┃ ┃ ┣ 📜buyShares.ts
┃ ┃ ┣ 📜claimLiquidity.ts
┃ ┃ ┣ 📜claimLiquidityFees.ts
┃ ┃ ┣ 📜claimWinnings.ts
┃ ┃ ┣ 📜closeMarket.ts
┃ ┃ ┣ 📜createMarket.ts
┃ ┃ ┣ 📜index.ts
┃ ┃ ┣ 📜initShare.ts
┃ ┃ ┣ 📜isAdmin.ts
┃ ┃ ┣ 📜markets.ts
┃ ┃ ┣ 📜removeLiquidity.ts
┃ ┃ ┣ 📜sellShares.ts
┃ ┃ ┗ 📜shares.ts
┃ ┣ 📂app
┃ ┃ ┣ 📜App.css
┃ ┃ ┣ 📜App.tsx
┃ ┃ ┗ 📜logo.svg
┃ ┣ 📂assets
┃ ┃ ┣ 📂images
┃ ┃ ┃ ┣ 📜1.png
┃ ┃ ┃ ┣ 📜2.png
┃ ┃ ┃ ┣ 📜3.png
┃ ┃ ┃ ┣ 📜4.png
┃ ┃ ┃ ┣ 📜arrow-right.png
┃ ┃ ┃ ┣ 📜banner_01.png
┃ ┃ ┃ ┣ 📜bg.png
┃ ┃ ┃ ┣ 📜bg_top.png
┃ ┃ ┃ ┣ 📜chart1.png
┃ ┃ ┃ ┣ 📜chart2.png
┃ ┃ ┃ ┣ 📜chart3.png
┃ ┃ ┃ ┣ 📜chart4.png
┃ ┃ ┃ ┣ 📜chart5.png
┃ ┃ ┃ ┣ 📜element_01.png
┃ ┃ ┃ ┣ 📜element_02.png
┃ ┃ ┃ ┣ 📜element_03.png
┃ ┃ ┃ ┣ 📜element_04.png
┃ ┃ ┃ ┣ 📜element_05.png
┃ ┃ ┃ ┣ 📜element_06.png
┃ ┃ ┃ ┣ 📜footer_element.png
┃ ┃ ┃ ┣ 📜logo.png
┃ ┃ ┃ ┣ 📜mrkt-logo.png
┃ ┃ ┃ ┗ 📜mrkt_logo.png
┃ ┃ ┣ 📜Hero.png
┃ ┃ ┣ 📜LearnNEarnIcon.png
┃ ┃ ┣ 📜coinIcon.png
┃ ┃ ┣ 📜logo.png
┃ ┃ ┗ 📜tempImage.png
┃ ┣ 📂components
┃ ┃ ┣ 📂LeaderboardPage
┃ ┃ ┃ ┣ 📜Dropdown.tsx
┃ ┃ ┃ ┣ 📜LeaderBoardTypeButton.tsx
┃ ┃ ┃ ┣ 📜LeaderboardCard.tsx
┃ ┃ ┃ ┗ 📜TopWalletsCard.tsx
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜RequireAuth.tsx
┃ ┃ ┣ 📂common
┃ ┃ ┃ ┣ 📜CustomButton.tsx
┃ ┃ ┃ ┣ 📜DatePickerInput.tsx
┃ ┃ ┃ ┣ 📜DonutChart.tsx
┃ ┃ ┃ ┣ 📜Footer.tsx
┃ ┃ ┃ ┣ 📜InputErrorMessage.tsx
┃ ┃ ┃ ┣ 📜LineChart.tsx
┃ ┃ ┃ ┣ 📜MarketCard.tsx
┃ ┃ ┃ ┣ 📜SearchInput.tsx
┃ ┃ ┃ ┗ 📜Table.tsx
┃ ┃ ┣ 📂create-market
┃ ┃ ┃ ┗ 📜CreateMarketForm.tsx
┃ ┃ ┣ 📂market-details
┃ ┃ ┃ ┣ 📜AboutCard.tsx
┃ ┃ ┃ ┣ 📜AddRemoveLiquidityButton.tsx
┃ ┃ ┃ ┣ 📜BuySellButton.tsx
┃ ┃ ┃ ┣ 📜BuySellCard.tsx
┃ ┃ ┃ ┣ 📜ChartCard.tsx
┃ ┃ ┃ ┣ 📜InfoCard.tsx
┃ ┃ ┃ ┣ 📜LPCard.tsx
┃ ┃ ┃ ┣ 📜LiquidityCard.tsx
┃ ┃ ┃ ┣ 📜OutcomeButton.tsx
┃ ┃ ┃ ┣ 📜RefreshButton.tsx
┃ ┃ ┃ ┗ 📜USDTCard.tsx
┃ ┃ ┣ 📂markets
┃ ┃ ┃ ┣ 📜MarketItem.tsx
┃ ┃ ┃ ┣ 📜SharesCard.tsx
┃ ┃ ┃ ┗ 📜SharesTable.tsx
┃ ┃ ┣ 📂navigation
┃ ┃ ┃ ┗ 📜index.tsx
┃ ┃ ┣ 📂portfolio
┃ ┃ ┃ ┣ 📜ChartCard.tsx
┃ ┃ ┃ ┣ 📜Dropdown.tsx
┃ ┃ ┃ ┣ 📜EstimateCard.tsx
┃ ┃ ┃ ┣ 📜ExplorerCard.tsx
┃ ┃ ┃ ┣ 📜LineChart.tsx
┃ ┃ ┃ ┣ 📜LiquiditySharesTable.tsx
┃ ┃ ┃ ┣ 📜OutcomeSharesTable.tsx
┃ ┃ ┃ ┣ 📜ShareTypeButton.tsx
┃ ┃ ┃ ┣ 📜SharesCard.tsx
┃ ┃ ┃ ┣ 📜SharesTable.tsx
┃ ┃ ┃ ┣ 📜UserCard.tsx
┃ ┃ ┃ ┗ 📜WalletBalance.tsx
┃ ┃ ┣ 📜MarketEventHandler.tsx
┃ ┃ ┣ 📜Wallet.tsx
┃ ┃ ┗ 📜WorkspaceUpdater.tsx
┃ ┣ 📂context
┃ ┃ ┣ 📂store
┃ ┃ ┃ ┣ 📜MarketStore.ts
┃ ┃ ┃ ┣ 📜ProfileStore.ts
┃ ┃ ┃ ┣ 📜RootStore.ts
┃ ┃ ┃ ┗ 📜SharesStore.ts
┃ ┃ ┣ 📜Market.ts
┃ ┃ ┣ 📜StoreComponent.tsx
┃ ┃ ┗ 📜workspace.ts
┃ ┣ 📂pages
┃ ┃ ┣ 📜CreateMarketPage.tsx
┃ ┃ ┣ 📜HomePage.tsx
┃ ┃ ┣ 📜LandingPage.tsx
┃ ┃ ┣ 📜LeaderboardPage.tsx
┃ ┃ ┣ 📜MarketsPage.tsx
┃ ┃ ┣ 📜PortfolioPage.tsx
┃ ┃ ┣ 📜RewardsPage.tsx
┃ ┃ ┗ 📜ShowMarketPage.tsx
┃ ┣ 📜auth.ts
┃ ┣ 📜favicon.svg
┃ ┣ 📜index.css
┃ ┣ 📜main.tsx
┃ ┣ 📜utils.ts
┃ ┗ 📜vite-env.d.ts
┣ 📜.env
┣ 📜.gitignore
┣ 📜LICENSE
┣ 📜README.MD
┣ 📜firebase.json
┣ 📜index.html
┣ 📜index.nginx-debian.html
┣ 📜package-lock.json
┣ 📜package.json
┣ 📜postcss.config.js
┣ 📜tailwind.config.js
┣ 📜tsconfig.json
┣ 📜tsconfig.node.json
┗ 📜vite.config.ts
