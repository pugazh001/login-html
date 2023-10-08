import { Fragment, useEffect } from "react";
import MetaData from "./layouts/MetaData";
import {  getProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./Products/Product";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
//import error from "../../../backend/middlewares/error";


export default function Home (){
   
  const dispatch =useDispatch();

  const {products,loading,error}=useSelector((state)=>state.productsState)

  useEffect(()=>{
    if(error){
      return toast.error(error,{
        position:toast.POSITION.BOTTOM_CENTER
      })

    }
 //   toast.success("hello 2pcart",{
     // position:toast.POSITION.BOTTOM_CENTER
  //  })
   //  toast.error("error")
     dispatch(getProducts)
  },[error])
    return(
    <Fragment>
                 {loading ? <Loader />:
        <Fragment>
          <MetaData title={'Buy Best Product'} />
               <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
      <div className="row">
        {products && products.map(product=>(

              <Product
              product={product}
              />
        ))}
       

      </div>
    </section>

     
        </Fragment>
              }
    </Fragment>   
        
    )
}