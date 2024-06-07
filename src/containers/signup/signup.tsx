import { createSignal, type Component } from 'solid-js';
import './signup.css'
import { A } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';

const SignUp: Component = () => {
    const [formData, setFormData] = createSignal({
        nama: '',
        email:'',
        description: '',
        password: ''
    });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const Account = {

        };

        console.log('signup: ', Account)
        
        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({Account})
            });

            if (response.ok) {
                alert('Berhasil buat akun');
            } else {
                const error = await response.text();
                alert(`Gagal menambah akun. ${error}`);
                // console.err
            }
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
            console.error('Terjadi kesalahan:', error);
        }
    };


    const [showPassword, setShowPassword] = createSignal(false);

    const PasswordVisibility = () => {
    setShowPassword(!showPassword());
    };
    
  return (
    <div class="container-signup">
        <div class='signup-content'>
            <h1>Selamat Datang</h1>
            <p>Temukan ribuan resep lezat dan inspirasi kuliner di Lavar. Mari mulai menjelajahi dunia rasa yang memikat!</p>
            <img src="/src/assets/img/NasiAyamBakar.PNG" alt="" width="400" style={{margin: "auto", display: "block"}}/>
        </div>
        <div class='signup-card'>
            <div>

                <h1>Buat Akun</h1>
                <p>Untuk memulai petualan anda, silahkan buat akun terlebih dahulu.</p>
            
                <br />
                <label for="nama">Nama</label>
                <br />
                <input type="text" placeholder='Masukkan nama Anda' name='nama'/>

                <br />
                <label for="email">Email</label>
                <br />
                <input type="text" placeholder='Masukkan email Anda' name='email'/>

                <br />
                <label for="deskripsi">Deskripsi</label>
                <br />
                <input type="text" placeholder='Misalnya “Seorang anak kosan yang tinggal sendiri"' name="deskripsi"/>

                <div style={{position:"relative"}}>
                    <label for="password">Password</label>
                    <br />
                    <input type={showPassword() ? 'text' : 'password'} placeholder='Masukkan Password Anda' name="password"/>
                    <Icon onClick={PasswordVisibility} class="pass-icon" icon="mdi:eye" color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
                </div>

                <div>
                    <button>BUAT AKUN</button>
                </div>

                <div class="buat-akun">
                    Apakah anda sudah punya akun?  <A href='/login'>Masuk</A>
                </div>

            </div>
        </div>

    </div>
  );
};

export default SignUp;
