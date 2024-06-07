// import { Icon } from '@iconify-icon/solid';
import { useNavigate } from '@solidjs/router';
import './logout.css'
import type { Component } from 'solid-js';

interface LogoutProps {
    onClose: () => void
}


const Logout: Component<LogoutProps> = (props) => {
    const navigate = useNavigate();
    const ActionLogout = () => {
        console.log('hallo logout');
        sessionStorage.clear();
        // location.reload();
        navigate('/home', { replace: true });
        
      }

    console.log("logout nie");
    return (
        <div class="overlay absolute">
            <div class="logout-pop-up">
                <div>
                    <h1>Keluar</h1>
                </div>
                <div style={{display:"flex", "flex-direction":"column", "align-items":"center", gap:"4vh", "margin-top":"30px"}}>
                <div>
                    <img src="/src/assets/img/logout.png" alt="" width="200"/>
                </div>
                <div>
                <p>Apakah anda yakin untuk Keluar?</p>
                </div>
                <div class="logout-btn" style={{display:"flex","flex-direction":"row", gap:"4vh"}}>
                    <button class="btn-tidak" onClick={props.onClose}>Tidak</button>
                    <button class="lanjut" onClick={ActionLogout}>Lanjut</button>
                </div>
                </div>
            </div>
        </div>
  );
};

export default Logout;
