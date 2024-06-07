import { createSignal, type Component, onMount } from 'solid-js';
import './login.css'
import { A } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { HOST_URL } from '../../config/app';

interface LoginProps {
    OnClose?: () => void;
}
// modalForm.js
export const showModal = () => {
    const modal = document.getElementById('form_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  
const Login: Component<LoginProps> = (props) => {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");

    onMount(() => {
    console.log('ini halaman Login');
    });

    const ActionLogin = () => {
    console.log('hallo login button clicked');
    const dataUser = { username: "bubbles", email: "bubbles_puff@gmail.com" };
    sessionStorage.setItem('userData', JSON.stringify(dataUser));
    window.location.assign('/');
    }

    const fetchLogin = async () => {
        try {
        const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            username: username(),
            password: password(),
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to login');
        }
        } catch (error) {
        console.error(error);
        throw error;
        }
    };

    const ActionLogin1 = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!username() || !password()) {
            alert('Mohon isi username dan password');
            return;
          }
        try {
        const data = await fetchLogin();
        // Cek apakah data login berhasil atau tidak
        if (data) {
            // Login berhasil, Anda dapat menyimpan data pengguna di sessionStorage atau localStorage
            sessionStorage.setItem('userData', JSON.stringify(data));
            // Redirect ke halaman utama atau halaman lain yang sesuai
            window.location.assign('/');
        } else {
            // Handle login gagal di sini
            console.error('Login failed');
        }
        } catch (error) {
        // Handle kesalahan saat melakukan permintaan login
        console.error(error);
        }
    };

    const [showPassword, setShowPassword] = createSignal(false);

    const PasswordVisibility = () => {
    setShowPassword(!showPassword());
    };

    const closeModal = () => {
        const modal = document.getElementById('form_modal_1') as HTMLDialogElement;
        modal.close();
    };

    const closeModal2 = () => {
        const modal = document.getElementById('form_modal_2') as HTMLDialogElement;
        modal.close();
    };

    const [username2, setUsername2] = createSignal("");
    const [password2, setPassword2] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [desc, setDesc] = createSignal("");
    const [profile, setProfile] = createSignal<File | null>(null);

    const setProfileFromFile = (filePath: string) => {
        // Mengambil file dari path lokal
        fetch(filePath)
          .then(response => response.blob())
          .then(blob => {
            // Membuat objek File dari blob
            const file = new File([blob], "profile3.png", { type: "image/png" });
    
            // Set variabel state dengan objek File
            setProfile(file);
            console.log("pp", profile())
          })
          .catch(error => {
            console.error("Error loading file:", error);
          });
      };
    
      // Panggil fungsi setProfileFromFile dengan path file lokal
      setProfileFromFile("/src/assets/img/profile3.png");
    //   console.log("p", profile())

    const SendSignUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!username2() || !email() || !password2() || !desc()) {
            alert('Mohon isi semua kolom');
            return;
          }
          
        const dataSignUp = {
            id_akun: 0,
            username: username2(),
            email: email(),
            password: password2(),
            deskripsi_profil: desc()
        }

        const sendNewAccount = new FormData();
        sendNewAccount.append('id_akun', "0" );
        sendNewAccount.append('username',`${username2()}`);
        sendNewAccount.append('email',`${email()}`);
        sendNewAccount.append('password',`${password2()}`);
        sendNewAccount.append('deskripsi_profil',`${desc()}`);
        // sendNewAccount.append('foto_profil', fileProfile());
        if (profile()) {
            sendNewAccount.append('foto_profil', profile()!);
        }
        console.log("p", profile())

        console.log('Edit Akun ', sendNewAccount);

        console.log('Buat Akun ', dataSignUp);

        try {
            const response = await fetch('/api/account/', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: sendNewAccount,
            });

            if(response.ok){
                alert("Akun berhasil dibuat. Silakan login");
                setEmail('')
                setUsername2('')
                setPassword2('')
                setDesc('')
            } else {
                if (response.status === 401) {
                    alert('Invalid email or password');
                } else if (response.status === 400) {
                    alert('Please fill in both username and password');
                } else {
                    throw new Error('Failed to login');
                }
                const errorMessage = await response.text();
                alert(`Gagal mengubah data. Pesan kesalahan: ${errorMessage}`);
                console.error('Gagal mengubah data:', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    
  return (
    <div>
        <div>
        <div class="show-login-btn">
            <button onClick={() => (document.getElementById('form_modal_1') as HTMLDialogElement).showModal()}>
                MASUK
            </button>
        </div>
        <dialog id="form_modal_1" class="modal">
            <div class="login-popup">
                <form method="dialog">
                    <div>
                        <svg onClick={closeModal} style={{"margin-left":"auto", cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M50 25C50 28.283 49.3534 31.5339 48.097 34.5671C46.8406 37.6002 44.9991 40.3562 42.6777 42.6777C40.3562 44.9991 37.6002 46.8406 34.5671 48.097C31.5339 49.3534 28.283 50 25 50C21.717 50 18.4661 49.3534 15.4329 48.097C12.3998 46.8406 9.64379 44.9991 7.32233 42.6777C5.00086 40.3562 3.15938 37.6002 1.90301 34.5671C0.646644 31.5339 -4.89212e-08 28.283 0 25C9.88008e-08 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25ZM11.925 38.075C11.4042 37.5541 11.1117 36.8477 11.1117 36.1111C11.1117 35.3745 11.4042 34.6681 11.925 34.1472L21.0722 25L11.925 15.8528C11.419 15.3289 11.139 14.6272 11.1453 13.8989C11.1517 13.1706 11.4438 12.4739 11.9588 11.9588C12.4739 11.4438 13.1706 11.1517 13.8989 11.1453C14.6272 11.139 15.3289 11.419 15.8528 11.925L25 21.0722L34.1472 11.925C34.4035 11.6597 34.71 11.4481 35.0489 11.3025C35.3878 11.1569 35.7523 11.0803 36.1211 11.0771C36.4899 11.0739 36.8557 11.1442 37.1971 11.2838C37.5385 11.4235 37.8486 11.6298 38.1094 11.8906C38.3702 12.1514 38.5765 12.4615 38.7162 12.8029C38.8558 13.1443 38.9261 13.5101 38.9229 13.8789C38.9197 14.2477 38.8431 14.6122 38.6975 14.9511C38.5519 15.29 38.3403 15.5965 38.075 15.8528L28.9278 25L38.075 34.1472C38.581 34.6711 38.861 35.3728 38.8547 36.1011C38.8483 36.8294 38.5562 37.5261 38.0412 38.0412C37.5261 38.5562 36.8294 38.8483 36.1011 38.8547C35.3728 38.861 34.6711 38.581 34.1472 38.075L25 28.9278L15.8528 38.075C15.3319 38.5958 14.6255 38.8883 13.8889 38.8883C13.1523 38.8883 12.4459 38.5958 11.925 38.075Z" fill="#ED4848"/>
                        </svg>
                    </div>
                    <div class='login-card'>
                        <div>

                            <h1>Masuk</h1>
                            <p style={{"margin-bottom":"50px"}}>Ayo masuk dan mulailah pengalaman anda!</p>

                            <label for="email">Username</label>
                            <br />
                            <input type="text" placeholder='Masukkan username Anda' name='email'
                            value={username()}
                            onInput={(e) => setUsername(e.currentTarget.value)}
                            />

                            <div class="password-ct">
                                <label for="password">Password</label>
                                <br />
                                <input type={showPassword() ? 'text' : 'password'} placeholder='Masukkan Password Anda' name="password"
                                value={password()}
                                onInput={(e) => setPassword(e.currentTarget.value)}
                                />
                                <Icon onClick={PasswordVisibility} class="pass-icon" icon={showPassword() ? "mdi:eye":"mdi:eye-off"} color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
                            </div>
                            <br />

                            <div class="login-btn-masuk">
                                <button onClick={(e) => ActionLogin1(e)}>MASUK</button>
                                <button onClick={ActionLogin}>MASUK</button>
                            </div>

                        <div class="buat-akun">
                            Apakah anda belum punya akun? <button onClick={() => (document.getElementById('form_modal_2') as HTMLDialogElement).showModal()} style={{color:"#4F48ED"}}>Buat Akun</button>
                        </div>
                    </div>
                    </div>
                </form>
            </div>
        </dialog>
        </div>

        <div>
        <dialog id="form_modal_2" class="modal">
            <div class="login-popup">
                <form method="dialog">
                    <div>
                        <svg onClick={closeModal2} style={{"margin-left":"auto", cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M50 25C50 28.283 49.3534 31.5339 48.097 34.5671C46.8406 37.6002 44.9991 40.3562 42.6777 42.6777C40.3562 44.9991 37.6002 46.8406 34.5671 48.097C31.5339 49.3534 28.283 50 25 50C21.717 50 18.4661 49.3534 15.4329 48.097C12.3998 46.8406 9.64379 44.9991 7.32233 42.6777C5.00086 40.3562 3.15938 37.6002 1.90301 34.5671C0.646644 31.5339 -4.89212e-08 28.283 0 25C9.88008e-08 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25ZM11.925 38.075C11.4042 37.5541 11.1117 36.8477 11.1117 36.1111C11.1117 35.3745 11.4042 34.6681 11.925 34.1472L21.0722 25L11.925 15.8528C11.419 15.3289 11.139 14.6272 11.1453 13.8989C11.1517 13.1706 11.4438 12.4739 11.9588 11.9588C12.4739 11.4438 13.1706 11.1517 13.8989 11.1453C14.6272 11.139 15.3289 11.419 15.8528 11.925L25 21.0722L34.1472 11.925C34.4035 11.6597 34.71 11.4481 35.0489 11.3025C35.3878 11.1569 35.7523 11.0803 36.1211 11.0771C36.4899 11.0739 36.8557 11.1442 37.1971 11.2838C37.5385 11.4235 37.8486 11.6298 38.1094 11.8906C38.3702 12.1514 38.5765 12.4615 38.7162 12.8029C38.8558 13.1443 38.9261 13.5101 38.9229 13.8789C38.9197 14.2477 38.8431 14.6122 38.6975 14.9511C38.5519 15.29 38.3403 15.5965 38.075 15.8528L28.9278 25L38.075 34.1472C38.581 34.6711 38.861 35.3728 38.8547 36.1011C38.8483 36.8294 38.5562 37.5261 38.0412 38.0412C37.5261 38.5562 36.8294 38.8483 36.1011 38.8547C35.3728 38.861 34.6711 38.581 34.1472 38.075L25 28.9278L15.8528 38.075C15.3319 38.5958 14.6255 38.8883 13.8889 38.8883C13.1523 38.8883 12.4459 38.5958 11.925 38.075Z" fill="#ED4848"/>
                        </svg>
                    </div>
                    <div class='signup-card'>
                        <div>
                    
                            <h1>Buat Akun</h1>
                            <p>Untuk memulai petualan anda, silahkan buat akun terlebih dahulu.</p>
                        
                            <label for="nama">Username</label>
                            <br />
                            <input type="text" placeholder='Masukkan username Anda' name='nama'
                            value={username2()}
                            onInput={(e) => setUsername2(e.currentTarget.value)}
                            />

                            <br />
                            <label for="email">Email</label>
                            <br />
                            <input type="text" placeholder='Masukkan email Anda' name='email'
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            />

                            <br />
                            <label for="deskripsi">Deskripsi</label>
                            <br />
                            <input type="text" placeholder='Misalnya “Seorang anak kosan yang tinggal sendiri"' name="deskripsi"
                            value={desc()}
                            onInput={(e) => setDesc(e.currentTarget.value)}
                            />


                            <div class="password-ct">
                                <label for="password">Password</label>
                                <br />
                                <input type={showPassword() ? 'text' : 'password'} placeholder='Masukkan Password Anda' name="password"
                                value={password2()}
                                onInput={(e) => setPassword2(e.currentTarget.value)}
                                />
                                <Icon onClick={PasswordVisibility} class="pass-icon" icon={showPassword() ? "mdi:eye":"mdi:eye-off"} color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
                            </div>

                            <div class="login-btn-masuk">
                                <button onClick={(e) => SendSignUp(e)}>BUAT AKUN</button>
                            </div>

                            <div class="buat-akun">
                                Apakah anda sudah punya akun? 
                                <button onClick={() => (document.getElementById('form_modal_1') as HTMLDialogElement).showModal()} style={{color:"#4F48ED"}}>Masuk</button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </dialog>
        </div>

    </div>

  );
};

export default Login;
// <div class="container-login">
    //     <div class='login-content'>
    //         <h1>Selamat Datang</h1>
    //         <p>Temukan ribuan resep lezat dan inspirasi kuliner di Lavar. Mari mulai menjelajahi dunia rasa yang memikat!</p>
    //         <img src="/src/assets/img/NasiAyamBakar.PNG" alt="" width="400" style={{margin: "auto", display: "block"}}/>
    //     </div>
        // <div class='login-card'>
        //     <div>

        //         <h1>Masuk</h1>
        //         <p>Ayo masuk dan mulailah pengalaman anda!</p>
            

            
                // <label for="email">Email</label>
                // <br />
                // <input type="text" placeholder='Masukkan email Anda' name='email'/>

                // <div class="password-ct">
                //     <label for="password">Password</label>
                //     <br />
                //     <input type={showPassword() ? 'text' : 'password'} placeholder='Masukkan Password Anda' name="password"/>
                //     <Icon onClick={PasswordVisibility} class="pass-icon" icon="mdi:eye" color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
                // </div>
                // <br />


                // <div>
                //     <button onClick={ActionLogin}>MASUK</button>
                // </div>

                // <div class="buat-akun">
                //     Apakah anda belum punya akun? <A href='/signup'>Buat Akun</A>
                // </div>

    //         </div>
    //     </div>

    // </div>