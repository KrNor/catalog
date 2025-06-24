import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Tag from "../models/tag";
import Product from "../models/product";
import Category from "../models/category";

const mongooseServerUri = process.env.MONGODB_URI as string;
// console.log(mongooseServerUri);
// console.log(typeof mongooseServerUri);

const newTags = [
  {
    tagName: "Origin country",
    tagAttributes: ["Canada", "Japan"],
  },
  {
    tagName: "Maker",
    tagAttributes: ["Suzuki", "Mazda"],
  },
];

const newCategories1 = [
  {
    name: "Paint",
    description: "Things that color other things",
  },
  {
    name: "Interior",
    description: "Things inside cars",
  },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newCategories2 = (pcategory1: any, pcategory2: any) => {
  return [
    {
      name: "Car paint",
      description: "Car related paint",
      parent: pcategory1._id,
      lineage: [pcategory1._id],
    },
    {
      name: "Interior seating",
      description: "car interior chairs and other seating options",
      parent: pcategory2._id,
      lineage: [pcategory2._id],
    },
    {
      name: "Interior cleaning",
      description: "Things to clean the interior",
      parent: pcategory2._id,
      lineage: [pcategory2._id],
    },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newCategories3 = (parent: any, grandParent: any) => {
  return [
    {
      name: "Interior cleaning cloths",
      description: "Cloths to clean interior with",
      parent: parent._id,
      lineage: [grandParent._id, parent._id],
    },
    {
      name: "Interior cleaning bushes",
      description: "bushes to clean interior with",
      parent: parent._id,
      lineage: [grandParent._id, parent._id],
    },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newProducts = (clothCategory: any, carpaintCategory: any) => {
  return [
    {
      name: "Mazda ds401 cloth",
      price: 50000,
      availability: 5,
      identifier: "dhniofcg7474",
      descriptionShort: "Best cloth for Mazda cars",
      descriptionLong:
        "Best cloth for Mazda cars,Best cloth for Mazda cars,Best cloth for Mazda cars,Best cloth for Mazda cars",
      category: clothCategory._id,
      tags: [
        { tagName: "Origin country", tagAttribute: "Japan" },
        {
          tagName: "Maker",
          tagAttribute: "Mazda",
        },
      ],
    },
    {
      name: "Car Paint Carbon fiber",
      price: 9000,
      availability: 20,
      identifier: "hfthj472318t",
      descriptionShort: "Car paint for paint cars",
      descriptionLong:
        "Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, sasd",
      category: carpaintCategory._id,
      tags: [
        { tagName: "Origin country", tagAttribute: "Canada" },
        {
          tagName: "Maker",
          tagAttribute: "Suzuki",
        },
      ],
    },
    {
      name: "Car Paint red",
      price: 2400,
      availability: 1,
      identifier: "hfthj4tf18t",
      descriptionShort: "Car paint for paint cars",
      descriptionLong:
        "Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, sasd",
      category: carpaintCategory._id,
      tags: [
        { tagName: "Origin country", tagAttribute: "Canada" },
        {
          tagName: "Maker",
          tagAttribute: "Suzuki",
        },
      ],
    },
    {
      name: "Car Paint brown",
      price: 2400,
      availability: -2,
      identifier: "hfthj4tfp8t",
      descriptionShort: "Car paint for paint cars",
      descriptionLong:
        "Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, sasd",
      category: carpaintCategory._id,
      tags: [
        { tagName: "Origin country", tagAttribute: "Canada" },
        {
          tagName: "Maker",
          tagAttribute: "Suzuki",
        },
      ],
    },
    {
      name: "Car Paint blue",
      price: 2400,
      availability: 0,
      identifier: "hfthj4tf17t",
      descriptionShort: "Car paint for paint cars",
      descriptionLong:
        "Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, Car paint for paint cars, sasd",
      category: carpaintCategory._id,
      tags: [
        { tagName: "Origin country", tagAttribute: "Canada" },
        {
          tagName: "Maker",
          tagAttribute: "Suzuki",
        },
      ],
    },
  ];
};

async function refreshData() {
  try {
    await mongoose.connect(mongooseServerUri);
    console.log("Connected to MongoDB.");

    await Tag.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("Old data removed");

    await Tag.insertMany(newTags);
    const topCategories = await Category.insertMany(newCategories1);

    const [categoryPaint, categoryInterior] = topCategories;
    const midCategories = await Category.insertMany(
      newCategories2(categoryPaint, categoryInterior)
    );
    const [
      categoryCarPaint,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _categoryInteriorSeating,

      categoryInteriorCleaning,
    ] = midCategories;

    const lowCategories = await Category.insertMany(
      newCategories3(categoryInteriorCleaning, categoryInterior)
    );
    const [categoryInteriorCleaningCloths] = lowCategories;

    await Product.insertMany(
      newProducts(categoryInteriorCleaningCloths, categoryCarPaint)
    );
  } catch (err) {
    console.error("error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}
// console.log(process.env.TS_NODE_DEV);

if (process.env.TS_NODE_DEV) {
  refreshData();
  console.log("data probably refreshed");
} else {
  console.log("do not run this in non ts-node-dev");
}
