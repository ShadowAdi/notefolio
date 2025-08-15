import axios from 'axios'
import React from 'react'

const Home = async() => {
  const response=await axios.get(`/api/blog`)
  const data=await response.data
  return (
    <div>Home</div>
  )
}

export default Home