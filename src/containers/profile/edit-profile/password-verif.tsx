import { createSignal, type Component, onCleanup } from 'solid-js';
import './password-verif.css'
import { Icon } from '@iconify-icon/solid';

interface PasswordVerifProps {
    onClose: () => void;
    onPasswordChange: (newPassword: string) => void;
}
const PasswordVerif: Component<PasswordVerifProps> = (props) => {
    const [password, setPassword] = createSignal("");

    const [showPassword, setShowPassword] = createSignal(false);

    const PasswordVisibility = () => {
    setShowPassword(!showPassword());
    };

    const savePassword = () => {
        // Save the password value or perform any desired action
        // For now, let's just log it to the console
        console.log('Password saved:', password());
    
        // Notify the parent component about the password change
        props.onPasswordChange(password());
        props.onClose();
      };

      let verifPassRef: HTMLElement | null = null;

      const handleClickOutside = (e: MouseEvent) => {
        // Check if the click is outside the verif-pass-popup element
        if (verifPassRef && !verifPassRef.contains(e.target as Node)) {
          props.onClose();
        }
      };
    
      // Add a click event listener to the document body
      onCleanup(() => {
        document.body.removeEventListener('click', handleClickOutside);
      });
    
      // Add a click event listener to the document body
      document.body.addEventListener('click', handleClickOutside);
    
  return (
    <div class="overlay">
    <div class="absolute z-10">
    <div 
          class="verif-pass-popup"
          // id="verif-pass"
          ref={(el) => (verifPassRef = el)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
        <div>
            <h1>Verifikasi Password</h1>
            <p>Masukkan password anda</p>
        </div>
        <div class='password-ctn'>
            {/* <label>Password</label> */}
            {/* <br /> */}
            <input type={showPassword() ? 'text' : 'password'}
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}  
            />
            <Icon onClick={PasswordVisibility} class="pass-icon" icon={showPassword() ? "mdi:eye":"mdi:eye-off"} color="rgba(187, 187, 187, 0.7333333333333333)" width="28" />
        </div>
        <div class="btn-verif-save">
            <button onClick={savePassword}>Simpan</button>
        </div>
    </div>
    </div>
    </div>
  );
};

export default PasswordVerif;
