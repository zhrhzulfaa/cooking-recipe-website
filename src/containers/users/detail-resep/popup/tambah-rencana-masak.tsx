import { createEffect, type Component, onCleanup } from 'solid-js';
import './tambah-rencana-masak.css'

interface TambahRencanaMasakProps {
    onClose: () => void
}



const TambahRencanaMasak: Component<TambahRencanaMasakProps> = (props) => {
    createEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (target && !target.closest('.add-meal-plan1')) {
            props.onClose();
          }
        };
    
        window.addEventListener('click', handleClickOutside);
    
        onCleanup(() => {
          window.removeEventListener('click', handleClickOutside);
        });
      });
    
  return (
    <div style={{position:"absolute"}}>
        <div class="add-meal-plan1">
            <div>
                <label>Pilih Tanggal</label>
                <input type="datetime-local" />
            </div>

            <button>Simpan</button>
        </div>
    </div>


  );
};

export default TambahRencanaMasak;
