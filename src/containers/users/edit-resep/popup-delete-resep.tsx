import type { Component } from 'solid-js';
import './popup-delete-resep.css'
import { useNavigate } from '@solidjs/router';

interface DeleteResepProps{
    onClose: () => void;
    nama?: string;
    id?: number;
}

const DeleteResep: Component<DeleteResepProps> = (props) => {
  const navigate = useNavigate();
  const DeleteRecipe = async () => {
      try {
        const response =  await fetch(`/api/resep/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          alert("Resep Berhasil Dihapus");
          props.onClose();
          navigate(-1)
      } else {
          throw new Error('Failed to login');
      }
      } catch (error) {
        console.error(error);
        throw error;
      }
  }
  console.log("yang diapus", props.id)
  return (
    <div class="overlay">
    <div class="absolute z-10">
    <div class="delete-resep-popup">
        <p>Apakah anda yakin ingin menghapus resep <b style={{"font-family":"Poppins"}}>{props.nama}</b>?</p>
        <div class="btn-confirm-hapus">
            <button class="btn-dlt-confirm tdk-dlt" onClick={props.onClose}>Tidak</button>
            <button class="btn-dlt-confirm iyh-dlt" onClick={DeleteRecipe}>Hapus</button>
        </div>

    </div>
    </div>
    </div>


  );
};

export default DeleteResep;
