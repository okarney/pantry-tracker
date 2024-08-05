'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { query, collection, getDocs, deleteDoc, setDoc, doc, getDoc, searchItem } from "firebase/firestore";
// import Typography from '@mui/material/Typography';

import pantry1 from "./pantry1.jpg";
import pantry2 from "./pantry2.jpeg";
import pantry3 from "./pantry3.png";
import kitchen from "./kitchen.jpg";


// const pantry1 = "./pantry1.jpg";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const [itemName, setItemName] = useState("");
  const [searchMessage, setSearchMessage] = useState("");


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }


  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} =docSnap.data()

       await deleteDoc(docRef)
      
    }
    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} =docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory();
  
};

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} =docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1}, {merge: true}) 
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory();
  }

  const searchItem = async (item) => {
    const collectionRef = collection(firestore, 'inventory');
    const docRef = doc(collectionRef, item);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      //setInventory([]);
      setSearchMessage("Item not found.");
    } else {
     // setInventory([{ id: docSnap.id, ...docSnap.data() }]);
      setSearchMessage(`You have ${item} in your pantry!`);
    }
  };


  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpenAdd = () => setOpenAdd(true)
  const handleOpenSearch = () => setOpenSearch(true)

  const handleClose = () => setOpenAdd(false)


  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
      sx={{
        backgroundImage: `url(${kitchen.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Modal open={openAdd} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          borderRadius="20px"
          sx={{
            transform: "translate(-50%,-50%)",

          }}
        >
          <Typography variant="h6">Add Item</Typography>
          
          <Stack width="100%" direction="row" spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      
      <Stack direction="row" spacing={12}>
        <Button sx={{color: "green", border:"2px solid green"}} variant="outline" onClick={() => {
          handleOpenAdd()
        }}
        >Add New Item</Button>
        <Button sx={{color: "green", border:"2px solid green"}} variant="outline" onClick={() => {
          handleOpenSearch()
        }}
        >Search</Button>
      </Stack>

<Modal open={openSearch} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          borderRadius="20px"
          sx={{
            transform: "translate(-50%,-50%)",

          }}
        >
          <Typography variant="h6" fontFamily="cursive">Find Item</Typography>
          
          <Stack>
            <Stack width="100%" direction="row" spacing={2}
            >
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
              />
              <Button
                sx={{color: "green", border:"2px solid green"}} 
                variant="outlined"
                onClick={() => {
                  searchItem(itemName)
                }}
              >Search</Button>
            </Stack>
            <Typography fontFamily="cursive"><br></br>{searchMessage}</Typography>

          </Stack>
        </Box>
      </Modal>
      
      

      <Stack width="100vw" height="70vh" spacing="10vw" direction="row" display="flex" justifyContent="center">

      <Box borderRadius="20px">
        <Box 
        width="30vw" 
        height="12vh"
        bgcolor="#818d69e8"
        borderRadius="20px"
        >
          <Typography fontFamily="cursive" fontSize="3.5vw" color="#000000" display="flex" alignItems="center" justifyContent="center">
            Pantry Items
          </Typography>
        </Box>
      <Stack width="30vw" height="60vh" spacing={2} overflow="auto"         borderRadius="20px"
      >
        {
          inventory.map(({name, quantity}) => (
            <Box 
              key={name} 
              width="100%"
              minHeight="10vh" 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between" 
              bgcolor="#ecf1e2cd" 
              borderRadius="20px"
              padding={3} 
            >
              <Typography  fontFamily="cursive" fontSize="2vw" color="#13515tr" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography fontFamily="cursive" fontSize="2vw" color="#13515tr" textAlign="center">
                {quantity}
              </Typography>
              <Stack  direction="row" spacing="1vw">
              <Typography fontFamily="cursive" fontSize="6vw" color="#13515tr" textAlign="center">
                      
              </Typography>
                <Button variant="contained" bgColor="#79865b00" sx={{height:"3.8vh", width:"1vw", color:"black", fontFamily: "cursive", fontSize: "3.2vw", backgroundColor: '#79865b00', boxShadow: 'none', '&:hover': {backgroundColor: '#79865b00', boxShadow: 'none'}}} onClick={()=>{
                  addItem(name)
                }}>+</Button>
                <Button variant="contained" bgColor="#79865b00" sx={{height:"2.5vh", width:"1vw", color:"black", fontFamily: "cursive", fontSize: "4.2vw", backgroundColor: '#79865b00', boxShadow: 'none', '&:hover': {backgroundColor: '#79865b00', boxShadow: 'none'}}} onClick={()=>{
                  removeItem(name)
                }}>-</Button>
                <Button variant="contained" bgColor="#79865b00" sx={{height:"4vh", width:"1vw", fontSize: "1.5vw", backgroundColor: '#79865b00', boxShadow: 'none', '&:hover': {backgroundColor: '#79865b00', boxShadow: 'none'}}} onClick={()=>{
                  deleteItem(name)
                }}>❌</Button>
              </Stack>
            </Box>
            
          ))}
      </Stack>
    </Box>



    

    </Stack>



    </Box>

  )
}
