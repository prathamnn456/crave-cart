import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Features from '../../components/Features/Features'
import AppDownload from '../../components/AppDownload/AppDownload'
import FoodModal from '../../components/FoodModal/FoodModal'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'

const Home = () => {

  const [category,setCategory] = useState("All")
  const [search,setSearch] = useState("")
  const [foodType,setFoodType] = useState("all")
  const [quickItem,setQuickItem] = useState(null)
  const { foodLoading } = useContext(StoreContext)

  // re-scan reveal targets once food has loaded (grid appears then)
  useScrollReveal([foodLoading])

  return (
    <>
      <Header search={search} setSearch={setSearch}/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <FoodDisplay category={category} search={search} foodType={foodType} setFoodType={setFoodType} onQuickView={setQuickItem}/>
      <Features/>
      <AppDownload/>
      {quickItem && <FoodModal item={quickItem} onClose={() => setQuickItem(null)} />}
    </>
  )
}

export default Home
