import {onMount, createSignal, type Component, createEffect, createMemo } from 'solid-js';
import './home.css'
import { Icon } from '@iconify-icon/solid';
import { classList } from 'solid-js/web';
import { DataResep, resultresep } from '../../../api/resep/dataresep';
import { useNavigate } from '@solidjs/router';
import { updateDataResep } from '../../../store/Resep/ResepData';
import { useStore } from '../../../store';
import { showModal } from '../../login/login';


export type BahanType = 'gula' | 'garam' | 'tomat' | 'bawang putih' | 'biji-bijian' | 'minyak zaitun' | 'susu' | 'tepung' | 'kacang' | 'kayu manis' | 'jagung' | 'ayam';

export const [bahan, setBahan] = createSignal<BahanType[]>([
    'gula', 'garam', 'tomat', 'bawang putih', 'biji-bijian', 'minyak zaitun', 'susu', 'tepung', 'kacang', 'kayu manis','jagung','ayam'
]);


// const [resepData, setResepData] = createSignal([{}]);

const Home: Component = () => {
    const navigate = useNavigate();
    const [{ sessionStore }] = useStore();

    const [resepData, setResepData] = createSignal<resultresep[]>([]);

    const [fotoResep, setFotoResep] = createSignal('')
    onMount(async () => {
        const data_resep = await DataResep("resep")
        setResepData(data_resep);
        setFotoResep('/api/resep/makanan/')
    })

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

    const [clickedFilters, setClickedFilters] = createSignal<BahanType[]>([]);

    const renderResepPopular = () => {
        const recipes = resepData() as resultresep[];

        const sortedData = recipes.sort((a, b) => {
            return b.total_ulasan - a.total_ulasan;
        });

        return (
            <div class="box-home-3">
            {sortedData.map((resep, index) => (
                <div class="home-rcp" onClick={() => detailResep(resep)}>
                <img src={`${fotoResep()}${resep.nama_foto}`} alt="" />
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
        );
          
    }

    const renderResepNames = () => {
      const recipes = resepData() as resultresep[];
    
      const filteredResep = recipes.filter((recipe) =>
        clickedFilters().every(
          (filter) => recipe.bahan_masak.some((bahan) => bahan.includes(filter))
        )
      );

      console.log('bahan yang dipilih', clickedFilters())
        if(clickedFilters().length > 0 && filteredResep.length > 0) {
        return (
            <div>
            <h2>resep terkait ({filteredResep.length} resep ditemukan)</h2>
            <div class="box-home-3">
            {filteredResep.map((resep, index) => (
                <div class="home-rcp" onClick={() => detailResep(resep)}>
                <img src={`${fotoResep()}${resep.nama_foto}`} alt="" />
                <div class='rcp-content'>
                    <div>
                        <h1>{resep.nama_resep}</h1>
                        <h2>{resep.username}</h2>
                    </div>
                    <div>
                    {resep.total_ulasan || 0} Ulasan
                    </div>
                </div>
                </div>
                
            ))}
            </div>
            </div>
        );
        // } 

        } else if (clickedFilters().length > 0 && filteredResep.length < 1) {
            return (
                <div>
                <h2>resep terkait</h2>
                <div class="box-home-3">
                    <p style={{"font-family":"Inter"}}>Tidak ditemukan resep terkait.</p>
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
    
    // const [{ sessionStore }] = useStore();
    const userDataString = sessionStore.sessionData as unknown as string;

    const handleButtonUnggahResep = () => {
        if (userDataString) {
            navigate('/unggah_resep');
        } else {
            showModal();
        }
      };

    const [searchValue, setSearchValue] = createSignal('');
    const [onSearch, setOnSearch] = createSignal(false)

    const handleSearchChange = (event: { target: { value: any; }; }) => {
        setSearchValue(event.target.value);
        if (searchValue() !== '') {
            setOnSearch(true)
        } else {
            setOnSearch(false)
        }
    }

    const renderSearchedResep = () => {
        const recipes = resepData() as resultresep[];
    
        // const searchedResep = recipes.filter((resep) =>
        // resep.nama_resep.toLowerCase().includes(searchValue().toLowerCase())
        // );

        const searchedResep = recipes.filter((resep) => {
            // Check if any field in the recipe contains the search term
            return Object.values(resep).some(
              (field) =>
                typeof field === 'string' && field.toLowerCase().includes(searchValue().toLocaleLowerCase())
            );
          });
    
        if (searchedResep.length > 0) {
        return (
            <div>
            <h2>Hasil Pencarian</h2>
            <div class="box-home-3">
                {searchedResep.map((resep, index) => (
                <div class="home-rcp" onClick={() => detailResep(resep)}>
                    <img src={`${fotoResep()}${resep.nama_foto}`} alt="" />
                    <div class="rcp-content">
                    <div>
                        <h1>{resep.nama_resep}</h1>
                        <h2>{resep.username}</h2>
                    </div>
                    <div>{resep.total_ulasan || 0} Ulasan</div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        );
        } else {
        return <p style={{"font-family":"Inter"}}>Hasil pencarian tidak ditemukan.</p>;
        }
    };
    
  


  return (
    <div class="home-page">
        {/* <div class="bm-meal" onMouseOver={handleMealHover} onMouseOut={handleMealHoverOut}>
            <div class="bookmark">
            <button onClick={handleMealPlan}>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 20 20">
                    <g transform="rotate(90 12 12)">
                    <path fill="#4f48ed" d="M19 3H5v18l7-3l7 3z"/>
                    </g>
                </svg>
            </button>
            <span class="tooltip">
                Rencana Masak
            </span>
            </div>
        </div> */}
        <div class="rencana-masak">
            <button onClick={handleButtonUnggahResep}><Icon icon="icon-park-outline:upload-logs" width='32'/></button>     
        </div>
        <div class="home-1">
            <div>
                <h1>Mau Masak Apa Hari Ini?</h1>
            </div>
            <div class="search-container">
                {/* <button class="search-sort-btn">
                    <svg class="ml-1" xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 35 42" fill="none">
                        <path d="M10.9375 4.64949C10.3573 4.64949 9.80094 4.89412 9.3907 5.32956C8.98047 5.765 8.75 6.35558 8.75 6.97139C8.75 7.58719 8.98047 8.17778 9.3907 8.61322C9.80094 9.04866 10.3573 9.29328 10.9375 9.29328C11.5177 9.29328 12.0741 9.04866 12.4843 8.61322C12.8945 8.17778 13.125 7.58719 13.125 6.97139C13.125 6.35558 12.8945 5.765 12.4843 5.32956C12.0741 4.89412 11.5177 4.64949 10.9375 4.64949ZM4.74688 4.64949C5.19882 3.28994 6.03693 2.11266 7.14569 1.27992C8.25444 0.447188 9.57925 0 10.9375 0C12.2957 0 13.6206 0.447188 14.7293 1.27992C15.8381 2.11266 16.6762 3.28994 17.1281 4.64949H32.8125C33.3927 4.64949 33.9491 4.89412 34.3593 5.32956C34.7695 5.765 35 6.35558 35 6.97139C35 7.58719 34.7695 8.17778 34.3593 8.61322C33.9491 9.04866 33.3927 9.29328 32.8125 9.29328H17.1281C16.6762 10.6528 15.8381 11.8301 14.7293 12.6628C13.6206 13.4956 12.2957 13.9428 10.9375 13.9428C9.57925 13.9428 8.25444 13.4956 7.14569 12.6628C6.03693 11.8301 5.19882 10.6528 4.74688 9.29328H2.1875C1.60734 9.29328 1.05094 9.04866 0.640704 8.61322C0.230469 8.17778 0 7.58719 0 6.97139C0 6.35558 0.230469 5.765 0.640704 5.32956C1.05094 4.89412 1.60734 4.64949 2.1875 4.64949H4.74688ZM24.0625 18.5809C23.4823 18.5809 22.9259 18.8255 22.5157 19.2609C22.1055 19.6964 21.875 20.287 21.875 20.9028C21.875 21.5186 22.1055 22.1092 22.5157 22.5446C22.9259 22.98 23.4823 23.2247 24.0625 23.2247C24.6427 23.2247 25.1991 22.98 25.6093 22.5446C26.0195 22.1092 26.25 21.5186 26.25 20.9028C26.25 20.287 26.0195 19.6964 25.6093 19.2609C25.1991 18.8255 24.6427 18.5809 24.0625 18.5809ZM17.8719 18.5809C18.3238 17.2213 19.1619 16.0441 20.2707 15.2113C21.3794 14.3786 22.7043 13.9314 24.0625 13.9314C25.4207 13.9314 26.7456 14.3786 27.8543 15.2113C28.9631 16.0441 29.8012 17.2213 30.2531 18.5809H32.8125C33.3927 18.5809 33.9491 18.8255 34.3593 19.2609C34.7695 19.6964 35 20.287 35 20.9028C35 21.5186 34.7695 22.1092 34.3593 22.5446C33.9491 22.98 33.3927 23.2247 32.8125 23.2247H30.2531C29.8012 24.5842 28.9631 25.7615 27.8543 26.5942C26.7456 27.427 25.4207 27.8742 24.0625 27.8742C22.7043 27.8742 21.3794 27.427 20.2707 26.5942C19.1619 25.7615 18.3238 24.5842 17.8719 23.2247H2.1875C1.60734 23.2247 1.05094 22.98 0.640704 22.5446C0.230469 22.1092 0 21.5186 0 20.9028C0 20.287 0.230469 19.6964 0.640704 19.2609C1.05094 18.8255 1.60734 18.5809 2.1875 18.5809H17.8719ZM10.9375 32.5123C10.3573 32.5123 9.80094 32.7569 9.3907 33.1923C8.98047 33.6278 8.75 34.2184 8.75 34.8342C8.75 35.45 8.98047 36.0406 9.3907 36.476C9.80094 36.9114 10.3573 37.1561 10.9375 37.1561C11.5177 37.1561 12.0741 36.9114 12.4843 36.476C12.8945 36.0406 13.125 35.45 13.125 34.8342C13.125 34.2184 12.8945 33.6278 12.4843 33.1923C12.0741 32.7569 11.5177 32.5123 10.9375 32.5123ZM4.74688 32.5123C5.19882 31.1527 6.03693 29.9754 7.14569 29.1427C8.25444 28.31 9.57925 27.8628 10.9375 27.8628C12.2957 27.8628 13.6206 28.31 14.7293 29.1427C15.8381 29.9754 16.6762 31.1527 17.1281 32.5123H32.8125C33.3927 32.5123 33.9491 32.7569 34.3593 33.1923C34.7695 33.6278 35 34.2184 35 34.8342C35 35.45 34.7695 36.0406 34.3593 36.476C33.9491 36.9114 33.3927 37.1561 32.8125 37.1561H17.1281C16.6762 38.5156 15.8381 39.6929 14.7293 40.5256C13.6206 41.3584 12.2957 41.8056 10.9375 41.8056C9.57925 41.8056 8.25444 41.3584 7.14569 40.5256C6.03693 39.6929 5.19882 38.5156 4.74688 37.1561H2.1875C1.60734 37.1561 1.05094 36.9114 0.640704 36.476C0.230469 36.0406 0 35.45 0 34.8342C0 34.2184 0.230469 33.6278 0.640704 33.1923C1.05094 32.7569 1.60734 32.5123 2.1875 32.5123H4.74688Z" fill="#4F48ED" fill-opacity="0.71"/>
                    </svg>
                </button> */}
                <input type="text" placeholder='Mulai eksplorasi kuliner anda'
                value={searchValue()}
                onInput={handleSearchChange}
                />
                <button class="search-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35" fill="none">
                <path d="M32.2778 35L20.0278 22.75C19.0556 23.5278 17.9375 24.1435 16.6736 24.5972C15.4097 25.0509 14.0648 25.2778 12.6389 25.2778C9.10648 25.2778 6.11722 24.0541 3.67111 21.6067C1.225 19.1593 0.0012963 16.17 0 12.6389C0 9.10648 1.2237 6.11722 3.67111 3.67111C6.11852 1.225 9.10778 0.0012963 12.6389 0C16.1713 0 19.1606 1.2237 21.6067 3.67111C24.0528 6.11852 25.2765 9.10778 25.2778 12.6389C25.2778 14.0648 25.0509 15.4097 24.5972 16.6736C24.1435 17.9375 23.5278 19.0556 22.75 20.0278L35 32.2778L32.2778 35ZM12.6389 21.3889C15.0694 21.3889 17.1357 20.5379 18.8378 18.8358C20.5398 17.1338 21.3902 15.0681 21.3889 12.6389C21.3889 10.2083 20.5379 8.14204 18.8358 6.44C17.1338 4.73796 15.0681 3.88759 12.6389 3.88889C10.2083 3.88889 8.14204 4.73991 6.44 6.44194C4.73796 8.14398 3.88759 10.2096 3.88889 12.6389C3.88889 15.0694 4.73991 17.1357 6.44194 18.8378C8.14398 20.5398 10.2096 21.3902 12.6389 21.3889Z" fill="black" fill-opacity="0.8"/>
                </svg>
                </button>
            </div>
        </div>
        
        {!onSearch() ? 
        <div class="home-2">
            <div class="selected-filters">
                {/* <div class="filter-bahan"> */}
                {clickedFilters().map((filter, index) => (
                <div class="filter-bahan">
                <span data-key={index} class="selected-filter">
                    <p>{filter}</p>
                    <button onClick={() => handleRemoveFilter(filter)} ><Icon icon="lets-icons:close-round-fill" color="white" width="19" /></button>
                </span>
                </div>
                ))}
                {/* </div> */}

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

            <div>
                <h2>resep populer</h2>
                {renderResepPopular()}
            </div>
        </div>
        :
        <div class="home-2">
            <div>
                {renderSearchedResep()}
            </div>
        </div>
        }


    </div>
  );
};

export default Home;
