/*
    we know that in html to take image as a input we use input type as file.
    and this shows choose file button
    but here we hide that button using hidden attribute of image file tag
    and when we click on label we can choose image

    Here we use [image,setImage] state to manage show the selected images.

    1. Create state [image,setImage]
    2. Create function imageHandler() which will set the image.
       Here we pass event object from image tag
       i.e. when we dont select any image it shows upload image icon
       otherwise it will show selected image.
*/

import './Addproduct.css';
import upload_area from '../../assets/upload_area.svg';
import { useState } from 'react';

function AddProduct(){

    // State to show selected image.
    const [image,setImage] = useState(false);

    function imageHandler(event)
    {
        setImage(event.target.files[0]);
    } 

    // We use this state take values from all fields anad pass it to /addproduct API
    // in backend folder in index.js file.
    // productDetails is a object which will store info of all products.
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    // Here we add new product details to productDtail state.
    async function changeHandler(event){
        setProductDetails( {...productDetails,[event.target.name]:event.target.value} )
    }

    // 1. API call for /upload and /addProduct using fetch function function .
    const Add_product = async()=>{
        console.log(productDetails);

        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        /* end point for /upload that we created in index.js in backend folder */
        await fetch('http://localhost:4000/upload' , {
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});

        if(responseData.success)
        {
            product.image = responseData.image_url;
            console.log(product);

            // endpoint to /addproduct that we created in index.js in backend folder
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((res)=>res.json()).then((data)=>{
                data.success ? alert("Product Added"):alert("Failed")
            })
        }

    }

    return <div className="add-product">
        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productDetails.name} onChange={(event)=>changeHandler(event)} type="text" name="name" placeholder='Type here'  />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
            </div> 
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
            </div>  
        </div>
        <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                   <option value="women">
                    Women</option> 
                    <option value="men">
                    Men</option> 
                    <option value="kids">
                    Kids</option> 
                </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
        </div> 
        <button onClick={()=>{Add_product()}} className='addproduct-btn'>
            ADD    
        </button> 
         
    </div>
}

export default AddProduct;