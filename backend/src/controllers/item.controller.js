import Item from "../models/item.model.js";


// ➤ Create Item
export const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Get All Items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Get Single Item
export const getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Update Item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Delete Item
export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Disable / Enable Item
export const toggleItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.isActive = !item.isActive;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Get Items by Category
export const getItemsByCategory = async (req, res) => {
  try {
    const items = await Item.find({ category: req.params.categoryId, isActive: true })
      .populate("category");

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Get Items by Meal Type (breakfast/lunch/dinner)
export const getItemsByMeal = async (req, res) => {
  try {
    const items = await Item.find({
      mealType: req.params.mealType,
      isActive: true,
    }).populate("category");

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};