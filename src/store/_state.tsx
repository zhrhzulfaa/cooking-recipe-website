// import { NavbarInitiateState, NavbarStoreState} from './Navbar/StateNavbar';
// import { SubNavbarInitiateState, SubNavbarStoreState } from './Navbar/StateSubNavbar';
import { SessionInitiateState, SessionStoreState } from './Session/StateSession';

export interface RootState {
//     navbarStore: NavbarStoreState,
    sessionStore: SessionStoreState,
//     titleStore: SubNavbarStoreState,
}

export const rootInitialState = (): RootState => ({ 
//     navbarStore: NavbarInitiateState(),
    sessionStore: SessionInitiateState(),
//     titleStore: SubNavbarInitiateState(),
});