import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes,Route } from 'react-router-dom';
import AddProduct from '../../Components/Addproduct/Addproduct';
import ListProduct from '../../Components/Listproduct/Listproduct';

function Admin(){
    return <div className='admin'>
        <Sidebar></Sidebar>
        <Routes>
            <Route path='/addproduct' element={<AddProduct></AddProduct>}></Route>
            <Route path='/listproduct' element={<ListProduct></ListProduct>}></Route>
        </Routes>
    </div>
}
export default Admin;