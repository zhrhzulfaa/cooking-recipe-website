import { createSignal, type Component, createEffect, JSX, onCleanup } from 'solid-js';
import './navbar-out.css'
import { A, useLocation } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import Login from '../../login/login';

interface NavbarProps { 
    children: JSX.Element
  }

const NavbarOut: Component<NavbarProps> = (props) => {

    const location = useLocation();

    const [LoginPopUp, setLoginPopUp] = createSignal(false);

    function showLoginPopUp(){
        setLoginPopUp(true);
    };
    function ClosePopUp(){
        setLoginPopUp(true);
    };

    const [drawerOpen, setDrawerOpen] = createSignal(false);

    const closeDrawer = () => {
      setDrawerOpen(false);
    };
  
    const handleNavLinkClick = () => {
      closeDrawer(); // Close the drawer when a navigation link is clicked
    };
  
    const handleOutsideClick = (event: MouseEvent) => {
      const drawerToggle = document.getElementById('my-drawer') as HTMLInputElement;
      if (drawerToggle && drawerToggle.checked && !event.composedPath().includes(drawerToggle)) {
        closeDrawer();
      }
    };
  
    createEffect(() => {
      document.addEventListener('click', handleOutsideClick);
  
      onCleanup(() => {
        document.removeEventListener('click', handleOutsideClick);
      });
    });

  return (
    <div class="navbar-2">

        <div class="absolute fixed z-99 top-0">
            <div class="drawer">
                <input id="my-drawer-2" type="checkbox" class="drawer-toggle" 
                checked={drawerOpen()}
                onChange={() => setDrawerOpen(!drawerOpen())}
                />
                <div class="drawer-content z-1"  > 
                    <label for="my-drawer-2" class="sidebar" style={{ "z-index":"2"}}>

                    <div class="logo">
                        <img src="/src/assets/img/lavar.png" alt="" width="55" height="55" style={{display:"block", margin:"auto", "border-radius":"50%"}}/>
                    </div>
                    <div class="content-side">
                    <div class="profile-pic">
                        <Icon icon="gg:profile" width="45" height="45"/>
                    </div>
                    <div class="page-menu home" classList={{ active: location.pathname === '/home' || location.pathname.startsWith('/detail') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36" fill="none">
                            <path d="M12.6667 2H3.77778C2.79594 2 2 2.79594 2 3.77778V16.2222C2 17.2041 2.79594 18 3.77778 18H12.6667C13.6485 18 14.4444 17.2041 14.4444 16.2222V3.77778C14.4444 2.79594 13.6485 2 12.6667 2Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M32.2223 2H23.3334C22.3516 2 21.5557 2.79594 21.5557 3.77778V9.11111C21.5557 10.093 22.3516 10.8889 23.3334 10.8889H32.2223C33.2042 10.8889 34.0001 10.093 34.0001 9.11111V3.77778C34.0001 2.79594 33.2042 2 32.2223 2Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M32.2223 18H23.3334C22.3516 18 21.5557 18.7959 21.5557 19.7778V32.2222C21.5557 33.2041 22.3516 34 23.3334 34H32.2223C33.2042 34 34.0001 33.2041 34.0001 32.2222V19.7778C34.0001 18.7959 33.2042 18 32.2223 18Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.6667 25.1111H3.77778C2.79594 25.1111 2 25.9071 2 26.8889V32.2222C2 33.2041 2.79594 34 3.77778 34H12.6667C13.6485 34 14.4444 33.2041 14.4444 32.2222V26.8889C14.4444 25.9071 13.6485 25.1111 12.6667 25.1111Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="page-menu" classList={{ active: location.pathname === '/dapur_saya' }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35" fill="none">
                            <path d="M13.125 29.1667H15.3125V21.3889C16.224 21.3889 16.9991 21.105 17.6378 20.5372C18.2766 19.9694 18.5952 19.2811 18.5938 18.4722V12.6389H16.4062V18.4722H15.3125V12.6389H13.125V18.4722H12.0312V12.6389H9.84375V18.4722C9.84375 19.2824 10.1631 19.9714 10.8019 20.5392C11.4406 21.1069 12.215 21.3902 13.125 21.3889V29.1667ZM21.875 29.1667H24.0625V12.6389C22.8594 12.6389 21.8291 13.02 20.9716 13.7822C20.1141 14.5444 19.686 15.4596 19.6875 16.5278V22.3611H21.875V29.1667ZM0 35V11.6667L17.5 0L35 11.6667V35H0ZM4.375 31.1111H30.625V13.6111L17.5 4.86111L4.375 13.6111V31.1111Z" fill="black" fill-opacity="0.7"/>
                        </svg> 
                    </div>
                    <div class="page-menu" classList={{ active: location.pathname === '/about-us' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 38 38" fill="none">
                            <path d="M16.875 13.125H20.625V9.375H16.875M18.75 33.75C10.4813 33.75 3.75 27.0187 3.75 18.75C3.75 10.4813 10.4813 3.75 18.75 3.75C27.0187 3.75 33.75 10.4813 33.75 18.75C33.75 27.0187 27.0187 33.75 18.75 33.75ZM18.75 0C16.2877 0 13.8495 0.484983 11.5747 1.42726C9.29983 2.36953 7.23285 3.75065 5.49175 5.49175C1.97544 9.00805 0 13.7772 0 18.75C0 23.7228 1.97544 28.4919 5.49175 32.0083C7.23285 33.7494 9.29983 35.1305 11.5747 36.0727C13.8495 37.015 16.2877 37.5 18.75 37.5C23.7228 37.5 28.4919 35.5246 32.0083 32.0083C35.5246 28.4919 37.5 23.7228 37.5 18.75C37.5 16.2877 37.015 13.8495 36.0727 11.5747C35.1305 9.29983 33.7494 7.23285 32.0083 5.49175C30.2672 3.75065 28.2002 2.36953 25.9253 1.42726C23.6505 0.484983 21.2123 0 18.75 0ZM16.875 28.125H20.625V16.875H16.875V28.125Z" fill="black" fill-opacity="0.7"/>
                        </svg>
                    </div>
                    </div>

                    </label>
                </div> 
                
                <div class="drawer-side" style={{"z-index":"5"}} onClick={handleNavLinkClick}>
                <label for="my-drawer-2" aria-label="close sidebar" class="drawer z-2"></label>
                <ul class="navbar-container">
                    <div class="head">
                        <img src="/src/assets/img/lavar.png" alt="" width="65" height="65" style={{display:"block", "border-radius":"50%"}}/>
                        <div class="flex-col">
                            <h1>LAVAR</h1>
                            <p>Lezatnnya Aneka Variasi Resep</p>
                        </div>
                    </div>
                    {/* classList={{ active: location.pathname === '/master/master' }} */}
                    {/* classList={{ active: location.pathname.startsWith('/kontak') }} */}
                    {/* <A href="/login" classList={{ active: location.pathname === '/profile' }}>
                    <button class="login-btn" onClick={showLoginPopUp}>MASUK</button>           
                    </A> */}
                    <div>
                        <Login/>
                    </div>
                    <div class="menu">

                        <A href="/home" classList={{ active: location.pathname === '/home' || location.pathname.startsWith('/detail')}} onClick={handleNavLinkClick}>
                        <div class="menu-container home">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36" fill="none">
                                <path d="M12.6667 2H3.77778C2.79594 2 2 2.79594 2 3.77778V16.2222C2 17.2041 2.79594 18 3.77778 18H12.6667C13.6485 18 14.4444 17.2041 14.4444 16.2222V3.77778C14.4444 2.79594 13.6485 2 12.6667 2Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M32.2223 2H23.3334C22.3516 2 21.5557 2.79594 21.5557 3.77778V9.11111C21.5557 10.093 22.3516 10.8889 23.3334 10.8889H32.2223C33.2042 10.8889 34.0001 10.093 34.0001 9.11111V3.77778C34.0001 2.79594 33.2042 2 32.2223 2Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M32.2223 18H23.3334C22.3516 18 21.5557 18.7959 21.5557 19.7778V32.2222C21.5557 33.2041 22.3516 34 23.3334 34H32.2223C33.2042 34 34.0001 33.2041 34.0001 32.2222V19.7778C34.0001 18.7959 33.2042 18 32.2223 18Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.6667 25.1111H3.77778C2.79594 25.1111 2 25.9071 2 26.8889V32.2222C2 33.2041 2.79594 34 3.77778 34H12.6667C13.6485 34 14.4444 33.2041 14.4444 32.2222V26.8889C14.4444 25.9071 13.6485 25.1111 12.6667 25.1111Z" stroke="black" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>Beranda</p>
                        </div>
                        </A>

                        <A href="/dapur_saya" classList={{ active: location.pathname === '/dapur_saya'}} onClick={handleNavLinkClick}>
                        <div class="menu-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35" fill="none">
                                <path d="M13.125 29.1667H15.3125V21.3889C16.224 21.3889 16.9991 21.105 17.6378 20.5372C18.2766 19.9694 18.5952 19.2811 18.5938 18.4722V12.6389H16.4062V18.4722H15.3125V12.6389H13.125V18.4722H12.0312V12.6389H9.84375V18.4722C9.84375 19.2824 10.1631 19.9714 10.8019 20.5392C11.4406 21.1069 12.215 21.3902 13.125 21.3889V29.1667ZM21.875 29.1667H24.0625V12.6389C22.8594 12.6389 21.8291 13.02 20.9716 13.7822C20.1141 14.5444 19.686 15.4596 19.6875 16.5278V22.3611H21.875V29.1667ZM0 35V11.6667L17.5 0L35 11.6667V35H0ZM4.375 31.1111H30.625V13.6111L17.5 4.86111L4.375 13.6111V31.1111Z" fill="black" fill-opacity="0.7"/>
                            </svg>      
                            <p>Dapur Saya</p>       
                        </div>
                        </A>
                        {/* <div class="menu-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 34 34" fill="none">
                                <path d="M30.2222 13.6H3.77778C1.69433 13.6 0 15.1249 0 17V30.6C0 32.4751 1.69433 34 3.77778 34H30.2222C32.3057 34 34 32.4751 34 30.6V17C34 15.1249 32.3057 13.6 30.2222 13.6ZM3.77778 30.6V17H30.2222L30.226 30.6H3.77778ZM3.77778 6.8H30.2222V10.2H3.77778V6.8ZM7.55556 0H26.4444V3.4H7.55556V0Z" fill="black" fill-opacity="0.75"/>
                            </svg>
                            <p>Koleksi Resep</p>       
                        </div> */}
                        <A href="/about-us" classList={{ active: location.pathname === '/about-us'}} onClick={handleNavLinkClick}>
                        <div class="menu-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 38 38" fill="none">
                                <path d="M16.875 13.125H20.625V9.375H16.875M18.75 33.75C10.4813 33.75 3.75 27.0187 3.75 18.75C3.75 10.4813 10.4813 3.75 18.75 3.75C27.0187 3.75 33.75 10.4813 33.75 18.75C33.75 27.0187 27.0187 33.75 18.75 33.75ZM18.75 0C16.2877 0 13.8495 0.484983 11.5747 1.42726C9.29983 2.36953 7.23285 3.75065 5.49175 5.49175C1.97544 9.00805 0 13.7772 0 18.75C0 23.7228 1.97544 28.4919 5.49175 32.0083C7.23285 33.7494 9.29983 35.1305 11.5747 36.0727C13.8495 37.015 16.2877 37.5 18.75 37.5C23.7228 37.5 28.4919 35.5246 32.0083 32.0083C35.5246 28.4919 37.5 23.7228 37.5 18.75C37.5 16.2877 37.015 13.8495 36.0727 11.5747C35.1305 9.29983 33.7494 7.23285 32.0083 5.49175C30.2672 3.75065 28.2002 2.36953 25.9253 1.42726C23.6505 0.484983 21.2123 0 18.75 0ZM16.875 28.125H20.625V16.875H16.875V28.125Z" fill="black" fill-opacity="0.7"/>
                            </svg>
                            <p>Tentang Kami</p>       
                        </div>
                        </A>
                    </div>
                    
                </ul>
                </div>
            </div>

        </div>

            <div class="main-content">
                {props.children}
            </div>
            {LoginPopUp() && <Login OnClose={ClosePopUp}/>}
        </div>
  );
};

export default NavbarOut;
