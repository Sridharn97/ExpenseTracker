const express = require('express');
const mongoose=require("mongoose")
const app = express();
app.use(express.json())
const { v4: uuidv4 } =require('uuid');

mongoose.connect("mongodb+srv://SridharN:Sridharn09@cluster0.lmt13.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/expenses").then(()=>{console.log("db connected succesfully")}).catch((err)=>{
    console.log(err)
})
const expenseSchema=new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:String,required:true}
})

const Expense=mongoose.model("Expense",expenseSchema)

// app.use(express.json()); //middlevar


app.get("/api/expenses/:id",async (req, res) => {
    const {id}=req.params;
    try{
        console.log(id)
    const expense = await Expense.find()
    if (!expense) {
        res.status(404).json({ message: "Not Found" })
        return;
    }
    res.status(200).json(expense);
}catch(error){
    res.status(500).json({message:"Internal server error"})
}
});



app.get("/api/expenseses/:id",async (req, res) => {
    const {id}=req.params;
    try{
    const expense = await Expense.findOne({id})
    if (!expense) {
        res.status(404).json({ message: "Not Found" })
        return;
    }
    res.status(200).json(expense);
}catch(error){
    res.status(500).json({message:"Internal server error"})
}
});

// app.delete("/api/expenses/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = expenses.findIndex((expense) => expense.id === id)
//     if (index === -1) {
//         res.status(404).json({ message: "Not Found" })
//         return;
//     }
//     expenses.splice(index, 1)
//     res.status(200).json({ message: "Expense deleted successfully" })
// });


app.put("/api/expenses/:id", async(req, res) => {
    const {id}=req.params;
    const { title, amount } = req.body; 
    const updatedExpense = await Expense.findOneAndUpdate(
        { id }, 
        { $set: { title, amount } }, 
        { new: true }
    );

    if (!updatedExpense) {
        res.status(404).json({ message: "Not Found" });
        return;
    }

    res.status(200).json({ message: "Expense updated successfully", updatedExpense});
});

app.post("/api/expenses",async(req,res)=>{
   try{
    const{title,amount}=req.body;
    if(!title || !amount){
        res.status(400).json({message:"Please Provide both title and amount"})
    }
    const newExpense=new Expense({
        id:uuidv4(),
        title:title,
        amount:amount
    })
    const savedExpense=await newExpense.save()
    res.status(201).json(savedExpense)
}catch(error){
    res.status(500).json({message:"Internal server error"})
}
    
})
app.delete("/api/expenses/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteExpense=await Expense.findOneAndDelete({id})
        if(!deleteExpense){
            res.status(404).json({message:"Expense Not Found"})
            return
        }
        res.status(200).json({message:"Deleted Successfully"})
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})
app.get("/api/allexpense",async(req,res)=>{
    const alldata=await Expense.find()
    res.status(200).json(alldata)
})
app.listen(3000, () => {
    console.log("Server is running");
});

