// const supabase = require("../../../lib/index");
import supabase from "../../../lib/index";
export const load = ({ params }) => {
  const fetchData = async (id) => {
    console.log(id);
    const { data, error } = await supabase
      .from("ProductData")
      .select("*")
      .eq("product_category", id);
    console.log(data);
    return data;
  };

  return {
    product: fetchData(params.productSlug),
  };
};
