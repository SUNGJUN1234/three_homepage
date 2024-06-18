import React from 'react'
import Header from '../components/Header'
import Skip from '../components/Skip'
import Main from '../components/Main'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import News from '../components/News'

const HomeView = () => {
  return (
    <>
      <Skip />
      <Header />
      <Main >
        <Intro />
        <News />
      </Main>
      <Footer />
    </>
  )
}

export default HomeView
