// const supabase = require("../../../lib/index");
import supabase from "../../../lib/index";
export const load = ({ fetch, params }) => {
  const fetchData = async (id) => {
    const { data, error } = await supabase
      .from("ProductData")
      .select("*")
      .eq("product_category", id);

    return data;
  };

  return {
    product: fetchData(params.productSlug),
  };
};
