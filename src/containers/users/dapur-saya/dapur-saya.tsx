import { createSignal, type Component, onMount } from 'solid-js';
import { BahanType, bahan } from '../home/home';
import { DataResep, resultresep } from '../../../api/resep/dataresep';
import { useNavigate } from '@solidjs/router';
import { updateDataResep } from '../../../store/Resep/ResepData';
import { Icon } from '@iconify-icon/solid';
import './dapur-saya.css';

const DapurSaya: Component = () => {
    const navigate = useNavigate();

    const [clickedFilters, setClickedFilters] = createSignal<BahanType[]>([]);

    const [resepData, setResepData] = createSignal<resultresep[]>([]);

    onMount(async () => {
        const data_resep = await DataResep("resep")
        setResepData(data_resep);
    });

    function detailResep(resep: resultresep){
        navigate('/detail_resep_bahan_langkah');
        updateDataResep({
            id_resep: resep.id_resep,
            id_kategori: resep.id_kategori,
            id_akun: resep.id_akun,
            username: resep.username,
            nama_resep: resep.nama_resep,
            kategori: resep.nama_kategori,
            total_bahan: resep.total_bahan,
            waktu_masak: resep.waktu_masak,
            bahan: resep.bahan_masak,
            langkah: resep.cara_buat,
            nama_foto: resep.nama_foto
        });
    }

    const renderResepNames = () => {
      const recipes = resepData() as resultresep[];
    
      const filteredResep = recipes.filter((recipe) =>
        clickedFilters().every(
          (filter) => recipe.bahan_masak.some((bahan) => bahan.includes(filter))
        )
      );

      console.log('bahan yang dipilih', clickedFilters())
        if(clickedFilters().length > 0) {
        return (
            <div>
            <h2>resep terkait ({filteredResep.length} Ditemukan)</h2>
            <div class="box-home-3">
            {filteredResep.map((resep, index) => (
                <div class="home-rcp" onClick={() => detailResep(resep)}>
                <img src={`/api/resep/makanan/${resep.nama_foto}`} alt="" />
                <div class='rcp-content'>
                    <div>
                        <h1>{resep.nama_resep}</h1>
                        <h2>{resep.username}</h2>
                    </div>
                    <div>
                    {resep.total_ulasan} Ulasan
                    </div>
                </div>
                </div>
                
            ))}
            </div>
            </div>
        );

        } 
    };

    
    const renderbahanItems = () => {
        return (
            <div class="box-home-2">
                {bahan().map((bahanItem: BahanType, index: number) => (
                    <div
                    class={`item-box ${bahanItem} ${clickedFilters().includes(bahanItem) ? "active" : ""}`}
                        // class={`item-box ${bahanItem}`}
                        data-key={index} // Pindahkan key ke dalam data-key
                        onClick={() => handleItemClick(bahanItem)}
                    >
                        {bahanItem}
                    </div>
                ))}
            </div>
        );
    };
    
    const handleRemoveFilter = (filter: BahanType) => {
        const updatedFilters = clickedFilters().filter((f) => f !== filter);
        setClickedFilters(updatedFilters);
    }

    const handleItemClick = (bahanItem: BahanType) => {
        const updatedFilters = [...clickedFilters()];
        const index = updatedFilters.indexOf(bahanItem);
    
        if (index === -1) {
            updatedFilters.push(bahanItem);
        } else {
            updatedFilters.splice(index, 1);
        }
    
        setClickedFilters(updatedFilters);
    };

    const clearFilters = () => {
        setClickedFilters([]);
    };
  return (
    <div class="dapur-saya-page">
        <h1>Dapur Saya</h1>
        <div class="home-2">
            <div class="selected-filters">
                {clickedFilters().map((filter, index) => (
                <div class="filter-bahan">
                <span data-key={index} class="selected-filter">
                    <p>{filter}</p>
                    <button onClick={() => handleRemoveFilter(filter)} ><Icon icon="lets-icons:close-round-fill" color="white" width="19" /></button>
                </span>
                </div>
                ))}

                {clickedFilters().length > 0 && (
                    <button class="clear-filters-btn" onClick={() => setClickedFilters([])} 
                    style={{"font-family":"Poppins",opacity:"0.6","font-weight":"800"}}
                    >
                        Bersihkan Semua
                    </button>
                )}
            </div>
            <div>
                <h2>Bahan Masakan</h2>
                {renderbahanItems()}
            </div>
            <div>
                {renderResepNames()}
            </div>
        </div>
    </div>
  );
};

export default DapurSaya;