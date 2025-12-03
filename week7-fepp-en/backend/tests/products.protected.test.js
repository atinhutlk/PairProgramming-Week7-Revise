require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const api = request(app);

const createSampleProduct = () => ({
  title: "Test Product",
  category: "Electronics",
  description: "A test product",
  price: 100,
  stockQuantity: 10,
  supplier: {
    name: "Test Supplier",
    contactEmail: "supplier@example.com",
    contactPhone: "123456789",
    rating: 4,
  },
});

const createUserAndGetToken = async (role = "Admin", email = null) => {
  const userData = {
    name: `${role} User`,
    email: email || `${role.toLowerCase()}@example.com`,
    password: "Password123",
    role,
    address: "Some test address",
  };

  const res = await api.post("/api/users/register").send(userData).expect(201);

  return res.body.token;
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
}, 20000);

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Protected Product API routes", () => {
  // ---------- POST /api/products ----------

  test("POST /api/products - authenticated (valid token)", async () => {
    const token = await createUserAndGetToken("Admin");

    const res = await api
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send(createSampleProduct())
      .expect(201);

    expect(res.body.title).toBe("Test Product");
  });

  test("POST /api/products - unauthenticated (no token)", async () => {
    const res = await api
      .post("/api/products")
      .send(createSampleProduct())
      .expect(401);

    expect(res.body.message).toBeDefined();
  });

  test("POST /api/products - invalid token", async () => {
    const res = await api
      .post("/api/products")
      .set("Authorization", "Bearer invalid.token.here")
      .send(createSampleProduct())
      .expect(401);

    expect(res.body.message).toBeDefined();
  });

  // ---------- GET /api/products ----------

  test("GET /api/products - authenticated request", async () => {
    const token = await createUserAndGetToken("Admin");

    await api
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send(createSampleProduct())
      .expect(201);

    const res = await api
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Test Product");
  });

  test("GET /api/products - unauthenticated", async () => {
    const token = await createUserAndGetToken("Admin");

    await api
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send(createSampleProduct())
      .expect(201);

    await api.get("/api/products").expect(401);
  });

  // ---------- PUT /api/products/:id ----------

  test("PUT /api/products/:id - authenticated", async () => {
    const token = await createUserAndGetToken("Admin");
    const product = await Product.create(createSampleProduct());

    const res = await api
      .put(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ...createSampleProduct(), title: "Updated Title" })
      .expect(200);

    expect(res.body.title).toBe("Updated Title");
  });

  test("PUT /api/products/:id - unauthenticated", async () => {
    const product = await Product.create(createSampleProduct());

    await api
      .put(`/api/products/${product._id}`)
      .send({ ...createSampleProduct(), title: "Nope" })
      .expect(401);
  });

  // ---------- DELETE /api/products/:id ----------

  test("DELETE /api/products/:id - authenticated", async () => {
    const token = await createUserAndGetToken("Admin");
    const product = await Product.create(createSampleProduct());

    await api
      .delete(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const productsInDb = await Product.find({});
    expect(productsInDb).toHaveLength(0);
  });

  test("DELETE /api/products/:id - unauthenticated", async () => {
    const product = await Product.create(createSampleProduct());

    await api.delete(`/api/products/${product._id}`).expect(401);
  });

  // ---------- CRUD với nhiều roles ----------

  test("CRUD operations work with different user roles (Admin, Seller, Buyer)", async () => {
    const adminToken = await createUserAndGetToken(
      "Admin",
      "admin@example.com"
    );
    const sellerToken = await createUserAndGetToken(
      "Seller",
      "seller@example.com"
    );
    const buyerToken = await createUserAndGetToken(
      "Buyer",
      "buyer@example.com"
    );

    const created = await api
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(createSampleProduct())
      .expect(201);

    const productId = created.body._id || created.body.id;

    const sellerGet = await api
      .get("/api/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .expect(200);

    expect(sellerGet.body).toHaveLength(1);

    const buyerGetOne = await api
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .expect(200);

    expect(buyerGetOne.body.title).toBe("Test Product");
  });
});
