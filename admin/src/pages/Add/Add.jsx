import React, { useState } from 'react'
import './Add.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles", "Biryani", "Pizza", "Burger", "Chicken", "Paneer", "Momos", "Thali", "Seafood", "Beverages", "Ice Cream"];

const Add = () => {

    const [image, setImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        type: "veg"
    });

    const resetForm = () => {
        setData({ name: "", description: "", price: "", category: data.category, type: data.type });
        setImage(false);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!image) {
            toast.error('Please add an item photo');
            return;
        }
        setSubmitting(true);
        try {
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
                resetForm();
            } else {
                toast.error(response.data.message)
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false);
        }
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
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

            <form className='add-card' onSubmit={onSubmitHandler}>
                <div className='add-grid'>
                    {/* ---- Photo ---- */}
                    <div className='add-media'>
                        <span className='add-label'>Item photo</span>
                        <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                        {!image ? (
                            <label htmlFor="image" className='add-drop'>
                                <span className='add-drop-icon'>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 16V6m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
                                </span>
                                <b>Click to upload</b>
                                <span className='add-drop-hint'>PNG or JPG · up to 5 MB</span>
                            </label>
                        ) : (
                            <label htmlFor="image" className='add-drop has-img'>
                                <img src={URL.createObjectURL(image)} alt="preview" />
                                <span className='add-drop-overlay'>Change photo</span>
                            </label>
                        )}
                    </div>

                    {/* ---- Fields ---- */}
                    <div className='add-fields'>
                        <div className='add-field'>
                            <label>Item name</label>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='e.g. Paneer Tikka Roll' required />
                        </div>

                        <div className='add-field'>
                            <label>Description</label>
                            <textarea name='description' onChange={onChangeHandler} value={data.description} rows={4} placeholder='Smoky paneer, mint chutney, wrapped in a soft roomali roti.' required />
                        </div>

                        <div className='add-row2'>
                            <div className='add-field'>
                                <label>Category</label>
                                <select name='category' onChange={onChangeHandler} value={data.category}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className='add-field'>
                                <label>Price (₹)</label>
                                <input className='tnum' type="number" min="0" name='price' onChange={onChangeHandler} value={data.price} placeholder='120' required />
                            </div>
                        </div>

                        <div className='add-field'>
                            <label>Food type</label>
                            <div className='add-type'>
                                <button type='button' className={'add-type-btn veg' + (data.type === 'veg' ? ' active' : '')} onClick={() => setData(d => ({ ...d, type: 'veg' }))}>
                                    <span className='veg-dot veg'></span> Veg
                                </button>
                                <button type='button' className={'add-type-btn nonveg' + (data.type === 'nonveg' ? ' active' : '')} onClick={() => setData(d => ({ ...d, type: 'nonveg' }))}>
                                    <span className='veg-dot nonveg'></span> Non-veg
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='add-foot'>
                    <p className='add-foot-hint'>The item appears on the menu immediately after publishing.</p>
                    <div className='add-foot-actions'>
                        <button type='button' className='btn ghost' onClick={resetForm} disabled={submitting}>Reset</button>
                        <button type='submit' className='btn' disabled={submitting}>{submitting ? 'Publishing…' : 'Publish item'}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Add
