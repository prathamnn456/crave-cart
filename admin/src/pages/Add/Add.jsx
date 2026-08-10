import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {


    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        type: "veg"
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("type", data.type);
        formData.append("image", image);
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                description: "",
                price: "",
                category: data.category,
                type: data.type
            })
            setImage(false);
        }
        else {
            toast.error(response.data.message)
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    return (
        <div className='add'>
            <div className="page-head">
                <div>
                    <h1>Add a new item</h1>
                    <div className="sub">List a dish on the CraveCart menu.</div>
                </div>
            </div>

            <form className='add-form' onSubmit={onSubmitHandler}>
                <div className='add-field'>
                    <label>Item photo</label>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    {!image ? (
                        <label htmlFor="image" className='add-upload'>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 16V6m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
                            <b>Click to upload a photo</b>
                            <span>PNG or JPG, up to 5 MB</span>
                        </label>
                    ) : (
                        <label htmlFor="image" className='add-preview'>
                            <img src={URL.createObjectURL(image)} alt="preview" />
                            <span>Click to change</span>
                        </label>
                    )}
                </div>

                <div className='add-field'>
                    <label>Item name</label>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='e.g. Paneer Tikka Roll' required />
                </div>

                <div className='add-field'>
                    <label>Description</label>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} rows={5} placeholder='Smoky paneer, mint chutney, wrapped in a soft roomali roti.' required />
                </div>

                <div className='add-row2'>
                    <div className='add-field'>
                        <label>Category</label>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burger</option>
                            <option value="Chicken">Chicken</option>
                            <option value="Paneer">Paneer</option>
                            <option value="Momos">Momos</option>
                            <option value="Thali">Thali</option>
                            <option value="Seafood">Seafood</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Ice Cream">Ice Cream</option>
                        </select>
                    </div>
                    <div className='add-field'>
                        <label>Price ({'₹'})</label>
                        <input className='tnum' type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='120' />
                    </div>
                </div>

                <div className='add-field'>
                    <label>Food type</label>
                    <div className='add-type'>
                        <button
                            type='button'
                            className={'add-type-btn veg' + (data.type === 'veg' ? ' active' : '')}
                            onClick={() => setData(d => ({ ...d, type: 'veg' }))}
                        >
                            <span className='veg-dot veg'></span> Veg
                        </button>
                        <button
                            type='button'
                            className={'add-type-btn nonveg' + (data.type === 'nonveg' ? ' active' : '')}
                            onClick={() => setData(d => ({ ...d, type: 'nonveg' }))}
                        >
                            <span className='veg-dot nonveg'></span> Non-veg
                        </button>
                    </div>
                </div>

                <button type='submit' className='btn'>Publish item</button>
            </form>
        </div>
    )
}

export default Add
