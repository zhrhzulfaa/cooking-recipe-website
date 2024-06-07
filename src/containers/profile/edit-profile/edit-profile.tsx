import { createSignal, type Component, onMount, onCleanup } from 'solid-js';
import './edit-profile.css'
import Profile from '../profile';
import { Icon } from '@iconify-icon/solid';
import { DataAccount } from '../../../api/account';
import { A, useNavigate } from '@solidjs/router';
import { profilePic } from '../../../store/profile/ProfileStore';
import ProfilePicture from './profile-picture';
import PasswordVerif from './password-verif';

const EditProfile: Component = () => {
    const navigate = useNavigate()
    const [id, setID] = createSignal(0)
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [desc, setDesc] = createSignal("");
    const [profpic, setProfpic] = createSignal("");
    // const [fileProfile, setFileProfile] = createSignal<File | null>(null)

    const [pictureUrl, setPictureUrl] = createSignal("")

    console.log("p", pictureUrl())
    console.log("p1", profpic())
    onMount(async () => {
        const dataprofile = await DataAccount("akun");
        console.log("Data akun", dataprofile);
        dataprofile.forEach((account) => {
            setID(account.id_akun);
            setUsername(account.username);
            setEmail(account.email);
            setPassword(account.password);
            setDesc(account.deskripsi_profil);
            setProfpic(account.foto_profil);  
            console.log(account.foto_profil);
            // setPictureUrl(`/api/account/profile-picture/${account.foto_profil}`);    
            // Lakukan sesuatu dengan setiap nilai kolom
            // console.log(`ID Akun: ${id_akun}, Username: ${username}, Email: ${email}, Password: ${password}, Deskripsi Profil: ${deskripsi_profil}`);
          });
        //   UserProfile();
    });

    // function handleButtonClick() {
    //     const fileInput = document.getElementById('fileInput');
    //     if (fileInput) {
    //       fileInput.click();
          
    //     } else {
    //       console.error("File input element not found");
    //     }
    //   }
    const [fileProfile, setFileProfile] = createSignal<File | null>(null);

      
    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];

        if (file) {
            setFileProfile(() => file);
        } else {
            setFileProfile(null);
        }
    };
    
    const onSaveFile = (file: File | null) => {
        setFileProfile(() => file);
    };

    const handleDeleteFile = () => {
        setFileProfile(null);
    };

    const [verifPass, setVerifPass] = createSignal(false);

    function showVerifPass(){
        setVerifPass(true)
    }

    function closeVerifPass(){
        setVerifPass(false)
    }

    const [confirmPass, setConfirmPass] = createSignal('')

    const handlePasswordChange = (newPassword: string) => {
        // Do something with the new password value
        console.log('New password:', newPassword);
        setPassword(newPassword)
      };

    const SendEdit = async () => {

        if (password() === '') {
            showVerifPass();
            console.log("sip");
            // setPassword(confirmPass());
            console.log("ppppp", password());
            return;
        }

        const editedData = {
            id_akun: id(),
            username: username(),
            email: email(),
            password: password(),
            deskripsi_profil: desc(),
            // foto_profil: profpic()

        }

        const edited = new FormData();
        edited.append('id_akun',`${id()}`);
        edited.append('username',`${username()}`);
        edited.append('email',`${email()}`);
        edited.append('password',`${password()}`);
        edited.append('deskripsi_profil',`${desc()}`);
        // edited.append('foto_profil', fileProfile());
        if (fileProfile()) {
            edited.append('foto_profil', fileProfile()!);
        }
        console.log('Edit Akun ', editedData);

        try {
            const response = await fetch('/api/account/update', {
                method: 'PUT',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: edited,
            });

            if(response.ok){
                alert("Data berhasil diubah");
                // window.location.reload();
                sessionStorage.setItem('userData', JSON.stringify(editedData));
                navigate('/profile');
            } else {
                const errorMessage = await response.text();
                alert(`Gagal mengubah data. Pesan kesalahan: ${errorMessage}`);
                console.error('Gagal mengubah data:', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const [showPassword, setShowPassword] = createSignal(false);

    const PasswordVisibility = () => {
    setShowPassword(!showPassword());
    };

    // const [img_profile, setImgProfile] = createSignal(`http://localhost:8081/img/${profpic()}`);

//   function handleImageError() {
//     const defaultImage = "/src/assets/img/profile.jpg"; // Ganti dengan jalur gambar default Anda
//     setImgProfile(defaultImage);
//   }
  

//   function handleImageError() {
//     const defaultImage = "/src/assets/img/profile.jpg"; // Ganti dengan jalur gambar default Anda
//     setPictureUrl(defaultImage);
//     }

  return (
    <div class="edit-profile">
        <div class="title-edit">
            <A href='/profile'>
            <svg style={{"margin-right":"15px"}} class="" xmlns="http://www.w3.org/2000/svg" width="15" height="29" viewBox="0 0 17 29" fill="none">
                <path d="M14.8281 1.84375L2.17188 14.5L14.8281 27.1562" stroke="black" stroke-width="3.28125" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1>Edit Profile</h1>
            </A>
        </div>
        <div class="edit-profile-card">
            <div class="edit-profile-img">
            {fileProfile() && fileProfile() instanceof File && (
            <div>
                {fileProfile() && <img src={URL.createObjectURL(fileProfile() as Blob)} alt="Selected Profile" />}
            </div>
            )}
            {!fileProfile() && profilePic()}
                {/* {profilePic()} */}
                <ProfilePicture onSaveFile={onSaveFile} onDeleteFile={handleDeleteFile}/>
                {/* <label for="fileInput"><Icon icon="bi:camera-fill" color="white" width="15" /></label>
                <input type="file" id="fileInput" accept=".png, .jpg" style="display: none;" 
                onChange={handleFileChange}
                /> */}
                {/* <button onClick={handleButtonClick}><Icon icon="bi:camera-fill" color="white" width="15" /></button> */}
            </div>
            <div class="edit-profile-1">
                <div style={{display:"flex","flex-direction":"column", gap:"3vh"}}>
                    <div>
                        <label>Username</label>
                        <br />
                        <input type="text" 
                        value={username()}
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        />
                    </div>

                    <div>
                        <label>Deskripsi</label>
                        <br />
                        <textarea name="" id="" cols="30" rows="10"
                        value={desc()}
                        onInput={(e) => setDesc(e.currentTarget.value)}
                        />
                    </div>
                        
                </div>

                <div style={{display:"flex","flex-direction":"column", gap:"3vh"}}>
                    <div>
                        <label>Email</label>
                        <br />
                        <input type="text" 
                        value={email()}
                        onInput={(e) => setEmail(e.currentTarget.value)}
                        />
                    </div>  
                    <div class='password-ctn'>
                        <label>Password</label>
                        <br />
                        <input type={showPassword() ? 'text' : 'password'}
                        value={password()}
                        onInput={(e) => setPassword(e.currentTarget.value)}  
                        />
                        <Icon onClick={PasswordVisibility} class="pass-icon" icon={showPassword() ? "mdi:eye":"mdi:eye-off"} color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
                    </div>
                    <div>
                        <button class="simpan-edit" onClick={SendEdit}>SIMPAN</button>
                    </div>
                </div>

            </div>
        </div>
        {verifPass() && <PasswordVerif onPasswordChange={handlePasswordChange} onClose={closeVerifPass}/>}
    </div>
  );
};

export default EditProfile;
