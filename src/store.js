
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import  productsReducer from "./components/slices/productsSlice";
import productReducer from "./components/slices/productSlice"


const reducer =combineReducers({
     productsState:productsReducer,
     productState:productReducer

})

const store=configureStore({

    reducer,
    middleware:[thunk]

});
export default store;