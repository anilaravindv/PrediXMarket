import {makeAutoObservable} from "mobx";
import MarketStore from "./MarketStore";
import SharesStore from "./SharesStore";
import ProfileStore from "./ProfileStore";

class RootStore {

    marketStore: MarketStore;
    sharesStore: SharesStore;
    profileStore: ProfileStore;

    constructor() {
        this.marketStore = new MarketStore(this);
        this.sharesStore = new SharesStore(this);
        this.profileStore = new ProfileStore(this);
        makeAutoObservable(this);
    }

}

export default RootStore;