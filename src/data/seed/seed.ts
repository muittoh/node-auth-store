import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";

(async () => {
  if (envs.NODE_ENV !== 'development') {
    throw new Error('la semilla solo puede ejecutarse en desarrollo');
  }

  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  await MongoDatabase.disconnect();
})();

const randomBetweenZeroAndX = (x: number) => {
  return Math.floor(Math.random() * x);
}

async function main() {

  // 0- borrar todo
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  // 1- crear usuarios
  const users = await UserModel.insertMany(seedData.users);

  // 2- crear categorías
  const categories = await CategoryModel.insertMany(
    seedData.categories.map(category => {
      return {
        ...category,
        user: users[randomBetweenZeroAndX(seedData.users.length - 1)]?._id,
      }
    })
  );

  // 3- crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map(product => {
      return {
        ...product,
        user: users[randomBetweenZeroAndX(seedData.users.length - 1)]?._id,
        category: categories[randomBetweenZeroAndX(seedData.categories.length - 1)]?._id,
      }
    })
  )

  console.log('SEEDED');
}