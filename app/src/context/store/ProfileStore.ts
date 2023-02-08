import RootStore from "./RootStore";
import {action, makeAutoObservable, observable} from "mobx";
import * as api from 'api';

export default class ProfileStore {
    @observable
    isAdminUser: boolean = false;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
    }

    @action
    async isAdmin() {
        try {
            this.isAdminUser = await api.isAdmin();
        } catch {
            this.isAdminUser = false;
        }
    }
}
