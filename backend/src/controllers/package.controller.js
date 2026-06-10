import Package from "../models/package.model.js"


// create the package contoller 
const createPackage = async (req, res) => {
    try {
        const {name, validityDays, totalMeals, price, description} = req.body

        if(!name || !validityDays ||!totalMeals ||!price) {
            return res.this.statua(400).json({
                message:"Name, validityDays, TotalMelas And Price is Required",
                success:false
            })
        }

        let normalizeName = name.trim().toLowerCase() 

        let existingPackageName = await Package.findOne(normalizeName)

        if(existingPackageName) {
            return res.status(400).json({
                message: "Package Name Already Exist",
                success:false
            })
        }

        let numricPrice = Number(price)

        if(isNaN(numricPrice) || numricPrice < 0) {
            return res.status(400).json({
                message:"Price should be in postive number",
                success:false
            })
        }

        let numricMeals = Number(totalMeals)

         if(isNaN(numricMeals) || numricMeals < 0) {
            return res.status(400).json({
                message:"Total should be in postive number",
                success:false
            })
        }

         let numricValidityDays = Number(validityDays)

         if(isNaN(numricValidityDays) || numricValidityDays < 0) {
            return res.status(400).json({
                message:"validity days should be in postive number",
                success:false
            })
        }

        const package = await Package.create({
            name:normalizeName,
            validityDays: numricValidityDays,
            totalMeals:numricMeals,
            price: numricPrice,
            description,
            isActive,
            isAddOnAllowed,
        })

        return res.status(201).json({
            message:"package created successfully",
            data:package,
            success:true
        })

    } catch (error) {
        console.log("Create package error", error)

        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}