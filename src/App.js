import { useState } from "react";

export default function App(){
  //Default
  // const [Items,setItems]=useState([{ id: 1, description: "Passports", quantity: 2, packed: true },{ id: 2, description: "Socks", quantity: 12, packed: false },])
  const [Items,setItems]=useState([])
  function UpdateItems(Data){
    setItems(Items=>[...Items,Data]) //Input perameter always self item
  }
  function ClearList(){
    setItems([])
  }
  function DeleteItem(id){
    setItems(Items=>Items.filter(x=>x.id!==id)) //Input perameter always self item
  }
  function UpdateExistingItem(id){
    setItems(Items=>Items.map(x=> x.id===id? {...x,packed:!x.packed}: x))
  }
  return(
    <div className="app">
      <Logo />
      <Form UpdateItems={UpdateItems}/>
      <List Items={Items} DeleteItem={DeleteItem} UpdateExistingItem={UpdateExistingItem} ClearList={ClearList}/>
      <Footer Items={Items}/>
    </div>
  )
}
function Logo(){
  return (<div>
    <h1>BUCKET LIST</h1>
  </div>)
}

function Form({UpdateItems}){
  function FormHandle(e){
    e.preventDefault()
    if(!description) return
    let New={id:Date.now(),description:description, quantity:quantity, packed: false}
    // console.log(New);
    UpdateItems(New)
    setdescription("")
    setquantity(1)
  }
  const [description, setdescription]=useState('')
  const [quantity, setquantity]=useState(1)

return(
  <form className="add-form" onSubmit={FormHandle}>
    <h3>What I want for my Bucket List? </h3>
    <select value={quantity} onChange={e=>{
      setquantity(Number(e.target.value))
    }}>
      {Array.from({ length: 20 }, (_, index) => index+1).map(x=>(
        <option value={x} key={x}>{x}</option>
      ))}
    </select>
    <input type="text" placeholder="item" value={description} onChange={e=>{
      setdescription(e.target.value)
    }}></input>
    <button>Add</button>
  </form>
)
}
function List({Items, DeleteItem, UpdateExistingItem, ClearList}){
  const [SortItem,setSortItem]=useState('input')
  let NewSortedItems
  if(SortItem==="input"){
    NewSortedItems=Items
  }
  else if(SortItem==="desc"){
    NewSortedItems=Items.slice().sort((a,b)=>a.description.localeCompare(b.description))
  }
  else if(SortItem==="packed") {
    NewSortedItems=Items.sort((a,b)=>Number(a.packed)-Number(b.packed))
  }
  else if(SortItem==="quantityAsc") {
    NewSortedItems=Items.sort((a,b)=>Number(a.quantity)-Number(b.quantity))
  }
  else if(SortItem==="quantityDsc") {
    NewSortedItems=Items.sort((a,b)=>Number(b.quantity)-Number(a.quantity))
  }
  return(
    <div className="list">
      <ul>
        {NewSortedItems.map((x)=>(<EachItem details={x} DeleteItem={DeleteItem} UpdateExistingItem={UpdateExistingItem} key={x.id}/>))}
      </ul>
      <div className="actions" >
        <select value={SortItem} onChange={e=>setSortItem(e.target.value)} id="">
          <option value="input">Sort by input</option>
          <option value="desc">Sort by description</option>
          <option value="packed">Sort by packed</option>
          <option value="quantityAsc">Sort by quantity Asc</option>
          <option value="quantityDsc">Sort by quantity Dsc</option>
        </select>
        <button onClick={ClearList}>Clear List</button>
      </div>
    </div>
  )
}
function EachItem({details, DeleteItem, UpdateExistingItem}){
  const [hide,sethide]=useState(0)
  return(
    <li className="BtnList" onMouseOver={()=> sethide(x=>x=1)} onMouseOut={()=> sethide(x=>x=0)}>
      <input type="checkbox" value={details.packed} onChange={()=>UpdateExistingItem(details.id)}></input>
       <span className={details.packed===true? 'cross': "no"}>{details.quantity} {details.description} </span> <button  className={hide===0? "hide btnsize":"btnsize "}  onClick={()=>{
        DeleteItem(details.id) //We can't modify proops here. That's why we will pass the item using lift function
       }}>⛔</button>
    </li>
  )
}
function Footer({Items}){
  if(Items.length===0){
    return ( <footer className="stats">
    Please add new items.
  </footer>)
  }
  let numberOfItems=Items.length
  let Filled=Items.filter(x=>x.packed===true).length
  let percent=Math.round((Filled/numberOfItems)*100)
  return(
    <footer className="stats">
      {percent===100? "Great you filled all your Bucket list.":`I have ${numberOfItems} items in the list and ${Filled} items filled ${percent}%`}
    </footer>
  )
} 
