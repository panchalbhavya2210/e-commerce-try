// place files you want to import through the `$lib` alias in this folder.

import { createClient } from "@supabase/supabase-js";
import { get } from "svelte/store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;
