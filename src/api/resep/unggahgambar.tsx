// export type resultresep = {
//     "id_foto": number,
//     "nama_foto" : string,
//     "id_resep" : number
// }


// export async function UnggahGambar(query: string): Promise<resultresep[]>{
//     if (query.trim() === "") return [];
//     // /?q=${encodeURI(query)}
    
             
//     const response = await fetch(
//       `/api/resep/show`
//     );
//     // http://localhost:8001
    
//     const results = await response.json();
//     console.log("response ", results)
//     // const documents = results as resultresep[];
//     // console.log("resep",documents);

//     // return documents.slice(0, documents.length).map(({ id_resep,username,nama_resep,nama_kategori,total_bahan,waktu_masak,bahan_masak,cara_buat,id_kategori,id_akun    }) => ({
//     //     id_resep,username,nama_resep,nama_kategori,total_bahan,waktu_masak,bahan_masak,cara_buat,id_kategori,id_akun  
//     //   }));
//     const documents = results as resultresep[];
// console.log("resep", documents);

// // ...

// const recipesWithArray = documents.map(resep => ({
//     ...resep,
//     bahan_masak: Array.isArray(resep.bahan_masak) ? resep.bahan_masak : JSON.parse(resep.bahan_masak || '[]'),
//     cara_buat: Array.isArray(resep.cara_buat) ? resep.cara_buat : JSON.parse(resep.cara_buat || '[]'),
// }));

// // ...

// return recipesWithArray.slice(0, documents.length);

//   }