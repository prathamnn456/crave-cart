import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles", "Biryani", "Pizza", "Burger", "Chicken", "Paneer", "Momos", "Thali", "Seafood", "Beverages", "Ice Cream"];

const List = () => {

  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);   // item currently being edited
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Salad", type: "veg" });
  const [newImage, setNewImage] = useState(null); // optional replacement image
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type || "veg",
    });
    setNewImage(null);
  }

  const closeEdit = () => {
    setEditing(null);
    setNewImage(null);
  }

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("id", editing._id);
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", Number(form.price));
      fd.append("category", form.category);
      fd.append("type", form.type);
      if (newImage) fd.append("image", newImage);

      const res = await axios.post(`${url}/api/food/update`, fd);
      if (res.data.success) {
        toast.success(res.data.message);
        closeEdit();
        await fetchList();
      } else {
        toast.error(res.data.message || "Error");
      }
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list'>
      <div className="page-head">
        <div>
          <h1>Menu</h1>
          <div className="sub">{list.length} item{list.length === 1 ? '' : 's'} live on CraveCart.</div>
        </div>
      </div>

      <div className='menu-grid'>
        {list.map((item, index) => (
          <div key={index} className='food-card'>
            <div className='food-thumb'>
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <button className='food-edit' title='Edit item' onClick={() => openEdit(item)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className='food-remove' title='Remove item' onClick={() => removeFood(item._id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className='food-body'>
              <div className='food-row1'>
                <b>{item.name}</b>
                <span className='food-price tnum'>{currency}{item.price}</span>
              </div>
              <p className='food-desc'>{item.description}</p>
              <span className='food-cat'>{item.category}</span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className='edit-overlay' onClick={closeEdit}>
          <form className='edit-modal' onClick={(e) => e.stopPropagation()} onSubmit={saveEdit}>
            <div className='edit-head'>
              <h3>Edit item</h3>
              <button type='button' className='edit-close' onClick={closeEdit} aria-label='Close'>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className='edit-image'>
              <img
                src={newImage ? URL.createObjectURL(newImage) : `${url}/images/${editing.image}`}
                alt='preview'
              />
              <label className='edit-image-btn'>
                Change photo
                <input type='file' accept='image/*' hidden onChange={(e) => { if (e.target.files[0]) setNewImage(e.target.files[0]); e.target.value = ''; }} />
              </label>
            </div>

            <div className='edit-field'>
              <label>Item name</label>
              <input name='name' value={form.name} onChange={onFormChange} type='text' required />
            </div>

            <div className='edit-field'>
              <label>Description</label>
              <textarea name='description' value={form.description} onChange={onFormChange} rows={3} required />
            </div>

            <div className='edit-row2'>
              <div className='edit-field'>
                <label>Category</label>
                <select name='category' value={form.category} onChange={onFormChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className='edit-field'>
                <label>Price (₹)</label>
                <input className='tnum' name='price' value={form.price} onChange={onFormChange} type='number' min='0' required />
              </div>
            </div>

            <div className='edit-field'>
              <label>Food type</label>
              <div className='edit-type'>
                <button type='button' className={'edit-type-btn veg' + (form.type === 'veg' ? ' active' : '')} onClick={() => setForm(f => ({ ...f, type: 'veg' }))}>
                  <span className='veg-dot veg'></span> Veg
                </button>
                <button type='button' className={'edit-type-btn nonveg' + (form.type === 'nonveg' ? ' active' : '')} onClick={() => setForm(f => ({ ...f, type: 'nonveg' }))}>
                  <span className='veg-dot nonveg'></span> Non-veg
                </button>
              </div>
            </div>

            <div className='edit-actions'>
              <button type='button' className='edit-btn ghost' onClick={closeEdit} disabled={saving}>Cancel</button>
              <button type='submit' className='edit-btn' disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default List
