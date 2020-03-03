//-----------------------------------TO DO LIST -----------------------------------------------------------------
const { stock, customers } = require("./data/promo")
let status
const items = [];

const homePage = (req, res) => {
    res.render("pages/home", {items: items})
}


const addTaskHandler = (req, res) => {
   // console.log(req.body) // returns{ itemo: 'ss' } ss is what i typed
    const {itemo: lala} = req.body //req.body comes in as an obj itemo is the key taken from the name i gave <input. WE ARE DECONSTRUCTING THE OBJECT HERE { itemo: 's' }
    //console.log(lala)
     items.push(lala);
    res.redirect("/todos")
}
//-----------------------------------ORDER FORM -----------------------------------------------------------------

const inventoryHandler = (req, res) => {
    let receivedData = req.body 
    console.log(receivedData) // checking what were getting from the front end 
    let status;

//--- If Name appears in databse then dont ship again 
customers.forEach(individualCust => {
    
        if(receivedData.givenName === individualCust.givenName || receivedData.address === individualCust.address ) {
           status = 550;
        } 
         else {
            status = 200
        }
    });

//---We ship only to Canada
if (receivedData.country !== "Canada") {
    status = 650
} 

let shirtInventory = stock.shirt;
console.log(shirtInventory)

//---Inventory check
Object.keys(shirtInventory).forEach(item => { //shift through all the keys and if it matches what user chose THEN see if our inventory ( 'shirtInventory' ) is bigger than 0

    if(receivedData.size == item && shirtInventory[item] == 0 ) { //cant use === as its in quote in the data
        status = 450
    }
})

//---Missing information in the form. QUOTES WERE NEEDED ON UNDEFINED LOOK AT TERMINAL FOR console.log(receivedData)

if(receivedData.order == "shirt" && receivedData.size == "undefined") {
    status = 400
}

//--Switch case will be responsable for res.status and rs.json to the script front end

    switch(status) {
        case 550:
        res.status(550).json({status:'550', error: "Existing User"})
        break;
        case 200:
        res.status(200).json({status:'success'})
        break;
        case 650:
        res.status(650).json({status:"650", error:"Outside of delivery zone"})
        break;
        case 450:
        res.status(450).json({status:"450", error:"Item out of stock "})
        break;
        case 400:
        res.status(400).json({status:"401", error:"Missing information"})
         break;
        default:
        console.log("default")
        break;
    }

}



const confirmedHandler = (req, res) => {

   
    res.render("pages/confirmation")

}




module.exports = {
    homePage,
    addTaskHandler,
    inventoryHandler,
    confirmedHandler
};


