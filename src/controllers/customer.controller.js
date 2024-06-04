import fs from "fs";
import path from "path";

const dataPath = path.resolve('customers.json');

// Helper function to read data from the file
const readData = () => {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
};

// Helper function to write data to the file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
};

// List API with search and pagination
export const getCustomers = (req, res) => {
  let { first_name, last_name, city, page = 1, limit = 10 } = req.query;
  let customers = readData();

  if (first_name) {
    customers = customers.filter((customer) =>
      customer.first_name.toLowerCase().includes(first_name.toLowerCase())
    );
  }
  if (last_name) {
    customers = customers.filter((customer) =>
      customer.last_name.toLowerCase().includes(last_name.toLowerCase())
    );
  }
  if (city) {
    customers = customers.filter((customer) =>
      customer.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultCustomers = customers.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: customers.length,
    customers: resultCustomers,
  });
};

// Get single customer data by id
export const getCustomerById = (req, res) => {
  const customers = readData();
  const customer = customers.find((c) => c.id === parseInt(req.params.id, 10));
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: "Customer not found" });
  }
};

// List all unique cities with number of customers from a particular city
export const getUniqueCities = (req, res) => {
  const customers = readData();
  const cityCount = customers.reduce((acc, customer) => {
    acc[customer.city] = (acc[customer.city] || 0) + 1;
    return acc;
  }, {});

  res.json(cityCount);
};

// Add a customer with validations
export const addCustomer = (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;
  if (!id || !first_name || !last_name || !city || !company) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const customers = readData();

  // Validate if city and company already exist
  const validCity = customers.some((customer) => customer.city === city);
  const validCompany = customers.some(
    (customer) => customer.company === company
  );

  if (!validCity) {
    return res.status(400).json({ message: "City does not exist" });
  }

  if (!validCompany) {
    return res.status(400).json({ message: "Company does not exist" });
  }

  // Check if customer with same id already exists
  if (customers.some((customer) => customer.id === id)) {
    return res
      .status(400)
      .json({ message: "Customer with this ID already exists" });
  }

  customers.push({ id, first_name, last_name, city, company });
  writeData(customers);

  res.status(201).json({ message: "Customer added successfully" });
};
