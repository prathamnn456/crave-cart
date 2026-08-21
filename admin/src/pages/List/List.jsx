import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles", "Biryani", "Pizza", "Burger", "Chicken", "Paneer", "Momos", "Thali", "Seafood", "Beverages", "Ice Cream"];

const List = ({ search = '' }) => {

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [editing, setEditing] = useState(null);   // item currently being edited
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Salad", type: "veg" });
  const [newImage, setNewImage] = useState(null); // optional replacement image
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error")
      }
    } finally {
      setLoading(false);
    }
  }

  const toggleAvailability = async (item) => {
    try {
      const res = await axios.post(`${url}/api/food/availability`, { id: item._id, available: item.available === false });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error("Error");
      }
    } catch {
      toast.error("Error");
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

  const q = search.trim().toLowerCase();
  const filtered = q
    ? list.filter(it => it.name.toLowerCase().includes(q) || (it.category || '').toLowerCase().includes(q))
    : list;

  return (
    <div className='list'>
      <div className="page-head">
        <div>
          <h1>Menu</h1>
          <div className="sub">{list.length} item{list.length === 1 ? '' : 's'} live on CraveCart.</div>
        </div>
        <div className="view-toggle">
          <button className={'view-btn' + (view === 'grid' ? ' active' : '')} onClick={() => setView('grid')} title='Grid view' aria-label='Grid view'>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
          </button>
          <button className={'view-btn' + (view === 'table' ? ' active' : '')} onClick={() => setView('table')} title='Table view' aria-label='Table view'>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className='menu-grid'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div className='food-card' key={i}>
              <div className='sk' style={{ height: 150 }}></div>
              <div className='food-body'>
                <div className='sk sk-line lg'></div>
                <div className='sk sk-line' style={{ marginTop: 8 }}></div>
                <div className='sk sk-line sm' style={{ marginTop: 12 }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className='menu-empty'>
          <div className='menu-empty-icon'>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v16" strokeLinecap="round" /></svg>
          </div>
          <p>No items on the menu yet</p>
          <span>Add your first dish to get started.</span>
          <button onClick={() => navigate('/add')}>+ Add Item</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className='menu-empty'>
          <div className='menu-empty-icon'>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg>
          </div>
          <p>No items match "{search}"</p>
          <span>Try a different search.</span>
        </div>
      ) : view === 'grid' ? (
        <div className='menu-grid'>
          {filtered.map((item) => (
            <div key={item._id} className={'food-card' + (item.available === false ? ' is-out' : '')}>
              <div className='food-thumb'>
                <img src={`${url}/images/` + item.image} alt={item.name} />
                {item.available === false && <span className='food-oos'>Out of stock</span>}
                <span className='food-veg' title={item.type === 'nonveg' ? 'Non-veg' : 'Veg'}>
                  <span className={'veg-dot' + (item.type === 'nonveg' ? ' nonveg' : ' veg')}></span>
                </span>
                <button className='food-edit' title='Edit item' onClick={() => openEdit(item)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className='food-remove' title='Remove item' onClick={() => removeFood(item._id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className='food-body'>
                <b className='food-name'>{item.name}</b>
                <p className='food-desc'>{item.description}</p>
                <div className='food-foot'>
                  <span className='food-cat'>{item.category}</span>
                  <span className='food-price tnum'>{currency}{item.price}</span>
                </div>
                <div className='food-stock'>
                  <span>{item.available === false ? 'Out of stock' : 'Available'}</span>
                  <button
                    type='button'
                    className={'switch' + (item.available !== false ? ' on' : '')}
                    onClick={() => toggleAvailability(item)}
                    aria-label='Toggle availability'
                  >
                    <span className='switch-knob'></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='panel table-wrap'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th className='ta-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className='cell-item'>
                      <img src={`${url}/images/` + item.image} alt={item.name} />
                      <div>
                        <b>{item.name}</b>
                        <span>{item.description}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className='food-cat'>{item.category}</span></td>
                  <td>
                    <span className='cell-type'>
                      <span className={'veg-dot' + (item.type === 'nonveg' ? ' nonveg' : ' veg')}></span>
                      {item.type === 'nonveg' ? 'Non-veg' : 'Veg'}
                    </span>
                  </td>
                  <td><b className='cell-price'>{currency}{item.price}</b></td>
                  <td>
                    <div className='food-stock'>
                      <button
                        type='button'
                        className={'switch' + (item.available !== false ? ' on' : '')}
                        onClick={() => toggleAvailability(item)}
                        aria-label='Toggle availability'
                      >
                        <span className='switch-knob'></span>
                      </button>
                      <span className='cell-stock-label'>{item.available === false ? 'Out' : 'In stock'}</span>
                    </div>
                  </td>
                  <td className='ta-right'>
                    <div className='cell-actions'>
                      <button className='row-btn' title='Edit' onClick={() => openEdit(item)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button className='row-btn danger' title='Remove' onClick={() => removeFood(item._id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
