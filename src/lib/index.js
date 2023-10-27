// place files you want to import through the `$lib` alias in this folder.

import { createClient } from "@supabase/supabase-js";
import { get } from "svelte/store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// async function fetchData() {
//   let supabaseAuthId = await supabase.auth.getUser().then((response) => {
//     console.log(response);

//     let authId = response.data.user.id;

//     async function getData() {
//       const { data, error } = await supabase
//         .from("seller_auth_data")
//         .select("*")
//         .eq("auth_uid", authId);

//       if (data && data.length > 0) {
//         const rowData = data[0];
//         console.log("Fetched row data:", rowData);
//         // Access the specific columns using rowData.column_name
//       } else {
//         console.log("Row not found.");
//       } // Replace 'id' with the column name and 'rowId' with your condition
//     }
//     getData();
//   });
// }
// fetchData();
/**
 * * To note : if sign up or authentication crashed the blame goes on export default line {supabase, fetchdata}
 * * in that case remove fetchdata
 *
 * //Lmao
 */

export default supabase;
