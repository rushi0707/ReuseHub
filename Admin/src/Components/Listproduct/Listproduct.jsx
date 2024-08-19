import { useEffect, useState } from 'react';
import './Listproduct.css';
import cross_icon from '../../assets/cross_icon.png'

function ListProduct(){

    // Logic to fetch the all products data from API
    /* 
        step.1 Create state which holds allProduct data i.e. const [allproducts,setAllProducts] = useState([]);

        step.2 create a function fetchInfo which will fetch the data from API /allproducts 
        that we created in index.js in Backend Folder
        For this we use fetch method and when the promise return the data we parse it into json format 
        and then store data into allProduct using method setAllProducts().

        step.3 use useEffeect() hook to call this fetchInfo function.

        step.4 Now this promise will return an array which have details of all prodects.
        print it using map() method.

        step.5 create a function remove_product which will rmove the product from allProducts that we have added
        For this we add onClick listenr to cross icon so when we click on it it calls remove_product function by passing id of curr product 
    
    */
    const [allproducts,setAllProducts] = useState([]);

    // 1. API call for getting allproducts 
    async function fetchInfo(){
        await fetch('http://localhost:4000/allproducts')
        .then((res)=>res.json())
        .then((data)=>{setAllProducts(data)})
    }

    useEffect(()=>{
        fetchInfo();
    },[])

    // 2. API call for delete perticular product.
    // and after that again print all products.
    async function remove_product(id){
        await fetch('http://localhost:4000/removeproduct' , {
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':"application/json",
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
    }

    return <div className="list-product">
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
            <hr />
            {allproducts.map((product,index)=>{
                return <>
                    <div key={index} className='listproduct-format-main listproduct-format '>
                        <img  className='listproduct-product-icon' src={product.image} alt="" />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
                </div>
                <hr />
                </> 
            })}
        </div>
    </div>
}

export default ListProduct;