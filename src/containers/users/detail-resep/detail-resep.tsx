import { createSignal, type Component, onMount, createEffect, onCleanup } from 'solid-js';
import './detail-resep.css'
import './popup/tambah-rencana-masak.css'
import { Icon } from '@iconify-icon/solid';
import BahanResep from './bahan-langkah';
import { dataResep } from '../../../store/Resep/ResepData';
import { DataResep } from '../../../api/resep/dataresep';
import { DataUlasan, resultulasan } from '../../../api/ulasan';
import TambahRencanaMasak from './popup/tambah-rencana-masak';
import { dataProfile } from '../../../store/profile/ProfileStore';
import { A, useLocation } from '@solidjs/router';
import { useStore } from '../../../store';
import { showModal } from '../../login/login';

export const [isiResep, setIsiResep] = createSignal({
  id_resep: 0,
  id_kategori: 0,
  id_akun: 0,
  username: '',
  nama_resep: '',
  kategori: '',
  total_bahan: 0,
  waktu_masak: 0,
  bahan: [''],
  langkah: [''],
  nama_foto: '',
  id_foto: 0
})

export const [isiUlasan, setIsiUlasan] = createSignal<resultulasan[]>([])

const DetailResep: Component = () => {
  const location = useLocation();
  const [fotoResep, setFotoResep] = createSignal('');
  const[totalReview, setTotalReview] = createSignal(0)

  onMount(async () => {
    const storedData = localStorage.getItem('dataResep');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setIsiResep(parsedData);
      setFotoResep(`/api/resep/makanan/${parsedData.nama_foto}`);

    }

    // setFotoResep(`/api/makanan/${isiResep().nama_foto}`);

    const ulasan = await DataUlasan('reviews');
    const setReviews = ulasan
      .filter((item) => item.id_resep === isiResep().id_resep)
      .map((item) => ({
        ...item
      }));

      setIsiUlasan(setReviews);
      setTotalReview(setReviews.length)
  });

  console.log("id", isiResep().id_resep)
  const [popUpMeal, setPopUpMeal] = createSignal(false);

  const [{ sessionStore }] = useStore();
  const userDataString = sessionStore.sessionData as unknown as string;

  function showPopUpMeal() {
    if (userDataString) {
      setPopUpMeal(!popUpMeal());
      console.log(dataProfile().id)
    } else {
      showModal();
    }

  }

  function closePopUpMeal() {
    setPopUpMeal(false);
  }

  const [timestamp, setTimestamp] = createSignal('')

  const TambahRencanaMasak = async () => {
    const currentTimestamp = new Date();
    const selectedTimestamp = timestamp(); // Assuming timestamp() returns the selected timestamp
  
    // Calculate the timestamp for 30 minutes from now
    const thirtyMinutesFromNow = new Date(currentTimestamp.getTime() + 30 * 60 * 1000);
  
    if (new Date(selectedTimestamp) >= thirtyMinutesFromNow) {
      const dataToSend = {
        id_rencanamasak: 0,
        waktu: `${selectedTimestamp}:00`,
        id_akun: dataProfile().id,
        id_resep: isiResep().id_resep
      };
  
      console.log("ini apa", dataToSend);
  
      try {
        const response = await fetch(`/api/rencana_masak/ins`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
  
        if (response.ok) {
          alert('Rencana masak berhasil ditambah!');
          setPopUpMeal(false);
          
        } else {
          const errorMessage = await response.text();
          alert(`Gagal menambah data. ${errorMessage}`);
        }
      } catch (error) {
        console.log("Gagal", error);
      }
    } else {
      alert('Masukkan waktu minimal 30 menit dari sekarang.');
    }
  };
  
  return (
    <div class="detail-resep-page">
      <div class="head-detail-resep">
        <img src={fotoResep()} alt="" />
        <div>
          <h1>{isiResep().nama_resep}</h1>
          <h2>{isiResep().username}</h2>
          <h3>{totalReview()} Ulasan</h3>
          <div class="isi-kategori-resep">{isiResep().kategori}</div>
          <button onClick={showPopUpMeal}><Icon icon="material-symbols:edit-calendar" width="23" style={{"margin-right":"7px"}}/>Tambah Rencana Masak</button>
          {popUpMeal() && 
          <div style={{position:"absolute"}}>
              <div class="add-meal-plan1">
                  <div>
                      <label>Pilih Tanggal</label>
                      <input type="datetime-local" 
                      value={timestamp()}
                      onInput={(e) => setTimestamp(e.currentTarget.value)}
                      />
                  </div>
      
                  <button onClick={TambahRencanaMasak}>Simpan</button>
              </div>
          </div>
          }
        </div>
        <div class="info-resep-ctn">
          <div class="info-resep-card t1">
            <p style={{"line-height":"2.2"}}>Total Bahan</p>
            <h3>{isiResep().total_bahan}</h3>
          </div>
          <div  class="info-resep-card t2">
            <p>Waktu Masak</p>
            <div style={{display:"flex", "align-items":"center", "flex-direction":"row"}}>
            <Icon icon="octicon:stopwatch-16" width="35" class="pb-1 mr-1"/>
            <h3 style={{"line-height":"1.4"}}>{isiResep().waktu_masak}</h3>
            </div>
            <p>Menit</p>
          </div>
        </div>
      </div>
      <div class="detail-resep-ctn">
        <A href="/detail_resep_bahan_langkah" classList={{ active: location.pathname === '/detail_resep_bahan_langkah' }}>
          <div class="ctn-btn-item">Bahan & Langkah</div>
        </A>

        <A href="/detail_resep_ulasan" classList={{ active: location.pathname === '/detail_resep_ulasan' }}>
          <div class="ctn-btn-item">Ulasan</div>
        </A>
      </div>
    </div>
  );
};

export default DetailResep;
