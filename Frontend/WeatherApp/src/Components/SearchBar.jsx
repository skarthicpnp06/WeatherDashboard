import React from 'react'
import { useState } from 'react'

const SearchBar = ({fetchweather}) => {
  const [city,setcity]=useState("")
  const handlesearch=()=>{
    if(city.trim()===""){alert("please enter city name"); return}
    fetchweather(city)
  }

  return (
    <div className="search-box">
      <input type="text" 
      placeholder='Enter city' 
      value={city} 
      onChange={
        (e)=>{setcity(e.target.value)}
        }/>
      <button onClick={handlesearch}>
        Submit
      </button>
    </div>
  )
}

export default SearchBar