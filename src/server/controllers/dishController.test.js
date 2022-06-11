const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");

const Dish = require("../../database/models/Dish");
const mockDishes = require("../mocks/mockDishes");
const { getDishes, deleteDish } = require("./dishController");
const connectDB = require("../../database");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});
beforeEach(async () => {
  await Dish.create(mockDishes[0]);
});

afterEach(async () => {
  await Dish.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a getDish function", () => {
  describe("When it receives a request", () => {
    test("Then it should call the response's status method with 200", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const dishMock = [{ id: "1212", name: "macarrones" }];

      Dish.find = jest.fn().mockResolvedValue(dishMock);
      const expectedStatus = 200;

      await getDishes(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(dishMock);
    });
  });
});

describe("When ocurs an error", () => {
  test("Then it should call the response's method with 404 and 'Page Not Found' error message", async () => {
    const expectedErrorMessage = "Page Not Found";
    const expectedError = new Error(expectedErrorMessage);
    const next = jest.fn();

    Dish.find = jest.fn().mockResolvedValue(false);
    await getDishes(null, null, next);

    expect(next).not.toHaveBeenCalledWith(expectedError);
  });
});

describe("Given a deleteDish function", () => {
  describe("When it receives a request", () => {
    test("Then is should call the respons's status method with 200 and a json message", async () => {
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const req = { params: { idDishes: "2121" } };
      Dish.findByIdAndDelete = jest.fn().mockResolvedValue(mockDishes[0]);

      const expectedMessage = { msg: "Deleted dish with ID: 2121" };

      await deleteDish(req, res);
      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
