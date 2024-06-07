// ResepData.ts
import { createSignal, onCleanup } from 'solid-js';

// Define a type for the recipe data
export type RecipeData = {
  id_resep: number;
  id_kategori: number;
  id_akun: number;
  username: string;
  nama_resep: string;
  kategori?: string;
  total_bahan: number;
  waktu_masak: number;
  bahan: string[];
  langkah: string[];
  nama_foto: string;
  id_foto?: number;
};

export const [dataResep, setDataResep] = createSignal<RecipeData>({
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
});

// Function to update the recipe data
export const updateDataResep = (newData: Partial<RecipeData>) => {
  setDataResep((prevDataResep) => {
    const updatedData = {
      ...prevDataResep,
      ...newData,
    };
    // Store the updated data in localStorage
    localStorage.setItem('dataResep', JSON.stringify(updatedData));
    return updatedData;
  });
};

// Cleanup function to remove the data from localStorage when the component unmounts
onCleanup(() => {
  localStorage.removeItem('dataResep');
});
