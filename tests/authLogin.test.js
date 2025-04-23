import request from "supertest";
import jwt from "jsonwebtoken";
import User from "../db/models/Users.js";
import app from "../app.js";
import { subscriptionTypes } from "../constants/auth.js";

const { PORT = 3000 } = process.env;
const port = Number(PORT);

describe("test /api/auth/login", () => {
  let server = null;

  beforeAll(async () => {
    server = app.listen(port, () => {
      console.log(`My Test server running on port ${port}`);
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  const loginData = {
    email: "artur.myhajlyuk@gmail.com",
    password: "123456",
  };

  let response = null;

  beforeEach(async () => {
    response = await request(app).post("/api/auth/login").send(loginData);
    console.log(response.body);
  });

  test("should return status 200", () => {
    expect(response.status).toBe(200);
  });

  test("should return a valid token", () => {
    const { token } = response.body;

    expect(token).toEqual(expect.any(String));
    expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

    const decoded = jwt.decode(token);
    expect(decoded).toBeTruthy();
    expect(decoded.email).toBe(loginData.email);
  });

  test("should return a user object with email and subscription", () => {
    const { user } = response.body;

    expect(user).toHaveProperty("email");
    expect(user.email).toEqual(expect.any(String));

    expect(user).toHaveProperty("subscription");
    expect(user.subscription).toEqual(expect.any(String));

    expect(subscriptionTypes).toContain(user.subscription);
  });

  test("should find the user in the database", async () => {
    const user = await User.findOne({
      where: {
        email: loginData.email,
      },
    });

    expect(user).toBeTruthy();
  });
});
