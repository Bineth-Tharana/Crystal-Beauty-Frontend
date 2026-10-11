import axios from "axios";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";

export default function ProductOverviewPage(){
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading")//loading, success, error
    const [product, setProduct] = useState(null);

    useEffect(
        ()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId).then(
            (response)=>{
                console.log(response.data);
                setProduct(response.data);
                setStatus("success");
            }
        ).catch(
            (error)=>{
                console.log(error);
                setStatus("error");
                toast.error("Error fetching product details");
            }
        )
        }
    ,[])
    return(
        <div className="bg-secondary font-fancy">
            This is overview for product {JSON.stringify(product)}
        </div>
    )
}